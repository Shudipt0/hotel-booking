import ExclusiveOffers from "../components/ExclusiveOffers";
import FeaturedHotel from "../components/FeaturedHotel";
import Hero from "../components/Hero";
import NewsLetter from "../components/NewsLetter";
import RecomenedHotels from "../components/RecomendedHotel";
import Testimonial from "../components/Testimonial";

const Home = () => {
  return (
    <>
      <Hero />
      <RecomenedHotels />
      <FeaturedHotel />
      <ExclusiveOffers />
      <Testimonial />
      <NewsLetter />
    </>
  );
};

export default Home;
