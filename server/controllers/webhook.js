import mongoose from "mongoose";
import Room from "../models/room.js";
import Booking from "../models/booking.js";
import Stripe from "stripe";

export const webhookManage = async (req,res,next) => {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  const sig = req.headers["stripe-signature"];
  let event;
console.log("Webhook start");
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET_KEY);
  }catch (err){
    console.error("Webhook signature verification failed:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;

    const roomIds = session.metadata.roomIds.split(",");
    const dates = JSON.parse(session.metadata.dates);
    const amountPaid = session.amount_total / 100; // convert cents to dollars
    const paymentIntent = session.payment_intent;

    const sessionDb = await mongoose.startSession();
    sessionDb.startTransaction();

    try {
      // 1. Idempotency check
      const existingBooking = await Booking.findOne({ paymentIntent }).session(sessionDb);
      if (existingBooking) {
        await sessionDb.endSession();
        return res.status(200).send("Already processed");
      }

      // 2. Fetch rooms and check for conflict
      const rooms = await Room.find({ "roomNumbers._id": { $in: roomIds } }).session(sessionDb);
      const conflict = rooms.some(room =>
        room.roomNumbers.some(rn =>
          roomIds.includes(String(rn._id)) &&
          rn.unavailableDates.some(d => dates.includes(new Date(d).getTime()))
        )
      );

      if (conflict) {
        await stripe.refunds.create({ payment_intent: paymentIntent });
        await sessionDb.abortTransaction();
        await sessionDb.endSession();
        console.log("Conflict detected. Refunded.");
        return res.status(200).send("Conflict detected. Refunded.");
      }

      // 3. Update availability and save booking
      for (let room of rooms) {
        for (let rn of room.roomNumbers) {
          if (roomIds.includes(String(rn._id))) {
            rn.unavailableDates.push(...dates);
          }
        }
        await room.save({ session: sessionDb });
      }
      console.log("Unavailable dates updated");

      // await Booking.create([{
      //   roomId: roomIds[0],
      //   userEmail: email,
      //   dates,
      //   status: "confirmed",
      //   paymentIntent,
      // }], { session: sessionDb });
      await Booking.create([{
                userEmail: session.metadata.email,
                hotelName: session.metadata.hotelName,
                noOfRoomsBooked: parseInt(session.metadata.noOfRoomsBooked, 10),
                totalPricePaid: amountPaid,
                userCountry: session.metadata.userCountry,
                userCity: session.metadata.userCity,
                hotelId: session.metadata.hotelId,
                hotelCity: session.metadata.hotelCity,
                hotelAddress: session.metadata.hotelAddress,
                hotelRating: parseFloat(session.metadata.hotelRating),
                bookingDate: new Date(), // Set the booking date to now
                nightsBooked: parseInt(session.metadata.nightsBooked, 10),
                status: "confirmed",
                paymentIntent: paymentIntent,
      }], { session: sessionDb });
console.log("Bookings collection created");
      await sessionDb.commitTransaction();
      await sessionDb.endSession();

      console.log("Booking confirmed.");
      return res.status(200).send("Booking successful");
    } catch (err) {
      await sessionDb.abortTransaction();
      await sessionDb.endSession();
      console.error("Error in transaction:", err);
      return res.status(500).send("Internal Server Error");
    }
  }

  res.status(200).send("Received");
};