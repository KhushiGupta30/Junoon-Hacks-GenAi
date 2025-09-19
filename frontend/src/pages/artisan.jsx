import React, { useState, useEffect, useRef } from 'react';

const AnimatedSection = ({ children, className = "" }) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, []);

  return (
    <div
      ref={ref}
      className={`transition-all duration-1000 ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
      } ${className}`}
    >
      {children}
    </div>
  );
};

const PageHero = ({ title, highlightText, subtitle, backgroundImage, highlightColorClass = 'text-google-blue' }) => (
  <section
    className="min-h-[60vh] flex items-center justify-center pt-24 bg-cover bg-[center_bottom_30%] relative text-center"
    style={{ backgroundImage: `url(${backgroundImage})` }}
  >
    <div className="absolute inset-0 bg-black/50"></div>
    <div className="container mx-auto px-6 relative z-10">
      <AnimatedSection>
        <div className="max-w-3xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-extrabold text-white leading-tight mb-4">
            {title}{' '}
            <span className={highlightColorClass}>{highlightText}</span>
          </h1>
          <p className="text-lg text-white/90 font-medium">
            {subtitle}
          </p>
        </div>
      </AnimatedSection>
    </div>
  </section>
);

const Testimonials = ({ testimonials, accentColorClass = 'border-google-yellow' }) => (
  <section className="py-20 bg-white">
    <div className="container mx-auto px-6">
      <AnimatedSection>
        <h2 className="text-4xl font-bold text-center text-gray-800 mb-12">Success Stories</h2>
      </AnimatedSection>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {testimonials.map((testimonial, index) => (
          <AnimatedSection key={index}>
            <div className={`bg-white p-8 rounded-2xl shadow-lg border-l-8 ${accentColorClass}`}>
              <p className="text-gray-600 italic mb-6">"{testimonial.quote}"</p>
              <div className="flex items-center">
                <div>
                  <p className="font-bold text-gray-800">{testimonial.name}</p>
                  <p className="text-sm text-gray-500">{testimonial.role}</p>
                </div>
              </div>
            </div>
          </AnimatedSection>
        ))}
      </div>
    </div>
  </section>
);

const CallToAction = ({ onApplyClick, roleName, buttonColorClass = 'bg-google-red' }) => (
  <section className="py-20 bg-gray-100">
    <div className="container mx-auto px-6 text-center">
      <AnimatedSection>
        <h2 className="text-4xl font-bold text-gray-800 mb-4">Ready to Join?</h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
          Become a part of the HunarGhar ecosystem today and start your journey with us.
        </p>
        <button
          onClick={() => onApplyClick(roleName)}
          className={`${buttonColorClass} text-white font-bold px-10 py-4 rounded-full hover:opacity-90 transition-all duration-300 transform hover:scale-105 shadow-lg`}
        >
          Apply as an {roleName}
        </button>
      </AnimatedSection>
    </div>
  </section>
);


const artisanTestimonials = [
  { quote: 'HunarGhar gave my weaving a global stage. I went from selling locally to having customers in three new countries!', name: 'Priya S.', role: 'Textile Weaver from Rajasthan' },
  { quote: 'The funding I received through the platform allowed me to buy a new kiln and double my production. It was a game-changer.', name: 'Anand V.', role: 'Pottery Artist from Gujarat' },
];


