import { Shield, Users, Target, CheckCircle } from '../utils/icons.jsx';

const About = () => {
  const values = [
    {
      icon: Shield,
      title: 'Quality Assurance',
      description: 'We ensure all products meet the highest quality standards'
    },
    {
      icon: Users,
      title: 'Customer First',
      description: 'Our customers are at the heart of everything we do'
    },
    {
      icon: Target,
      title: 'Innovation',
      description: 'We continuously seek innovative solutions for our clients'
    },
    {
      icon: CheckCircle,
      title: 'Reliability',
      description: 'Dependable products and services you can trust'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">About Anzia Electronics</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Your trusted partner for high-quality electronic tools, appliances, and machinery in Kenya
          </p>
        </div>

        {/* Story Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Story</h2>
            <div className="space-y-4 text-gray-600">
              <p>
                Founded with a vision to provide Kenya with access to premium electronic tools and equipment, 
                Anzia Electronics has been serving professionals, businesses, and DIY enthusiasts for years.
              </p>
              <p>
                We understand the importance of reliable tools in getting the job done right. That's why we 
                carefully curate our inventory to include only the best brands and products that meet our 
                strict quality standards.
              </p>
              <p>
                From power tools for construction professionals to precision instruments for technicians, 
                we have everything you need to succeed in your projects.
              </p>
            </div>
          </div>
          <div className="bg-primary-100 rounded-lg p-8 ">
            <h3 className="text-2xl font-bold text-gray-900 mb-4 force-black">Why Choose Us?</h3>
            <ul className="space-y-3">
              <li className="flex items-center">
                <CheckCircle className="w-5 h-5 text-primary-600 mr-3" />
                <span className="force-black">Genuine products from authorized dealers</span>
              </li>
              <li className="flex items-center">
                <CheckCircle className="w-5 h-5 text-primary-600 mr-3" />
                <span className="force-black">Competitive pricing and flexible payment options</span>
              </li>
              <li className="flex items-center">
                <CheckCircle className="w-5 h-5 text-primary-600 mr-3" />
                <span className="force-black">Expert technical support and consultation</span>
              </li>
              <li className="flex items-center">
                <CheckCircle className="w-5 h-5 text-primary-600 mr-3" />
                <span className="force-black">Fast delivery across Kenya</span>
              </li>
              <li className="flex items-center">
                <CheckCircle className="w-5 h-5 text-primary-600 mr-3" />
                <span className="force-black">Comprehensive warranty coverage</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Values Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <div key={index} className="bg-white rounded-lg p-6 text-center shadow-sm">
                  <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-8 h-8 text-primary-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{value.title}</h3>
                  <p className="text-gray-600">{value.description}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Stats Section */}
        <div className="bg-white rounded-lg p-8 shadow-sm">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-primary-600 mb-2">500+</div>
              <div className="text-gray-600">Products Available</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary-600 mb-2">50+</div>
              <div className="text-gray-600">Trusted Brands</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary-600 mb-2">1000+</div>
              <div className="text-gray-600">Happy Customers</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary-600 mb-2">5+</div>
              <div className="text-gray-600">Years of Experience</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
