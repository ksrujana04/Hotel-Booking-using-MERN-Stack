import mongoose from "mongoose";

const BookingSchema = new mongoose.Schema({
    userEmail: {
        type: String,
        required: true,
    },
    hotelName: {
        type: String,
        required: true,
    },
    noOfRoomsBooked: {
        type: Number,
        required: true,
    },
    totalPricePaid: {
        type: Number, // Use Number for float values
        required: true,
    },
    userCountry: {
        type: String,
        required: true,
    },
    userCity: {
        type: String,
        required: true,
    },
    hotelId: { type: mongoose.Schema.Types.ObjectId, ref: "Hotel", required: true },
    hotelCity: {
        type: String,
        required: true,
    },
    hotelAddress: {
        type: String,
        required: true,
    },
    hotelRating: {
        type: Number, // Use Number for float values
        required: true,
    },
    bookingDate: {
        type: Date, // Use Date type for booking dates
        required: true,
    },
    nightsBooked: {
        type: Number,
        required: true,
    },
    // You can keep the existing fields if needed, or remove them if not
    status: {
        type: String,
        enum : ["pending","confirmed","cancelled"],
        default: "pending"
    },
    paymentIntent : {
        type: String,
        unique: true,
    }
});

export default mongoose.model("Booking", BookingSchema);