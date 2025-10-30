import React from "react";
import AnimatedSection from "../ui/AnimatedSection";

const features = [
  {
    title: "AI & Insights",
    description:
      "Get trend reports, auto product pages, and a voice guide to track demand and pricing.",
    icon: "🤖",
  },
  {
    title: "Funding & Growth",
    description:
      "Access grants, micro-loans, and certifications with sustainability-focused support.",
    icon: "💡",
  },
  {
    title: "Storytelling & Engagement",
    description:
      "Showcase product stories with video/audio, and involve buyers through votes & pre-orders.",
    icon: "📖",
  },
  {
    title: "Support & Reach",
    description:
      "Get help from Karigar Ambassadors, hybrid events, and shared logistics networks.",
    icon: "🌍",
  },
];

const ExplainerCarousel = () => {
  return (
    <section
      id="ExplainerCarousel"
      className="py-20 bg-cover bg-center relative"
      style={{ backgroundImage: "url('/2.png')" }}
    >
      <div className="container mx-auto px-6 text-center">
        <AnimatedSection>
          <h3 className="text-4xl font-bold text-gray-800 mb-4">
            {" "}
            How It Works ?{" "}
          </h3>
          <p className="text-gray-600 mb-12 max-w-2xl mx-auto">
            {" "}
            A seamless platform connecting every part of the artisan economy.{" "}
          </p>
        </AnimatedSection>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <AnimatedSection key={index}>
              <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-md hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 h-full">
                <div className="text-5xl mb-4">{feature.icon}</div>
                <h4 className="text-2xl font-bold text-google-blue mb-2">
                  {" "}
                  {feature.title}{" "}
                </h4>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ExplainerCarousel;
