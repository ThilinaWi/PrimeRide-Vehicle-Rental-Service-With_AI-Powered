import { useState, useEffect } from "react";
import {
  FaCar,
  FaStar,
  FaPhoneAlt,
  FaCheckCircle,
  FaArrowLeft,
  FaArrowRight,
  FaArrowDown,
  FaPlane,
  FaBusinessTime,
  FaRoute,
  FaShuttleVan,
  FaTaxi,
  FaCarAlt,
} from "react-icons/fa";
import {
  MdSupportAgent,
  MdFamilyRestroom,
  MdElectricCar,
} from "react-icons/md";
import { BsFillPeopleFill, BsSnow2 } from "react-icons/bs";
import { AiOutlineCheckCircle } from "react-icons/ai";
import { FaShieldAlt } from "react-icons/fa";

const Home = () => {
  // Carousel state
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showMoreServices, setShowMoreServices] = useState(false);

  // Image paths
  const carouselImages = [
    "src/assets/images/car5.jpg",
    "src/assets/images/car2.jpg",
    "src/assets/images/car3.jpeg",
  ];

  // All vehicle categories
  const categories = [
    { name: "Scooty", image: "src/assets/images/scooty.png" },
    { name: "CT 100", image: "src/assets/images/ct100.png" },
    { name: "Suzuki Maruti", image: "src/assets/images/maruti.png" },
    { name: "Vagon R", image: "src/assets/images/vagonr.png" },
    { name: "Toyota Prius", image: "src/assets/images/toyota prius.png" },
    { name: "Mercedes", image: "src/assets/images/mercedes.png" },
    { name: "BMW 520d", image: "src/assets/images/bmw 520d.png" },
    { name: "Hiace", image: "src/assets/images/hiace.png" },
    { name: "Range Rover", image: "src/assets/images/range rover.png" },
    { name: "HILUX", image: "src/assets/images/hilux.png" },
  ];

  // All services data (9 total)
  const allServices = [
    // First 3 (always visible)
    {
      id: 1,
      title: "Enchanted Wedding Rides",
      icon: <BsFillPeopleFill className="text-purple-600 text-2xl" />,
      description:
        "Luxurious, chauffeur-driven vehicles designed for your perfect wedding day. Enjoy elegant decorations, premium champagne, and a red-carpet experience. Custom themes and floral arrangements available to match your special occasion. Relax in style and comfort as we ensure a seamless, picture-perfect arrival for your unforgettable celebration.",
      bgColor: "bg-purple-100",
    },
    {
      id: 2,
      title: "Luxury & Premium",
      icon: <FaStar className="text-blue-600 text-2xl" />,
      description:
        "Experience the epitome of comfort and class with high-end vehicles featuring plush interiors, advanced entertainment systems, and personalized chauffeur services. Ideal for business executives, VIPs, or anyone looking for an elite travel experience. Enjoy smooth rides, privacy, and top-tier amenities tailored to meet your sophisticated travel needs.",
      bgColor: "bg-blue-100",
    },
    {
      id: 3,
      title: "Budget-Friendly Rides",
      icon: <FaCheckCircle className="text-green-600 text-2xl" />,
      description:
        "Reliable and affordable transportation for everyday travel. Choose from fuel-efficient cars, compact models, or shared rides to save costs while ensuring comfort. Ideal for students, daily commuters, or budget-conscious travelers. Enjoy safe, clean, and convenient rides without compromising on quality or reliability at competitive prices.",
      bgColor: "bg-green-100",
    },
    // Additional 6 (shown when expanded)
    {
      id: 4,
      title: "Airport Transfers",
      icon: <FaPlane className="text-red-600 text-2xl" />,
      description:
        "Timely and hassle-free airport pickups and drop-offs with real-time flight tracking to accommodate delays or early arrivals. Professional drivers ensure smooth, stress-free rides, helping with luggage and providing a comfortable start or end to your journey. Available 24/7 for domestic and international travel needs.",
      bgColor: "bg-red-100",
    },
    {
      id: 5,
      title: "Corporate Fleet",
      icon: <FaBusinessTime className="text-indigo-600 text-2xl" />,
      description:
        "Business-class vehicles tailored for professionals attending meetings, conferences, and corporate events. Equipped with WiFi, charging ports, and quiet interiors to enhance productivity on the go. Ensure a polished, executive appearance with reliable, on-time service and top-tier comfort, perfect for making lasting professional impressions.",
      bgColor: "bg-indigo-100",
    },
    {
      id: 6,
      title: "Family Travel",
      icon: <MdFamilyRestroom className="text-yellow-600 text-2xl" />,
      description:
        "Spacious SUVs and vans designed for comfortable family vacations, road trips, or group travel. Child seats, entertainment options, and extra luggage space ensure a stress-free journey for all ages. Travel together with safety and convenience, making every ride enjoyable for both kids and adults.",
      bgColor: "bg-yellow-100",
    },
    {
      id: 7,
      title: "Electric Vehicles",
      icon: <MdElectricCar className="text-teal-600 text-2xl" />,
      description:
        "Eco-conscious travelers can choose from a fleet of modern electric cars offering zero emissions, silent operation, and top-tier features. Enjoy smooth acceleration, intelligent navigation, and long-range battery performance while reducing your carbon footprint. Perfect for environmentally responsible travel without compromising on comfort or luxury.",
      bgColor: "bg-teal-100",
    },
    {
      id: 8,
      title: "Winter Ready",
      icon: <BsSnow2 className="text-cyan-600 text-2xl" />,
      description:
        "Navigate icy roads safely with our snow-equipped, 4WD vehicles designed for winter conditions. Heated seats, all-terrain tires, and advanced stability controls provide a secure and comfortable ride in harsh weather. Whether it's mountain trips or snowy commutes, stay warm and confident on the road.",
      bgColor: "bg-cyan-100",
    },
    {
      id: 9,
      title: "VIP Concierge",
      icon: <FaCarAlt className="text-pink-600 text-2xl" />,
      description:
        "Exclusive, white-glove service with high-end vehicles, dedicated chauffeurs, and personalized itineraries. Enjoy privacy, convenience, and seamless luxury transportation with exclusive perks such as airport fast-tracking, luxury hotel transfers, and tailored city tours. Perfect for celebrities, executives, and elite travelers seeking discretion and first-class treatment.",
      bgColor: "bg-pink-100",
    },
  ];

  // Auto-rotate carousel
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex === carouselImages.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Scroll functions
  const scrollLeft = () => {
    const container = document.getElementById("categories-scroll");
    container.scrollBy({ left: -400, behavior: "smooth" });
  };

  const scrollRight = () => {
    const container = document.getElementById("categories-scroll");
    container.scrollBy({ left: 400, behavior: "smooth" });
  };

  // Service card component
  const ServiceCard = ({ service }) => (
    <div className="relative bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 h-full flex flex-col">
      <div className="p-8 flex-grow">
        <div
          className={`w-16 h-16 mb-6 rounded-full ${service.bgColor} flex items-center justify-center`}
        >
          {service.icon}
        </div>
        <h3 className="text-2xl font-bold text-gray-800 mb-4">
          {service.title}
        </h3>
        <p className="text-gray-600 mb-6 leading-relaxed">
          {service.description}
        </p>
      </div>
    </div>
  );

  return (
    <div className="font-sans">
      {/* Hero Carousel Section */}
      <div className="relative w-full h-screen overflow-hidden">
        {/* Carousel Images */}
        {carouselImages.map((image, index) => (
          <img
            key={index}
            src={image}
            alt={`PrimeRide vehicle ${index + 1}`}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
              index === currentIndex ? "opacity-100" : "opacity-0"
            }`}
          />
        ))}

        {/* Carousel Indicators */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
          {carouselImages.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-3 h-3 rounded-full transition-colors ${
                index === currentIndex ? "bg-white" : "bg-gray-400"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
      {/* About PrimeRide Section */}
      <div className="max-w-screen-xl mx-auto px-4 py-12 flex flex-col md:flex-row items-center justify-between space-x-0 md:space-x-8 space-y-8 md:space-y-0">
        {/* Left Text Content */}
        <div className="flex-1">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Welcome To PrimeRide
          </h2>
          <p className="text-lg text-gray-700 mb-6">
            With over 10 years of experience, PrimeRide has established itself
            as a trusted and leading vehicle rental service. We take pride in
            offering a diverse fleet, including economy cars, luxury vehicles,
            SUVs, and electric cars, catering to both local and international
            customers.
          </p>
          <p className="text-lg text-gray-700 mb-6">
            We are a certified and licensed company, recognized by Department of
            Motor Traffic (DMT), and hold ISO 9001:2015 certification, ensuring
            top-quality service and customer satisfaction.
          </p>
          <a
            href="/view/about"
            className="text-blue-500 font-semibold hover:underline"
          >
            Read More
          </a>
        </div>

        {/* Right Car Image */}
        <div className="flex-1 w-full">
          <img
            src="src/assets/images/car4.jpg"
            alt="Car"
            className="w-full h-auto max-h-96 object-cover rounded-lg shadow-lg"
          />
        </div>
      </div>
      {/* Categories Section */}
      <div className="max-w-screen-xl mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          Our Vehicle Categories
        </h2>
        <div className="relative">
          {/* Scroll buttons */}
          <button
            onClick={scrollLeft}
            className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-white rounded-full p-3 shadow-md hover:bg-gray-100 transition-colors"
          >
            <FaArrowLeft className="text-gray-700 text-xl" />
          </button>

          <button
            onClick={scrollRight}
            className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-white rounded-full p-3 shadow-md hover:bg-gray-100 transition-colors"
          >
            <FaArrowRight className="text-gray-700 text-xl" />
          </button>

          {/* Single row scrollable container */}
          <div
            id="categories-scroll"
            className="flex overflow-x-auto pb-6 space-x-8 scroll-smooth hide-scrollbar"
          >
            {categories.map((category) => (
              <div
                key={category.name}
                className="flex-shrink-0 w-70 text-center"
              >
                <div className="mb-3 overflow-hidden rounded-lg flex items-center justify-center h-48 p-4">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="max-w-full max-h-full object-contain hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <h3 className="text-lg font-medium text-gray-800">
                  {category.name}
                </h3>
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* Services Section */}
      <div className="max-w-screen-xl mx-auto px-4 py-16 bg-gradient-to-b from-gray-50 to-white">
        <h2 className="text-4xl font-bold text-gray-900 mb-12 text-center">
          Our Premium Services
        </h2>

        {/* First 3 services */}
        <div className="grid md:grid-cols-3 gap-8">
          {allServices.slice(0, 3).map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>

        {/* Read More Button */}
        <div className="text-center mt-12">
          <button
            onClick={() => setShowMoreServices(!showMoreServices)}
            className="border-2 border-[#FF601D] text-[#FF601D] hover:bg-[#FFF5F0] font-semibold py-3 px-8 rounded-full transition-colors inline-flex items-center"
          >
            {showMoreServices ? "Show Less" : "Read More Services"}
            <FaArrowDown
              className={`ml-2 transition-transform ${
                showMoreServices ? "rotate-180" : ""
              }`}
            />
          </button>
        </div>

        {/* Additional Services */}
        {showMoreServices && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
            {allServices.slice(3).map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>
        )}
      </div>
      {/* AI-Powered Repair Prediction Section */}
      <div className="max-w-screen-xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          What stands out among the others is
        </h2>
        <div className="flex flex-col md:flex-row items-center justify-between gap-12">
          {/* Left Text Content - matched to other sections */}
          <div className="flex-1 max-w-2xl">
            <h2
              className="text-3xl font-bold mb-6"
              style={{ color: "#FF601D" }}
            >
              AI-Powered Future Repair Prediction System
            </h2>
            <p className="text-lg text-gray-700 mb-6 leading-relaxed">
              Experience smarter vehicle rentals with our AI-Powered Future
              Repair Prediction System. Our technology analyzes maintenance
              history, driving patterns, and component diagnostics to forecast
              service needs before issues arise. By evaluating hundreds of
              real-time data points, we ensure every rental vehicle receives
              proactive care, reducing breakdowns by 85% while delivering
              unmatched reliability and safety throughout your journey.
            </p>
            <div className="space-y-4 mb-8">
              <div className="flex items-start">
                <FaCheckCircle className="text-green-500 mt-1 mr-3 flex-shrink-0" />
                <p className="text-gray-700">
                  Stay Informed: See predicted repair dates and maintenance
                  alerts for vehicles
                </p>
              </div>
              <div className="flex items-start">
                <FaCheckCircle className="text-green-500 mt-1 mr-3 flex-shrink-0" />
                <p className="text-gray-700">
                  Rent with confidence, knowing your vehicle's health is
                  monitored for your safety
                </p>
              </div>
              <div className="flex items-start">
                <FaCheckCircle className="text-green-500 mt-1 mr-3 flex-shrink-0" />
                <p className="text-gray-700">
                  Proactive maintenance ensures maximum reliability during your
                  rental period
                </p>
              </div>
            </div>
          </div>

          {/* Right Image - 4:3 aspect ratio container */}
          <div className="flex-1 max-w-xl">
            <div className="aspect-w-4 aspect-h-3 w-full">
              <img
                src="src/assets/images/banner-insurance-vehicle-medicine.png"
                alt="AI Repair Prediction System"
                className="w-full h-full"
              />
            </div>
          </div>
        </div>
      </div>
      {/* 3-Step Booking Process Section */}
      <div className="max-w-screen-xl mx-auto px-4 py-16 bg-white">
        <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">
          How It Works
        </h2>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Step 1 - Blue */}
          <div className="bg-white rounded-xl shadow-lg p-8 text-center hover:shadow-xl transition-all duration-300">
            <div className="w-20 h-20 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-white text-2xl font-bold">1</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-4">
              Filter Packages or Vehicles
            </h3>
            <p className="text-gray-600">
              Browse our wide selection and use filters to find your perfect
              vehicle or package
            </p>
          </div>

          {/* Step 2 - Green */}
          <div className="bg-white rounded-xl shadow-lg p-8 text-center hover:shadow-xl transition-all duration-300">
            <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-white text-2xl font-bold">2</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-4">
              Select Your Vehicle
            </h3>
            <p className="text-gray-600">
              Choose your preferred vehicle with all the options and extras you
              need
            </p>
          </div>

          {/* Step 3 - Orange (brand color) */}
          <div className="bg-white rounded-xl shadow-lg p-8 text-center hover:shadow-xl transition-all duration-300">
            <div className="w-20 h-20 bg-[#FF601D] rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-white text-2xl font-bold">3</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-4">
              Conform & Pay
            </h3>
            <p className="text-gray-600">
              Securely complete your booking with our easy payment process
            </p>
          </div>
        </div>

        <div className="text-center mt-12">
          <button className="bg-[#FF601D] hover:bg-[#E5561A] text-white font-semibold py-3 px-8 rounded-full transition-colors">
            Start Your Booking Now
          </button>
        </div>
      </div>
      {/* Blog & Rental Tips Section */}
      <div className="max-w-screen-xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">
          Blog & Rental Tips
        </h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Tip 1 */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col">
            <div className="h-48 w-full">
              <img
                src="/src/assets/images/blog1.jpg"
                alt="First-time renter tips"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-6 flex-grow">
              <h3 className="text-xl font-bold text-gray-800 mb-3">
                5 Essential Tips for First-Time Car Renters
              </h3>
              <p className="text-gray-600 mb-4">
                New to renting a car? Learn how to choose the right vehicle,
                understand rental policies, avoid hidden fees, and ensure a
                stress-free rental experience.
              </p>
              <a
                href="#"
                className="text-[#FF601D] font-semibold hover:underline inline-flex items-center"
              >
                Read More <FaArrowRight className="ml-2" />
              </a>
            </div>
          </div>

          {/* Tip 2 */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col">
            <div className="h-48 w-full">
              <img
                src="/src/assets/images/blog2.jpg"
                alt="Rental do's and don'ts"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-6 flex-grow">
              <h3 className="text-xl font-bold text-gray-800 mb-3">
                The Do's and Don'ts of Vehicle Rentals
              </h3>
              <p className="text-gray-600 mb-4">
                Learn the key things to check before signing a rental agreement,
                including insurance policies, fuel options, and potential extra
                charges.
              </p>
              <a
                href="#"
                className="text-[#FF601D] font-semibold hover:underline inline-flex items-center"
              >
                Read More <FaArrowRight className="ml-2" />
              </a>
            </div>
          </div>

          {/* Tip 3 */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col">
            <div className="h-48 w-full">
              <img
                src="/src/assets/images/blog3.jpg"
                alt="Money saving tips"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-6 flex-grow">
              <h3 className="text-xl font-bold text-gray-800 mb-3">
                How to Save Money on Your Next Car Rental
              </h3>
              <p className="text-gray-600 mb-4">
                Discover smart strategies to get the best rental deals, avoid
                unnecessary add-ons, and make the most of loyalty programs.
              </p>
              <a
                href="#"
                className="text-[#FF601D] font-semibold hover:underline inline-flex items-center"
              >
                Read More <FaArrowRight className="ml-2" />
              </a>
            </div>
          </div>

          {/* Tip 4 */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col">
            <div className="h-48 w-full">
              <img
                src="/src/assets/images/blog4.jpg"
                alt="Safe driving tips"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-6 flex-grow">
              <h3 className="text-xl font-bold text-gray-800 mb-3">
                Safe Driving Tips for Long Journeys
              </h3>
              <p className="text-gray-600 mb-4">
                Essential safety tips to keep you and your passengers safe
                whether driving through cities or highways.
              </p>
              <a
                href="#"
                className="text-[#FF601D] font-semibold hover:underline inline-flex items-center"
              >
                Read More <FaArrowRight className="ml-2" />
              </a>
            </div>
          </div>
        </div>

        <div className="text-center mt-12">
          <button className="border-2 border-[#FF601D] text-[#FF601D] hover:bg-[#FFF5F0] font-semibold py-3 px-8 rounded-full transition-colors inline-flex items-center">
            View All Articles <FaArrowRight className="ml-2" />
          </button>
        </div>
      </div>

      {/* Why Choose Us Section */}
      <div className="max-w-screen-xl mx-auto px-4 py-16 bg-white">
        <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">
          Why Choose Us?
        </h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* 24/7 Customer Support */}
          <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-all duration-300 flex flex-col items-center text-center">
            <div className="w-24 h-24 mb-6">
              <img
                src="/src/assets/images/icon1.jpg"
                alt="24/7 Support"
                className="w-full h-full object-cover"
              />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-3">
              Customer Support
            </h3>
            <p className="text-gray-600">
              Our dedicated team is available anytime to assist with your
              booking, modification, or any travel concerns.
            </p>
          </div>

          {/* Wide Range of Vehicles */}
          <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-all duration-300 flex flex-col items-center text-center">
            <div className="w-24 h-24 mb-6 ">
              <img
                src="/src/assets/images/icon2.jpg"
                alt="Vehicle variety"
                className="w-full h-full object-cover"
              />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-3">
              Wide Range of Vehicles
            </h3>
            <p className="text-gray-600">
              Whether you need a fuel-efficient car, a spacious van, or a luxury
              vehicle, we have the perfect vehicle for your needs.
            </p>
          </div>

          {/* Well-Maintained Vehicles */}
          <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-all duration-300 flex flex-col items-center text-center">
            <div className="w-24 h-24 mb-6 ">
              <img
                src="/src/assets/images/icon3.png"
                alt="Maintained vehicles"
                className="w-full h-full object-cover"
              />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-3">
              Well-Maintained and Clean Vehicles
            </h3>
            <p className="text-gray-600">
              Our fleet is regularly serviced and cleaned for a safe and
              comfortable journey.
            </p>
          </div>

          {/* Roadside Assistance */}
          <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-all duration-300 flex flex-col items-center text-center">
            <div className="w-30 h-24 mb-6 ">
              <img
                src="/src/assets/images/icon4.jpg"
                alt="Roadside assistance"
                className="w-full h-full object-cover"
              />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-3">
              Roadside Assistance
            </h3>
            <p className="text-gray-600">
              Enjoy peace of mind with emergency roadside assistance. Instant
              towing, flat tire changes, battery jumps, and more.
            </p>
          </div>

          {/* Easy Online Booking */}
          <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-all duration-300 flex flex-col items-center text-center">
            <div className="w-35 h-24 mb-6 ">
              <img
                src="/src/assets/images/icon5.jpg"
                alt="Online booking"
                className="w-full h-full object-cover"
              />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-3">
              Easy Online Booking
            </h3>
            <p className="text-gray-600">
              A simple and hassle-free booking process that lets you reserve
              your ride in minutes.
            </p>
          </div>

          {/* Car Insurance */}
          <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-all duration-300 flex flex-col items-center text-center">
            <div className="w-30 h-24 mb-6">
              <img
                src="/src/assets/images/icon6.jpg"
                alt="Car insurance"
                className="w-full h-full object-cover"
              />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-3">
              Car Insurance
            </h3>
            <p className="text-gray-600">
              We offer comprehensive insurance options for extra security and
              peace of mind during your trip.
            </p>
          </div>

          {/* No Hidden Fees - Regular width */}
          <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-all duration-300 flex flex-col items-center text-center">
            <div className="w-24 h-24 mb-6 ">
              <img
                src="/src/assets/images/icon7.jpg"
                alt="No hidden fees"
                className="w-full h-full object-cover"
              />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-3">
              No Hidden Fees
            </h3>
            <p className="text-gray-600">
              We believe in transparent pricing. No surprise charges—just clear
              and honest rates.
            </p>
          </div>

          {/* Flexible Rental Plans */}
          <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-all duration-300 flex flex-col items-center text-center">
            <div className="w-35 h-27 mb-6">
              <img
                src="/src/assets/images/icon8.jpg"
                alt="Flexible rentals"
                className="w-full h-full object-cover"
              />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-3">
              Flexible Rental Plans
            </h3>
            <p className="text-gray-600">
              Choose from daily, weekly, or long-term rentals to fit your
              schedule and budget.
            </p>
          </div>

          {/* Professional Chauffeur Services */}
          <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-all duration-300 flex flex-col items-center text-center">
            <div className="w-40 h-24 mb-6 ">
              <img
                src="/src/assets/images/icon9.jpg"
                alt="Chauffeur service"
                className="w-full h-full object-cover"
              />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-3">
              Professional Chauffeur Services
            </h3>
            <p className="text-gray-600">
              Need a driver? We offer experienced and professional chauffeurs
              for a premium travel experience.
            </p>
          </div>
        </div>
      </div>

      {/* Icon Features Section */}

      {/* Custom CSS */}
      <style jsx>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};

export default Home;
