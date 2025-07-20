import React, { useState, useEffect } from "react";
// Font Awesome icons used directly in JSX
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const categories = [
  { name: "Power Tools", icon: "fas fa-wrench", count: "150+ items" },
  { name: "Generators", icon: "fas fa-bolt", count: "80+ items" },
  { name: "Welding Equipment", icon: "fas fa-fire", count: "120+ items" },
  { name: "Electronics", icon: "fas fa-microchip", count: "200+ items" },
  { name: "Home Appliances", icon: "fas fa-home", count: "180+ items" },
  { name: "Workshop Gear", icon: "fas fa-cog", count: "90+ items" }
];

const carouselImages = [
  {
    id: 1,
    title: "Professional Power Tools",
    subtitle: "Up to 40% Off",
    image: "/images/hero-tools.jpg",
    cta: "Shop Now",
    bg: "from-blue-600 to-blue-800"
  },
  {
    id: 2,
    title: "Generators & Power Equipment",
    subtitle: "Reliable Power Solutions",
    image: "/images/hero-generators.jpg",
    cta: "Explore",
    bg: "from-green-600 to-green-800"
  },
  {
    id: 3,
    title: "Welding Machines",
    subtitle: "Professional Grade",
    image: "/images/hero-welding.jpg",
    cta: "View All",
    bg: "from-orange-600 to-orange-800"
  }
];



const Hero = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % carouselImages.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % carouselImages.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + carouselImages.length) % carouselImages.length);

  return (
    <div className="pt-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 py-6">
          {/* Categories Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-4">
              <h3 className="font-semibold text-gray-900 mb-4">Categories</h3>
              <div className="space-y-2">
                {categories.map((category) => (
                  <button
                    key={category.name}
                    onClick={() => navigate(`/products?category=${encodeURIComponent(category.name)}`)}
                    className="w-full flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors text-left"
                  >
                    <div className="flex items-center space-x-3">
                      <i className={`${category.icon} text-primary-500`}></i>
                      <div>
                        <div className="font-medium text-gray-900">{category.name}</div>
                        <div className="text-sm text-gray-500">{category.count}</div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Search Bar */}
            <div className="bg-white rounded-lg shadow-sm p-4">
              <form onSubmit={handleSubmit} className="flex gap-2">
                <div className="flex-1 relative">
                  <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search for products, brands and categories..."
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
                <button
                  type="submit"
                  className="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors font-medium"
                >
                  Search
                </button>
              </form>
            </div>

            {/* Carousel */}
            <div className="relative bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="relative h-80">
                {carouselImages.map((slide, index) => (
                  <div
                    key={slide.id}
                    className={`absolute inset-0 transition-opacity duration-500 ${
                      index === currentSlide ? 'opacity-100' : 'opacity-0'
                    }`}
                  >
                    <div className={`h-full bg-gradient-to-r ${slide.bg} flex items-center justify-between px-8`}>
                      <div className="text-white">
                        <h2 className="text-3xl font-bold mb-2">{slide.title}</h2>
                        <p className="text-xl mb-4">{slide.subtitle}</p>
                        <button className="bg-white text-gray-900 px-6 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors">
                          {slide.cta}
                        </button>
                      </div>
                      <div className="w-64 h-64 bg-white/20 rounded-lg flex items-center justify-center">
                        <span className="text-6xl">📦</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Carousel Controls */}
              <button
                onClick={prevSlide}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-md transition-colors"
              >
                <i className="fas fa-chevron-left"></i>
              </button>
              <button
                onClick={nextSlide}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-md transition-colors"
              >
                <i className="fas fa-chevron-right"></i>
              </button>
              
              {/* Carousel Indicators */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                {carouselImages.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentSlide(index)}
                    className={`w-3 h-3 rounded-full transition-colors ${
                      index === currentSlide ? 'bg-white' : 'bg-white/50'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
export const AnimatedContainer = ({ children }) => children;

