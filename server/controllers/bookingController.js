import Booking from "../models/booking.js"


// Function check availability of rooms
const checkAvailability = async ({checkInDate, checkOutDate, room}) => {
     try{
        const booking = await Booking.find({
            room,
            checkInDate: {$lte: checkInDate},
            checkOutDate: {$gte: checkOutDate},
        });
       const isAvailable = booking.length === 0;
       return isAvailable;

     }catch(error){
         console.error(error.message);
     }
}

// check availability of room
export const checkRoom = async (req, res ) => {
    try{
        const {checkInDate, checkOutDate, room} = req.body;
        const isAvailable = await checkAvailability({checkInDate, checkOutDate, room});
        res.json({success: true, isAvailable})
    }catch(error){
        res.json({success: false, message: error.message})
      
    }
}

// create new room
export const createBooking = async (req, res) => {
    try{
        const {checkInDate, checkOutDate, room, guests} = req.body;
        const user = req.user._id;

        // before booking check availability
        const isAvailable = await checkAvailability({checkInDate, checkOutDate, room})

    } catch(error) {

    }
}