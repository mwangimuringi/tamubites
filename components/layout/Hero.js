import Right from "@/components/icons/Right";
import Image from "next/image";

// Reusable Button Component
const Button = ({ children, className, ...props }) => (
  <button
    className={`flex items-center gap-2 px-4 py-2 rounded-full ${className}`}
    {...props}
  >
    {children}
  </button>
);

export default function Hero() {
  return (
    <section className="hero md:mt-4">
      <div className="py-8 md:py-12">
        <h1 className="text-4xl font-semibold">
          Everything
          <br />
          is better
          <br />
          with a&nbsp;
          <span className="text-primary">Pizza</span>
        </h1>
        <p className="my-6 text-gray-500 text-sm">
          Pizza is the missing piece that makes every day complete, a simple yet
          delicious joy in life
        </p>
        <div className="flex gap-4 text-sm">
          <Button
            className="bg-primary text-white uppercase"
            aria-label="Order pizza now"
          >
            Order now
            <Right />
          </Button>
          <Button
            className="text-gray-600 font-semibold"
            aria-label="Learn more about our pizzas"
          >
            Learn more
            <Right />
          </Button>
        </div>
      </div>
      <div className="relative hidden md:block">
        <Image
          src="/pizza.png"
          fill
          className="object-contain"
          alt="pizza"
          priority
        />
      </div>
    </section>
  );
}
