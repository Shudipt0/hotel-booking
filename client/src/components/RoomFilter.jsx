import { useState } from "react";

const CheckBox = ({ label, selected = false, onChange = () => {} }) => {
  return (
    <label className="flex gap-3 items-center cursor-pointer mt-2 text-sm">
      <input
        type="checkbox"
        checked={selected}
        onChange={(e) => onChange(e.target.checked, label)}
      />
      <span className="font-light select-none">{label}</span>
    </label>
  );
};

const RadioButton = ({ label, selected = false, onChange = () => {} }) => {
  return (
    <label className="flex gap-3 items-center cursor-pointer mt-2 text-sm">
      <input
        type="radio"
        name="sortOption"
        checked={selected}
        onChange={(e) => onChange(label)}
      />
      <span className="font-light select-none">{label}</span>
    </label>
  );
};

const RoomFilter = () => {
  const [openFilters, setOpenFilters] = useState();

  const roomTypes = ["single bed", "double bed", "luxury room", "family suite"];

  const priceRange = [
    "0 to 500",
    "500 to 1000",
    "1000 to 2000",
    "2000 to 3000",
  ];

  const sortOptions = [
    "Price Low to High",
    "Price High to Low",
    "Newest First",
  ];

  return (
    <div className="bg-white w-80 border border-gray-300 text-gray-600 max-lg:mb-8 lg:mt-16 ">
      <div
        className={`flex items-center justify-between px-5 py-2.5 lg:border-b border-gray-300 ${
          openFilters && "border-b"
        } `}
      >
        <p className="text-base font-medium text-gray-800">FILTERS</p>
        <div className="text-xs cursor-pointer">
          <span
            onClick={() => setOpenFilters(!openFilters)}
            className="lg:hidden"
          >
            {openFilters ? "HIDE" : "SHOW"}
          </span>
          <span className="hidden bg:block">CLEAR</span>
        </div>
      </div>

      <div
        className={`${
          openFilters ? "h-auto" : "h-0 lg:h-auto"
        } overflow-hidden transition-all duration-700`}
      >
        <div className="px-5 pt-5">
          <p className="font-medium text-gray-800 pb-2">Popular filter</p>
          {roomTypes.map((room, index) => (
            <CheckBox key={index} label={room} />
          ))}
        </div>
        <div className="px-5 pt-5">
          <p className="font-medium text-gray-800 pb-2">Price Range</p>
          {priceRange.map((range, index) => (
            <CheckBox key={index} label={`$ ${range}`} />
          ))}
        </div>
        <div className="px-5 pt-5 pb-7">
          <p className="font-medium text-gray-800 pb-2">Sort By</p>
          {sortOptions.map((option, index) => (
            <RadioButton key={index} label={option} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default RoomFilter;
