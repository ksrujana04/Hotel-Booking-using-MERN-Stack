import Stripe from "stripe";
import Room from "../models/room.js";
import Hotel from "../models/hotel.js";

export const checkoutsession = async (req,res,next) => {
    const {roomIds, dates, user,hotelId, nightsBooked, noOfRoomsBooked} = req.body;
    try{
        //console.log(roomIds);
        const rooms = await Room.find({"roomNumbers._id":{$in:roomIds}});
        const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
        var hotelDetails = await Hotel.findById(hotelId);
        const line_items = rooms.map(room => ({
            price_data:{
                currency: "usd",
                product_data: {
                    name : room.title
                },
                unit_amount: room.price * 100,
            },
            quantity:1
        }));
        //console.log(line_items)
        const session = await stripe.checkout.sessions.create({
            payment_method_types : ["card"],
            mode : "payment",
            customer_email: user.email,
            line_items,
            success_url: "http://localhost:3000",
            cancel_url: "http://localhost:3000/hotels",
    //     metadata: {
    //     roomIds: roomIds.join(","),
    //     email: user.email,
    //     dates: JSON.stringify(dates)
    //   }
            metadata: {
                        // Booking details
                        roomIds: roomIds.join(","),
                        dates: JSON.stringify(dates),
                        nightsBooked:nightsBooked,
                        noOfRoomsBooked: noOfRoomsBooked,

                        // User details
                        email: user.email,
                        userCountry: user.country,
                        userCity: user.city,

                        // Hotel details
                        hotelId : hotelId,
                        hotelName: hotelDetails.name,
                        hotelCity: hotelDetails.city,
                        hotelAddress: hotelDetails.address,
                        hotelRating: hotelDetails.rating,
                    }
            });
        res.json({id:session.id});
    }
    catch(err){
        next(err);
    };
};