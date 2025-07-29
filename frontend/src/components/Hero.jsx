import { useState, useEffect } from "react";
// Font Awesome icons used directly in JSX
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
    subtitle: "Up to 50% Off",
    video: "/images/GET THE BEST POWER TOOLS1.mp4",
    cta: "Shop Now",
    bg: "from-blue-600 to-blue-800"
  },
  {
    id: 2,
    title: "Generators & Power Equipment",
    subtitle: "Reliable Power Solutions",
    image: "/images/2.jpg",
    cta: "Explore",
    bg: "from-green-600 to-green-800"
  },
  {
    id: 3,
    title: "Welding Machines",
    subtitle: "Professional Grade",
    image: "/images/3.jpg",
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
    <div className="pt-16 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6 py-4 sm:py-6">
          {/* Main Content - appears first on mobile */}
          <div className="lg:col-span-3 lg:order-2 space-y-3 sm:space-y-4 md:space-y-6">
            {/* Search Bar - appears first on mobile */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-3 sm:p-4">
              <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                <div className="flex-1 relative">
                  <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm sm:text-base"></i>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search products, brands..."
                    className="w-full pl-9 sm:pl-10 pr-3 sm:pr-4 py-2.5 sm:py-3 text-sm sm:text-base border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
                <button
                  type="submit"
                  className="bg-primary-600 text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg hover:bg-primary-700 transition-colors font-medium text-sm sm:text-base whitespace-nowrap"
                >
                  Search
                </button>
              </form>
            </div>

            {/* Carousel */}
            <div className="relative bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
              <div className="relative h-48 sm:h-64 md:h-80 lg:h-96">
                {carouselImages.map((slide, index) => (
                  <div
                    key={slide.id}
                    className={`absolute inset-0 transition-opacity duration-500 ${
                      index === currentSlide ? 'opacity-100' : 'opacity-0'
                    }`}
                  >
                    {slide.video ? (
                      <div className="h-full relative">
                        <video 
                          autoPlay 
                          muted 
                          loop 
                          className="w-full h-full object-cover"
                        >
                          <source src={slide.video} type="video/mp4" />
                        </video>
                      </div>
                    ) : (
                      <div 
                        className="h-full bg-cover bg-center bg-no-repeat relative"
                        style={{ backgroundImage: `url(${slide.image})` }}
                      >
                      </div>
                    )}
                    <div className="absolute inset-0">
                      <div className="absolute inset-0 bg-black/40"></div>
                      <div className="relative h-full flex items-center px-4 sm:px-6 md:px-8">
                        <div className="text-white max-w-xs sm:max-w-sm md:max-w-lg">
                          <h2 className="text-lg sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-2 sm:mb-3 md:mb-4 drop-shadow-lg leading-tight">{slide.title}</h2>
                          <p className="text-sm sm:text-base md:text-lg lg:text-xl mb-3 sm:mb-4 md:mb-6 drop-shadow-lg">{slide.subtitle}</p>
                          <button 
                            onClick={() => navigate('/products')}
                            className="bg-primary-600 text-white px-4 sm:px-6 md:px-8 py-2 sm:py-2.5 md:py-3 rounded-lg font-medium hover:bg-primary-700 transition-colors shadow-lg text-sm sm:text-base"
                          >
                            {slide.cta}
                          </button>
                        </div>
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
                <i className="fas fa-chevron-left text-black"></i>
              </button>
              <button
                onClick={nextSlide}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-md transition-colors"
              >
                <i className="fas fa-chevron-right text-black"></i>
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
            
            {/* Categories - appears third on mobile */}
            <div className="lg:hidden">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4">
                <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-4">Categories</h3>
                <div className="grid grid-cols-2 gap-2">
                  {categories.map((category) => (
                    <button
                      key={category.name}
                      onClick={() => navigate(`/products?category=${encodeURIComponent(category.name)}`)}
                      className="flex items-center p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors text-left"
                    >
                      <i className={`${category.icon} text-primary-500 mr-2`}></i>
                      <div>
                        <div className="font-medium text-gray-900 dark:text-gray-100 text-sm">{category.name}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          {/* Categories Sidebar - Desktop only */}
          <div className="hidden lg:block lg:col-span-1 lg:order-1">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4">
              <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-4">Categories</h3>
              <div className="space-y-2">
                {categories.map((category) => (
                  <button
                    key={category.name}
                    onClick={() => navigate(`/products?category=${encodeURIComponent(category.name)}`)}
                    className="w-full flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors text-left"
                  >
                    <div className="flex items-center space-x-3">
                      <i className={`${category.icon} text-primary-500`}></i>
                      <div>
                        <div className="font-medium text-gray-900 dark:text-gray-100">{category.name}</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">{category.count}</div>
                      </div>
                    </div>
                  </button>
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

