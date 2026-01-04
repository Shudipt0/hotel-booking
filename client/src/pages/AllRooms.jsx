import { useSearchParams } from "react-router-dom";
import { assets, facilityIcons } from "../assets/assets";
import RoomFilter from "../components/RoomFilter";
import StarRating from "../components/StarRating";
import { useAppContext } from "../context/useAppContext";
import { useMemo, useState } from "react";

const AllRooms = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const {rooms, navigate, currency} = useAppContext();

    const [selectedFilters, setSelectedFilters] = useState({
    roomTypes: [],
    priceRange: [],
  });

  const [selectedSort, setSelectedSort] = useState('');

  // Function to check if a room matches the selected room types
  const matchesRoomType = (room) => {
    return selectedFilters.roomTypes.length === 0 || selectedFilters.roomTypes.includes(room.roomType)
  }

  // Function to check if a room matches the selected price ranges
  const matchesPriceRange = (room) => {
    return selectedFilters.priceRange.length === 0 || selectedFilters.priceRange.some(range => {
      const [min, max] = range.split(' to ').map(Number);
      return room.pricePerNight >= min && room.pricePerNight <= max;
    })
  }

  // Function to sort rooms based on the selected sort option
  const sortRooms = (a, b) => {
    if(selectedSort === 'Price Low to High'){
      return a.pricePerNight - b.pricePerNight;
    }
    if(selectedSort === 'Price High to Low'){
      return b.pricePerNight - a.pricePerNight;
    }
    if(selectedSort === 'Newest First'){
      return new Date(b.createdAt) - new Date(a.createdAt);
    }
    return 0;
  }

  // Filter Destination
  const filterDestination = (room) => {
    const destination = searchParams.get('destination');
    if(!destination) return true;
    return room.hotel.city.toLowerCase().includes(destination.toLowerCase())
  }

    // Filter and sort rooms based on the selected filters and sort option
  const filteredRooms = useMemo(()=> {
    return rooms.filter(room => matchesRoomType(room) && matchesPriceRange(room) && 
  filterDestination(room)).sort(sortRooms);
  },[rooms, selectedFilters, selectedSort, searchParams]);
  
  return (
    <div className="flex flex-col-reverse lg:flex-row items-start justify-between pt-28 md:pt-35 px-4 md:px-16 lg:px-24 xl:px-32 ">
      <div>
        <div className="flex flex-col items-start text-left">
          <h1 className="font-playfair text-4xl md:text-[40px] ">
            Hotel Rooms
          </h1>
          <p className="text-sm md:text-base text-gray-500/90 mt-2 max-w-174">
            Take advantage of our limited-time offers and special packages to
            enhance your stay and create unforgettable memories.
          </p>
        </div>

        {filteredRooms.map((room) => (
          <div
            key={room._id}
            className="flex flex-col md:flex-row items-start py-10 gap-6 border-b border-gray-300 last:pb-30 last:border-0 "
          >
            <img
              onClick={() => {
                navigate(`/rooms/${room._id}`);
                scrollTo(0, 0);
              }}
              src={room.images[0]}
              alt="hotel-image"
              title="View Room Details"
              className="max-h-65 md:w-1/2 rounded-xl shadow-lg object-cover cursor-pointer "
            />
            <div className="md:w-1/2 flex flex-col gap-2 ">
              <p className="text-gray-500  ">{room.hotel.city}</p>
              <p
                onClick={() => {
                  navigate(`/rooms/${room._id}`);
                  scrollTo(0, 0);
                }}
                className="text-gray-800 text-3xl font-playfair cursor-pointer"
              >
                {room.hotel.name}
              </p>
              <div className="flex items-center">
                <StarRating />
                <p className="ml-2">200+ reviews</p>
              </div>
              <div className="flex items-center gap-1 text-gray-500 mt-2 text-sm ">
                <img src={assets.locationIcon} alt="location-Icon" />
                <span>{room.hotel.address}</span>
              </div>
              {/* room amenities */}
              <div className="flex flex-wrap items-center mt-3 mb-6 gap-4">
                {room.amenities.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[#f5f5ff]/70"
                  >
                    <img
                      src={facilityIcons[item]}
                      alt={item}
                      className="w-5 h-5"
                    />
                    <p className="text-xs">{item}</p>
                  </div>
                ))}
              </div>
              {/* room price per night */}
              <p className="text-xl font-medium text-gray-700 ">
                ${room.pricePerNight} /night
              </p>
            </div>
          </div>
        ))}
      </div>
      {/* filters */}
      <RoomFilter searchParams={searchParams} setSearchParams={setSearchParams} rooms={rooms}
    setSelectedFilters={setSelectedFilters} setSelectedSort={setSelectedSort} selectedFilters={selectedFilters}
    selectedSort={selectedSort} />
    </div>
  );
};

export default AllRooms;
