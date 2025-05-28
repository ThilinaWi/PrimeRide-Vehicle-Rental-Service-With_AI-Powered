import React from "react";
import { Car, ShieldCheck, MapPin, Clock, Star, Users } from "lucide-react";

const About = () => {
  return (
    <>
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="max-w-7xl mx-auto text-center mb-16">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-center text-gray-900 mb-6">
            About <span className="text-blue-600">PrimeRide</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Your trusted partner for premium vehicle rentals and exceptional
            travel experiences
          </p>
        </div>

        {/* About Content */}
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Story</h2>
            <p className="text-gray-600 mb-4">
              Founded in 2015, PrimeRide began with a simple mission: to
              revolutionize vehicle rentals by combining cutting-edge technology
              with personalized service. What started as a small fleet of
              premium cars has grown into one of the most trusted names in the
              mobility industry.
            </p>
            <p className="text-gray-600 mb-4">
              Today, we operate in over 50 cities worldwide, offering an
              extensive selection of vehicles to suit every need and budget. Our
              commitment to quality, safety, and customer satisfaction remains
              at the heart of everything we do.
            </p>
            <p className="text-gray-600">
              Whether you need a compact car for city driving, an SUV for family
              adventures, or a luxury vehicle for special occasions, PrimeRide
              delivers exceptional service at every turn.
            </p>
          </div>
          <div className="bg-gray-100 rounded-xl overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1489824904134-891ab64532f1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
              alt="PrimeRide Fleet"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Value Propositions */}
        <div className="max-w-7xl mx-auto mb-20">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Why Choose PrimeRide
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300">
              <div className="flex items-center mb-4">
                <div className="bg-blue-100 p-3 rounded-full mr-4">
                  <Car className="text-blue-600 w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">
                  Diverse Fleet
                </h3>
              </div>
              <p className="text-gray-600">
                Choose from our wide selection of well-maintained vehicles, from
                economy cars to premium luxury models.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300">
              <div className="flex items-center mb-4">
                <div className="bg-green-100 p-3 rounded-full mr-4">
                  <ShieldCheck className="text-green-600 w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">
                  Premium Insurance
                </h3>
              </div>
              <p className="text-gray-600">
                Comprehensive coverage options for complete peace of mind during
                your rental period.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300">
              <div className="flex items-center mb-4">
                <div className="bg-purple-100 p-3 rounded-full mr-4">
                  <MapPin className="text-purple-600 w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">
                  Flexible Locations
                </h3>
              </div>
              <p className="text-gray-600">
                Pick up and drop off at multiple convenient locations or opt for
                our delivery service.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300">
              <div className="flex items-center mb-4">
                <div className="bg-orange-100 p-3 rounded-full mr-4">
                  <Clock className="text-orange-600 w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">
                  24/7 Support
                </h3>
              </div>
              <p className="text-gray-600">
                Our customer service team is available round the clock to assist
                you.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300">
              <div className="flex items-center mb-4">
                <div className="bg-red-100 p-3 rounded-full mr-4">
                  <Star className="text-red-600 w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">
                  Premium Quality
                </h3>
              </div>
              <p className="text-gray-600">
                All vehicles undergo rigorous 150-point inspections before each
                rental.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300">
              <div className="flex items-center mb-4">
                <div className="bg-yellow-100 p-3 rounded-full mr-4">
                  <Users className="text-yellow-600 w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">
                  Corporate Solutions
                </h3>
              </div>
              <p className="text-gray-600">
                Special programs and discounts for business clients and
                long-term rentals.
              </p>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="max-w-7xl mx-auto bg-gradient-to-r from-blue-600 to-blue-800 rounded-xl p-12 text-white mb-20">
          <h2 className="text-3xl font-bold text-center mb-12">
            PrimeRide By The Numbers
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <p className="text-4xl font-bold mb-2">50+</p>
              <p className="text-gray-200">Cities Worldwide</p>
            </div>
            <div>
              <p className="text-4xl font-bold mb-2">10K+</p>
              <p className="text-gray-200">Happy Customers</p>
            </div>
            <div>
              <p className="text-4xl font-bold mb-2">500+</p>
              <p className="text-gray-200">Vehicles in Fleet</p>
            </div>
            <div>
              <p className="text-4xl font-bold mb-2">24/7</p>
              <p className="text-gray-200">Customer Support</p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            Ready to Hit the Road?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Experience the PrimeRide difference for yourself. Book your perfect
            vehicle today.
          </p>
          <a
            href="/vehicles"
            className="inline-block px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-800 text-white font-bold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
          >
            Browse Our Fleet
          </a>
        </div>
      </div>
    </>
  );
};

export default About;
