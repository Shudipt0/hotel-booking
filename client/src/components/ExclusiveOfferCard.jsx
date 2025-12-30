import { assets, exclusiveOffers } from "../assets/assets";

const ExclusiveOfferCard = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
      {exclusiveOffers.map((item) => (
        <div
          key={item._id}
          className="group relative flex flex-col items-start justify-between gap-1 pt-12 md:pt-18 px-4 rounded-xl text-white bg-no-repeat bg-cover bg-center "
          style={{ backgroundImage: `url(${item.image})` }}
        >
          <p className="px-3 py-1 absolute top-4 left-4 text-xs bg-white text-gray-800 font-medium rounded-full ">
            {item.priceOff}% OFF
          </p>
          <div>
            <p className="text-2xl font-medium font-playfair ">{item.title}</p>
            <p>{item.description}</p>
            <p className="text-xs text-white/70 mt-3 ">{item.expiryDate}</p>
          </div>
          <button className="flex items-center gap-2 font-medium cursor-pointer mt-4 mb-5 ">
            View Offers
            <img
              src={assets.arrowIcon}
              alt="arrow-Icon"
              className="invert group-hover:translate-x-1 transition-all "
            />
          </button>
        </div>
      ))}
    </div>
  );
};

export default ExclusiveOfferCard;
