import transporter from "../config/nodeMailer.js";
import Booking from "../models/booking.js";
import Hotel from "../models/hotel.js";
import Room from "../models/room.js";
import stripe from "stripe";

// Function check availability of rooms
const checkAvailability = async ({ checkInDate, checkOutDate, room }) => {
  try {
    const booking = await Booking.find({
      room,
      checkInDate: { $lte: checkInDate },
      checkOutDate: { $gte: checkOutDate },
    });
    const isAvailable = booking.length === 0;
    return isAvailable;
  } catch (error) {
    console.error(error.message);
  }
};

// check availability of room
export const checkRoom = async (req, res) => {
  try {
    const { checkInDate, checkOutDate, room } = req.body;
    const isAvailable = await checkAvailability({
      checkInDate,
      checkOutDate,
      room,
    });
    res.json({ success: true, isAvailable });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// create new room
export const createBooking = async (req, res) => {
  try {
    const { checkInDate, checkOutDate, room, guests } = req.body;
    const user = req.user._id;

    // before booking check availability
    const isAvailable = await checkAvailability({
      checkInDate,
      checkOutDate,
      room,
    });

    if (!isAvailable) {
      return res.json({ success: false, message: "Room is not available" });
    }

    // get total price from room
    const roomData = await Room.findById(room).populate("hotel");
    let totalPrice = roomData.pricePerNight;

    // calculate total price based on nights
    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);
    const timeDiff = checkOut.getTime() - checkIn.getTime();
    const nights = Math.ceil(timeDiff / (1000 * 3600 * 24));

    totalPrice *= nights;
    const booking = await Booking.create({
      user,
      room,
      hotel: roomData.hotel._id,
      guests: +guests,
      checkInDate,
      checkOutDate,
      totalPrice,
    });

    // use nodemailer to send email
    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: req.user.email,
      subject: "Hotel Booking Details",
      html: `
           <h2>Your Booking Details</h2>
           <p>Dear ${req.user.userName},</p>
           <p>Thank you for your booking! Here are your details:</p>
           <ul>
              <li><strong>Booking ID:</strong> ${booking._id}</li>
              <li><strong>Hotel Name:</strong> ${roomData.hotel.name}</li>
              <li><strong>Location:</strong> ${roomData.hotel.address}</li>
              <li><strong>Date:</strong> ${booking.checkInDate.toDateString()}</li>
              <li><strong>Booking Amount:</strong>$ ${booking.totalPrice} /per night</li>
           </ul>
           <p>We look forward to welcoming you!</p>
           <p>If you need to make any changes, fell free to contact us.</p>
      `
    }

    await transporter.sendMail(mailOptions);

    res.json({ success: true, message: "Booking created successfully" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Faild to create booking" });
  }
};

// get all booking
export const getUserBookings = async (req, res) => {
  try {
    const user = req.user._id;
    const booking = await Booking.find({ user })
      .populate("room hotel")
      .sort({ createdAt: -1 });
      res.json({success: true, booking})
  } catch (error) {
    res.json({ success: false, message: "Faild to fetch booking" });

  }
};

// get hotel bookings
export const getHotelBookings = async (req, res) => {
  try{
const hotel = await Hotel.findOne({owner: req.auth.userId});
  if(!hotel){    
    return res.json({ success: false, message: "No hotel found" });
  }
  const bookings = await Booking.find({hotel: hotel._id})
  .populate("room hotel user").sort({ createdAt: -1 })
//   total bookings
const totalBookings = bookings.length;
// total revenue 
const totalRevenue = bookings.reduce((acc, booking) => acc + booking.totalPrice, 0)
res.json({success: true, dashboardData: {totalBookings, totalRevenue, bookings}})
  }catch(error){
res.json({success: false, message: error.message})

  }
};


// stripe payment
export const stripePayment = async (req, res) => {
  try{
     const { bookingId } = req.body;
    //  console.log("Booking ID:", bookingId);

     const booking = await Booking.findById(bookingId);
    //  console.log(booking);
     const roomData = await Room.findById(booking.room).populate('hotel');
     const totalPrice = booking.totalPrice;
     const {origin} = req.headers;
    // const origin = process.env.FRONTEND_URL;
        // console.log("Origin header:", origin);

     const stripeInstance = new stripe(process.env.STRIPE_SECRET_KEY);

     const line_items = [
      {
        price_data: {
          currency: "usd",
          product_data:{
            name: roomData.hotel.name,
          },
          unit_amount: totalPrice * 100
        },
        quantity: 1,
      }
     ]
    //  create checkout session
    const session = await stripeInstance.checkout.sessions.create({
      line_items,
      mode: "payment",
      success_url: `${origin}/loader/my-bookings`,
      cancel_url: `${origin}/my-bookings`,
      metadata:{
        bookingId: bookingId.toString(),
      }
    });

    res.json({ success: true, url: session.url });

  } catch(error) {
    res.json({ success: false, message: error.message||"Payment Failed"});

  }
}


