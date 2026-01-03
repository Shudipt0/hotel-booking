import Booking from "../models/booking.js";
import Hotel from "../models/hotel.js";
import Room from "../models/room.js";

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
  const bookings = (await Booking.find({hotel: hotel._id}).populate("room hotel user")).sort({ createdAt: -1 })
//   total bookings
const totalBookings = bookings.length;
// total revenue 
const totalRevenue = bookings.reduce((acc, booking) => acc + booking.totalPrice, 0)
res.json({success: true, dashboardData: {totalBookings, totalRevenue, bookings}})
  }catch(error){
res.json({success: false, message: error.message})

  }
};


