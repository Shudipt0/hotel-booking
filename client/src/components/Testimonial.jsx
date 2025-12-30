import TestimonialCard from "./TestimonialCard";
import Title from "./Title";

const Testimonial = () => {
  return (
    <div className="flex flex-col items-center px-6 md:px-16 lg:px-24 bg-slate-50 pt-20 pb-30 ">
      <Title
        title="What Our Guests Say"
        subTitle="Discover why discerning travelers choose QuickStay for their luxury accommodations around the world."
      />
      <TestimonialCard />
    </div>
  );
};

export default Testimonial;