const ArtisanPage = ({ onApplyClick }) => {
  return (
    
    <>
      <PageHero
        title="For Every"
        highlightText="Artisan"
        subtitle="Bring your craft to the world. We provide the tools, you provide the talent."
        backgroundImage="/1.png" 
        highlightColorClass="text-google-yellow"
      />

      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6 space-y-16">
          
          <AnimatedSection>
            <div className="text-center">
              <h2 className="text-4xl font-bold text-gray-800 mb-4">Smart Tools for Modern Creators 🛠️</h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-10">We use technology to simplify your work, so you can focus on what you do best: creating.</p>
            </div>
            <div className="grid md:grid-cols-3 gap-8 text-left">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="font-bold text-xl mb-2 text-google-blue">AI-Powered Trend Reports</h3>
                <p className="text-gray-600">Stay ahead of the curve. Our AI provides regular updates on buyer preferences, seasonal demands, and popular styles in your specific craft. You'll always know what the market wants.</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="font-bold text-xl mb-2 text-google-blue">Automated Product Pages</h3>
                <p className="text-gray-600">Selling online has never been easier. Simply provide basic details about your product, and our system will instantly generate a beautiful, professional-looking product page for you.</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="font-bold text-xl mb-2 text-google-blue">Interactive Voice Guide</h3>
                <p className="text-gray-600">Get instant answers with our two-way voice assistant. Ask questions like, "Which of my products are in high demand?" and get immediate, data-driven advice.</p>
              </div>
            </div>
          </AnimatedSection>
          
          <hr/>

          <AnimatedSection>
            <div className="text-center">
                <h2 className="text-4xl font-bold text-gray-800 mb-4">Tell Your Story, Build Your Brand 📖</h2>
                <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-10">Your art has a story, and we help you tell it. Connect with customers on a deeper level by sharing the heart behind your work.</p>
            </div>
            <div className="grid md:grid-cols-2 gap-8 text-left">
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h3 className="font-bold text-xl mb-2 text-google-green">Story-Based Product Pages</h3>
                    <p className="text-gray-600">Go beyond simple images. Upload video and audio clips directly to your listings. Share the origins of your craft, show your creation process, and introduce the culture and passion woven into every piece.</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h3 className="font-bold text-xl mb-2 text-google-green">Crowdsourced Designs</h3>
                    <p className="text-gray-600">Involve your community in the creative process! Let customers vote or pre-order their favorite designs. This ensures your innovative work meets real market demand, reducing risk and building loyal customers.</p>
                </div>
            </div>
          </AnimatedSection>

          <hr/>

          <AnimatedSection>
            <div className="text-center">
                <h2 className="text-4xl font-bold text-gray-800 mb-4">Fuel Your Growth & Creativity 💰</h2>
                <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-10">We provide the financial support and resources you need to expand your vision and scale your business.</p>
            </div>
            <div className="grid md:grid-cols-3 gap-8 text-left">
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h3 className="font-bold text-xl mb-2 text-google-yellow">Rapid Prototyping Grants</h3>
                    <p className="text-gray-600">Have a brilliant new idea? We offer small grants and micro-loans specifically for materials, allowing you to experiment with new designs and find the perfect market fit without financial pressure.</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h3 className="font-bold text-xl mb-2 text-google-yellow">Inventory Financing</h3>
                    <p className="text-gray-600">Never miss a sale due to a lack of materials. We provide micro-credit options to help you stock up on raw materials, especially during peak seasons.</p>
                </div>
                 <div className="bg-white p-6 rounded-lg shadow-md">
                    <h3 className="font-bold text-xl mb-2 text-google-yellow">Access to Investors</h3>
                    <p className="text-gray-600">Your talent deserves investment. We connect you with potential investors who are passionate about supporting artisans. In return for support, you can offer them exclusive access or discounts.</p>
                </div>
            </div>
          </AnimatedSection>

          <hr/>
          
          <AnimatedSection>
            <div className="text-center">
                <h2 className="text-4xl font-bold text-gray-800 mb-4">Your Bridge to a Global Market 🌍</h2>
                <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-10">Whether you sell at a local market or online, we integrate your sales channels seamlessly and handle the complexities of shipping.</p>
            </div>
            <div className="grid md:grid-cols-2 gap-8 text-left">
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h3 className="font-bold text-xl mb-2 text-google-red">Offline-to-Online Integration</h3>
                    <p className="text-gray-600">Host hybrid pop-up showrooms and events, showcasing products locally while streaming online to reach buyers worldwide. Use our QR-coded product tags to link physical items directly to your online store.</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h3 className="font-bold text-xl mb-2 text-google-red">Shared Logistics & Warehousing</h3>
                    <p className="text-gray-600">Reduce your operational costs. We offer partnership models for affordable group shipping (domestic and international), warehousing, and returns management, so you don't have to handle it alone.</p>
                </div>
            </div>
          </AnimatedSection>

          <hr/>

          <AnimatedSection>
            <div className="text-center">
                <h2 className="text-4xl font-bold text-gray-800 mb-4">Dedicated Support & Sustainable Practices 🌱</h2>
                <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-10">You're not just a seller; you're part of a community. We're here to support you and help you grow sustainably.</p>
            </div>
            <div className="grid md:grid-cols-2 gap-8 text-left">
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h3 className="font-bold text-xl mb-2 text-purple-600">Local Ambassador Program</h3>
                    <p className="text-gray-600">Get hands-on help from our trained "Karigar Ambassadors." These local experts are available in your region to help you get started, provide motivation, and connect you with a network of fellow artisans.</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h3 className="font-bold text-xl mb-2 text-purple-600">Sustainability & Certification</h3>
                    <p className="text-gray-600">We encourage eco-friendly practices. Access our directories for sustainable material suppliers and government schemes. We also provide certifications for products based on their authenticity and sustainable craftsmanship.</p>
                </div>
            </div>
          </AnimatedSection>

        </div>
      </section>

      <Testimonials testimonials={artisanTestimonials} accentColorClass="border-google-red" />
      
      <CallToAction 
        onApplyClick={onApplyClick} 
        roleName="Artisan"
        buttonColorClass="bg-google-red" 
      />
    </>
  );
};

export default ArtisanPage;