import { useEffect, useState } from "react";
import { useAppContext } from "../context/useAppContext";
import HotelCard from "./HotelCard";
import Title from "./Title";

const RecomenedHotels = () => {
  const { rooms, searchCities } = useAppContext();
  const [recommended, setRecomended] = useState([]);

  const filterHotels = () => {
    const filteredhotels = rooms
      .slice()
      .filter((room) => searchCities.includes(room.hotel.city));
    setRecomended(filteredhotels);
  };

  useEffect(() => {
    filterHotels();
  }, [rooms, searchCities]);

  return (
    recommended.length > 0 && (
      <div className="flex flex-col items-center px-6 md:px-16 lg:px-24 bg-slate-50 py-20">
        <Title
          title="Recommended Hotels"
          subTitle="Discover our handpicked selection of exceptional properties around the world, offering unparalleled luxury and unforgettable experiences"
        />
        <div className="flex flex-wrap items-center justify-center gap-6 mt-20">
          {recommended.slice(0, 4).map((room, index) => (
            <HotelCard key={room._id} room={room} index={index} />
          ))}
        </div>
      </div>
    )
  );
};

export default RecomenedHotels;
