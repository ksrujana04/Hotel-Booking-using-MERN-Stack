# Install fastapi and uvicorn if you haven't already
# !pip install fastapi uvicorn pymongo

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import pandas as pd
from sklearn.neighbors import NearestNeighbors
from pymongo import MongoClient
import os
from typing import List, Dict, Any

# Replace with your MongoDB Atlas connection string
# It's highly recommended to use environment variables for sensitive information like connection strings
# Example: MONGO_URI = os.environ.get('MONGO_URI')
MONGO_URI = 'mongodb+srv://srujana4619:Shyamala1964@cluster0.anjaf.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0' # Replace with your actual MongoDB Atlas connection string
DATABASE_NAME = 'test' # Replace with your database name
COLLECTION_NAME = 'bookings' # Replace with your collection name

# Initialize MongoDB client and collections
client = None
db = None
bookings_collection = None

try:
    client = MongoClient(MONGO_URI)
    db = client[DATABASE_NAME]
    bookings_collection = db[COLLECTION_NAME]
    # The ismaster command is cheap and does not require auth.
    client.admin.command('ismaster')
    print("MongoDB connection successful.")
    print(bookings_collection)
except Exception as e:
    print(f"Error connecting to MongoDB: {e}")


app = FastAPI()

# Variables to hold the loaded data and trained model globally
interaction_matrix_knn = None
knn_model = None
bookings_df_global = None

# Function to load data from MongoDB and train the model
def load_data_and_train_model():
    global interaction_matrix_knn, knn_model, bookings_df_global

    if bookings_collection is None:
        print("Database connection not established.")
        return

    # Fetch data from MongoDB
    cursor = bookings_collection.find({})
    bookings_data = list(cursor)

    if not bookings_data:
        print("No data found in MongoDB.")
        return

    # Create DataFrame
    bookings_df_global = pd.DataFrame(bookings_data)

    # Ensure necessary columns exist and are in the correct format
    if 'bookingDate' in bookings_df_global.columns:
        # Convert to datetime and handle potential errors
        bookings_df_global['bookingDate'] = pd.to_datetime(bookings_df_global['bookingDate'], errors='coerce', utc=True)
    else:
        print("Warning: 'bookingDate' column not found.")

    # Add 'interaction' column
    bookings_df_global["interaction"] = 1

    # Create interaction matrix
    interaction_matrix_knn = bookings_df_global.pivot_table(
        index='userEmail',
        columns='hotelName',
        values='interaction',
        aggfunc='sum',
        fill_value=0
    )

    # Train KNN model
    n_neighbors_to_use = min(5, interaction_matrix_knn.shape[0])
    if n_neighbors_to_use > 0:
        knn_model = NearestNeighbors(n_neighbors=n_neighbors_to_use, metric='cosine')
        knn_model.fit(interaction_matrix_knn)
    else:
        knn_model = None
        print("Not enough data to train KNN model with n_neighbors=5. Adjusting or skipping training.")


# Load data and train model when the app starts
load_data_and_train_model()


# Your recommend_hotels_knn function (assuming it's the same logic as before)
def recommend_hotels_knn(target_user_email: str, interaction_matrix: pd.DataFrame, knn_model: NearestNeighbors, bookings_df: pd.DataFrame, top_n_recommendations: int = 5) -> List[Dict[str, Any]]:
    if interaction_matrix is None or knn_model is None or bookings_df is None:
        print("Model or data not loaded.")
        return []

    if target_user_email not in interaction_matrix.index:
        print(f"User {target_user_email} not found in the interaction matrix.")
        return []

    # Get the index of the target user
    target_user_index = interaction_matrix.index.get_loc(target_user_email)

    # Find the k-nearest neighbors (excluding the target user itself)
    # Adjust n_neighbors if the number of users is less than the requested neighbors + 1
    n_neighbors_to_find = min(knn_model.n_neighbors + 1, interaction_matrix.shape[0])
    if n_neighbors_to_find <= 1:
         print("Not enough neighbors to recommend.")
         return []

    distances, indices = knn_model.kneighbors(interaction_matrix.iloc[target_user_index].values.reshape(1, -1), n_neighbors=n_neighbors_to_find)


    # Get the user emails of the k-nearest neighbors
    # Exclude the first index as it is the target user itself
    neighbor_indices = indices.flatten()[1:]
    neighbor_emails = interaction_matrix.index[neighbor_indices]

    # Identify hotels booked by the target user
    target_user_hotels = set(interaction_matrix.columns[interaction_matrix.loc[target_user_email] > 0])

    # Identify hotels booked by nearest neighbors but not by the target user
    recommended_hotels_list = []
    for neighbor_email in neighbor_emails:
        if neighbor_email in interaction_matrix.index: # Added check to ensure neighbor_email exists
            neighbor_booked_hotels = set(interaction_matrix.columns[interaction_matrix.loc[neighbor_email] > 0])
            recommended_hotels_list.extend(list(neighbor_booked_hotels - target_user_hotels))

    # Count the occurrences of each recommended hotel
    recommended_hotels_counts = pd.Series(recommended_hotels_list).value_counts()

    # Sort and return the top N recommended hotels
    top_recommendations = recommended_hotels_counts.head(top_n_recommendations)

    # Retrieve additional information (city, rating) for the recommended hotels
    recommended_hotels_info = pd.DataFrame()
    if not top_recommendations.empty and bookings_df is not None:
        # Filter bookings_df for the recommended hotel names and relevant columns
        recommended_hotels_info = bookings_df[
            bookings_df['hotelName'].isin(top_recommendations.index)
        ][['hotelName', 'hotelCity', 'hotelRating']].drop_duplicates()

        # Ensure the order of recommendations matches the sorted counts and reset index
        recommended_hotels_info = recommended_hotels_info.set_index('hotelName').loc[top_recommendations.index].reset_index()


    return recommended_hotels_info.to_dict(orient='records')

# Define a request body model using Pydantic
class RecommendationRequest(BaseModel):
    userEmail: str

# Define the recommendation endpoint
@app.post("/recommend")
async def get_hotel_recommendations(request: RecommendationRequest):
    if interaction_matrix_knn is None or knn_model is None or bookings_df_global is None:
         raise HTTPException(status_code=500, detail="Model not initialized. Check database connection and data.")

    recommendations = recommend_hotels_knn(request.userEmail, interaction_matrix_knn, knn_model, bookings_df_global)

    return recommendations

# To run this FastAPI application, you would typically use a command like:
# uvicorn your_module_name:app --reload
# in your terminal, where 'your_module_name' is the name of the Python file containing this code.