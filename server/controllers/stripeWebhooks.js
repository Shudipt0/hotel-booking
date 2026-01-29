import stripe from "stripe";
import Booking from "../models/booking.js";
import connectDB from "../config/db.js";

// api to handle stripe web hooks

// export const stripeWebhooks = async (req, res) => {
//   // stripe gateway initialize
//   const stripeInstance = new stripe(process.env.STRIPE_SECRET_KEY);
//   const sig = req.headers["stripe-signature"];
//   let event;

//   try {
//     event = stripeInstance.webhooks.constructEvent(
//       req.body,
//       sig,
//       process.env.STRIPE_WEBHOOK_SECRET,
//     );
//   } catch (error) {
//     return res.status(400).send(`Webhook Error: ${error.message}`);
//   }

//   // handle the event
//   if (event.type === "checkout.session.completed") {
//     // const paymentIntent = event.data.object;
//     // const paymentIntentId = paymentIntent.id;

//     // // getting session metadata
//     // const session = await stripeInstance.checkout.sessions.list({
//     //     payment_intent: paymentIntentId,
//     // });

//     // const {bookingId} = session.data[0].metadata;
//     // mark payment as paid
//     // await Booking.findByIdAndUpdate(bookingId, { isPaid: true, paymentMethod: "Stripe" });
//     const session = event.data.object;
//     const bookingId = session.metadata?.bookingId;

//   //    console.log("Stripe session metadata:", session.metadata);
//   // console.log("Booking ID:", session.metadata?.bookingId);

//    if (!bookingId) {
//       console.error("No bookingId in metadata");
//       return res.status(400).json({ error: "Missing bookingId" });
//     }

//     await Booking.findByIdAndUpdate(bookingId, {
//       isPaid: true,
//       paymentMethod: "Stripe",
//       status: "confirm",
//     });
//      console.log("✅ Booking updated:", bookingId);
//   } else {
//     console.log("Unhandled event type:", event.type);
//   }

//   res.json({ received: true });
// };

let cachedDB = null;

const connectDBOnce = async () => {
  if (cachedDB) return cachedDB;
  cachedDB = await connectDB();
  return cachedDB;
};

export const stripeWebhooks = async (req, res) => {
  await connectDBOnce(); // ensure DB is connected for this request

  const stripeInstance = new stripe(process.env.STRIPE_SECRET_KEY);
  const sig = req.headers["stripe-signature"];
  let event;

  try {
    event = stripeInstance.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
    console.log("✅ Stripe webhook verified");
  } catch (err) {
    console.error("❌ Stripe webhook signature failed:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  try {
    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      const bookingId = session.metadata?.bookingId;
      console.log("Session metadata:", session.metadata);

      if (!bookingId) {
        console.error("Missing bookingId in metadata");
        return res.status(400).json({ error: "Missing bookingId" });
      }

      const booking = await Booking.findById(bookingId);
      if (!booking) {
        console.error("Booking not found for ID:", bookingId);
        return res.status(404).json({ error: "Booking not found" });
      }

      const updated = await Booking.findByIdAndUpdate(
        bookingId,
        { isPaid: true, paymentMethod: "Stripe", status: "confirm" },
        { new: true }
      );

      console.log("✅ Booking updated:", updated);
      return res.json({ received: true });
    }

    console.log("⚠️ Unhandled event type:", event.type);
    return res.json({ received: true });
  } catch (err) {
    console.error("❌ Webhook DB error:", err);
    return res.status(500).json({ error: "Database update failed" });
  }
};

