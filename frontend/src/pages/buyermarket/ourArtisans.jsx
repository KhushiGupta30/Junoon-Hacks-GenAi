import { useState, useMemo, useEffect } from "react";
import {
  MapPin,
  ArrowRight,
  Users,
  Heart,
  Globe,
  Palette,
  Sparkles,
  Award,
  Store,
  X,
  Lightbulb,
} from "lucide-react";
import Footer from "../../components/layout/Footer";

const featuredArtisans = [
  {
    id: "a1",
    name: "Rina Devi",
    craft: "Master Weaver",
    location: "Varanasi, Uttar Pradesh",
    story:
      "For Rina Devi, weaving is more than a craft; it's a conversation with her ancestors. 'Each thread,' she says, 'carries a story from my grandmother.'",
    fullStory:
      "Born into a family of weavers, Rina Devi learned to weave before she could write. Her grandmother would tell her stories of the Ganges, and Rina would try to capture the river's ripples in her silk threads. For years, she struggled to find a market for her intricate silk sarees, nearly abandoning the art to support her family. 'I was weaving in the dark,' she recalls. 'My hands knew the patterns, but my heart was heavy.' Today, her work is celebrated for its blend of traditional motifs and modern minimalism, allowing her to not only support her family but also to teach a new generation of young women in her village, ensuring the loom's song never fades.",
    imageUrl:
      "https://placehold.co/800x600/3B82F6/FFFFFF?text=Rina+Devi&font=inter",
  },
  {
    id: "a2",
    name: "Suresh Kumar",
    craft: "Potter & Sculptor",
    location: "Jaipur, Rajasthan",
    story:
      "Suresh molds the earth of his homeland. 'When I work with clay,' he explains, 'I feel I am shaping the world and keeping my traditions alive.'",
    fullStory:
      "Suresh Kumar's earliest memory is the cool, damp smell of river clay in his father's workshop. 'He would give me small lumps to play with, and I would make animals and tiny pots,' Suresh remembers. As he grew, his play transformed into a passion. He is a master of both the wheel and hand-sculpting, creating pieces that are both functional and deeply spiritual. He only uses local clays and natural glazes, believing that each piece should carry the essence of Rajasthan. 'When I work with clay,' he explains, 'I feel I am shaping the world and keeping my traditions alive for my children.'",
    imageUrl:
      "https://placehold.co/800x600/8B4513/FFFFFF?text=Suresh+K.&font=inter",
  },
];

const allArtisans = [
  {
    id: "a2",
    name: "Suresh Kumar",
    craft: "Pottery",
    location: "Jaipur, Rajasthan",
    bio: "Suresh molds the earth of his homeland into earthy ceramic mugs and eco-friendly terracotta sculptures.",
    imageUrl:
      "https://placehold.co/600x400/8B4513/FFFFFF?text=Suresh+K.&font=inter",
  },
  {
    id: "a3",
    name: "Priya Singh",
    craft: "Painting",
    location: "Mumbai, Maharashtra",
    bio: "A contemporary artist whose abstract paintings are vibrant explosions of color inspired by city life.",
    imageUrl:
      "https://placehold.co/600x400/EF4444/FFFFFF?text=Priya+S.&font=inter",
  },
  {
    id: "a4",
    name: "Anil Mehta",
    craft: "Woodwork",
    location: "Saharanpur, Uttar Pradesh",
    bio: "Anil practices the intricate art of teak wood carving, creating timeless pieces with floral motifs.",
    imageUrl:
      "https://placehold.co/600x400/A0522D/FFFFFF?text=Anil+M.&font=inter",
  },
  {
    id: "a5",
    name: "Farida Khan",
    craft: "Metalwork",
    location: "Moradabad, Uttar Pradesh",
    bio: "Specializing in hand-beaten brass, Farida creates modern lighting and decor items with a sleek finish.",
    imageUrl:
      "https://placehold.co/600x400/F59E0B/FFFFFF?text=Farida+K.&font=inter",
  },
  {
    id: "a6",
    name: "Meena Kumari",
    craft: "Jewelry",
    location: "Cuttack, Odisha",
    bio: "Meena's delicate Tarakasi (filigree) work in silver is renowned. She creates lightweight, elegant jewelry.",
    imageUrl:
      "https://placehold.co/600x400/9CA3AF/FFFFFF?text=Meena+K.&font=inter",
  },
  {
    id: "a7",
    name: "Kiran & Mohan",
    craft: "Textiles",
    location: "Sanganer, Rajasthan",
    bio: "This husband-and-wife duo uses natural dyes and hand-carved blocks to create stunning textiles.",
    imageUrl:
      "https://placehold.co/600x400/10B981/FFFFFF?text=Kiran+&+Mohan&font=inter",
  },
];


const HeroBanner = () => {
  return (
    <section
      className="relative bg-cover bg-center p-8 md:py-12 md:px-8 text-center mb-12 md:mb-16 rounded-2xl overflow-hidden"
      style={{ backgroundImage: `url(/2.png)` }}
    >
      {}
      <div className="absolute inset-0 bg-black/50 rounded-2xl"></div>

      {}
      <div className="relative z-10">
        <Lightbulb className="w-10 h-10 text-google-yellow mx-auto mb-3" />
        {}
        <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-3">
          Discover Our <span className="text-google-yellow">Artisans</span>
        </h1>
        <p className="text-base md:text-lg text-white/90 max-w-2xl mx-auto">
          Explore authentic items with rich stories, direct from the artisans
          who craft them.
        </p>
      </div>
    </section>
  );
};

const ArtisanCard = ({ artisan }) => {
  const colors = {
    Textiles: "text-google-blue",
    Pottery: "text-google-green",
    Painting: "text-google-red",
    Woodwork: "text-yellow-700",
    Metalwork: "text-google-yellow",
    Jewelry: "text-gray-500",
    default: "text-google-blue",
  };
  const craftColor = colors[artisan.craft.split(" ")[0]] || colors.default;

  return (
    <div className="group bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 transition-all duration-300 hover:shadow-lg flex flex-col">
      <div className="relative h-40 bg-gray-100">
        <img
          src={artisan.imageUrl}
          alt={`Portrait of ${artisan.name}`}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.src =
              "https://placehold.co/600x400/E2E8F0/AAAAAA?text=Image+Error";
          }}
        />
      </div>
      <div className="p-5 flex flex-col flex-grow">
        <h3 className="text-lg font-semibold text-gray-800 mb-1">
          {artisan.name}
        </h3>
        <p className={`text-sm font-medium ${craftColor} mb-2`}>
          {artisan.craft}
        </p>
        <div className="flex items-center space-x-1.5 text-sm text-gray-500 mb-3">
          <MapPin size={14} />
          <span>{artisan.location}</span>
        </div>
        <p className="text-sm text-gray-600 mb-4 line-clamp-3 flex-grow">
          {artisan.bio || artisan.story}
        </p>
        <a
          href="#"
          onClick={(e) => e.preventDefault()}
          className="inline-flex items-center space-x-2 text-sm font-medium text-google-blue rounded-lg transition-colors group-hover:underline mt-auto"
        >
          <span>View Profile</span>
          <ArrowRight size={16} />
        </a>
      </div>
    </div>
  );
};

const FeaturedArtisanCard = ({ artisan, onStoryClick }) => {
  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden flex flex-col md:flex-row border border-gray-100/50 group">
      <div className="md:w-1/3 w-full h-48 md:h-auto">
        <img
          src={artisan.imageUrl}
          alt={`Featured artisan ${artisan.name}`}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          onError={(e) => {
            e.target.src =
              "https://placehold.co/600x600/E2E8F0/AAAAAA?text=Image+Error";
          }}
        />
      </div>
      <div className="md:w-2/3 w-full p-6 flex flex-col justify-center">
        <h3 className="text-2xl font-bold text-gray-800 mt-2 mb-1">
          {artisan.name}
        </h3>
        <div className="flex items-center space-x-2 text-base text-google-blue font-medium mb-3">
          <Award size={18} />
          <span>
            {artisan.craft} from {artisan.location}
          </span>
        </div>
        <p className="text-gray-700 leading-relaxed text-sm mb-5">
          {artisan.story}
        </p>
        <button
          onClick={() => onStoryClick(artisan)}
          className="inline-flex items-center space-x-2 text-sm font-medium text-google-blue rounded-lg transition-colors group-hover:underline w-fit"
        >
          <span>Read Full Story</span>
          <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
};

const StatCard = ({ icon, title, value, color }) => {
  const Icon = icon;
  const colors = {
    blue: "text-google-blue bg-google-blue/10",
    green: "text-google-green bg-google-green/10",
    yellow: "text-google-yellow bg-google-yellow/10",
  };

  return (
    <div className="flex-1 bg-white p-5 rounded-xl shadow-sm border border-gray-100 flex items-center space-x-4">
      <div className={`rounded-full p-3 ${colors[color] || colors.blue}`}>
        <Icon size={24} />
      </div>
      <div>
        <p className="text-sm text-gray-500">{title}</p>
        <p className="text-2xl font-semibold text-gray-800">{value}</p>
      </div>
    </div>
  );
};

const OurImpact = () => {
  const steps = [
    {
      icon: Sparkles,
      title: "Discover Stories",
      description:
        "Connect with the rich heritage and personal journeys behind every unique piece.",
      color: "blue",
    },
    {
      icon: Store,
      title: "Shop Directly",
      description:
        "Your purchases directly support artisans, their families, and their communities.",
      color: "green",
    },
    {
      icon: Heart,
      title: "Empower Heritage",
      description:
        "Help preserve age-old techniques and cultural traditions for future generations.",
      color: "yellow",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {steps.map((step, index) => (
        <div
          key={index}
          className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex space-x-4"
        >
          <div
            className={`flex-shrink-0 rounded-full p-3 bg-google-${step.color}/10 text-google-${step.color}`}
          >
            <step.icon size={24} />
          </div>
          <div>
            <h3 className="text-base font-semibold text-gray-800 mb-1">
              {step.title}
            </h3>
            <p className="text-sm text-gray-600">{step.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

const ArtisanLocationMap = ({ artisanList }) => {
  const [userLocation, setUserLocation] = useState(null);

  const artisanCoords = {
    a1: { x: 800, y: 380, name: "Varanasi" },
    a2: { x: 740, y: 400, name: "Jaipur" },
    a3: { x: 700, y: 600, name: "Mumbai" },
    a4: { x: 750, y: 300, name: "Saharanpur" },
    a5: { x: 760, y: 330, name: "Moradabad" },
    a6: { x: 840, y: 580, name: "Cuttack" },
    a7: { x: 730, y: 410, name: "Sanganer" },
  };

  const artisanColors = ["#EF4444", "#F59E0B", "#10B981"];

  useEffect(() => {
    const timer = setTimeout(() => {
      setUserLocation({ x: 750, y: 340, name: "Delhi" });
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  const styleTag = `
    @keyframes pulse-dot {
      0% { r: 15; opacity: 1; }
      70% { r: 30; opacity: 0; }
      100% { r: 30; opacity: 0; }
    }
    @keyframes pulse-dot-user {
      0% { r: 16; opacity: 1; }
      70% { r: 32; opacity: 0; }
      100% { r: 32; opacity: 0; }
    }
    .artisan-dot-pulse {
      animation: pulse-dot 2s infinite;
      transform-origin: center;
    }
    .user-dot-pulse {
      animation: pulse-dot-user 1.5s infinite;
      transform-origin: center;
    }
    .map-dot-group:hover .map-tooltip {
      opacity: 1;
      transform: translateY(-5px);
    }
  `;

  return (
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden p-6 md:p-8 border border-gray-100">
      <style>{styleTag}</style>
      <h2 className="text-2xl font-bold text-gray-800 mb-2 text-center">
        Artisans Across India
      </h2>
      <p className="text-gray-600 text-center mb-6 max-w-2xl mx-auto">
        Discover our creators, from their workshops to your home.
      </p>
      <div className="relative w-full max-w-lg mx-auto aspect-[1/1.2] md:aspect-[1/1.1]">
        <svg
          viewBox="0 0 1024 1196"
          className="w-full h-full"
          preserveAspectRatio="xMidYMid meet"
        >
          <path
            d="M968.528 450.315C968.077 449.61 967.627 448.904 967.176 448.199C966.726 447.493 966.276 446.788 965.825 446.082L965.375 445.377C955.061 428.026 941.026 412.382 923.27 398.444C905.513 384.506 884.035 372.273 858.836 361.745C833.637 351.217 804.717 342.394 772.076 335.276C739.435 328.158 703.072 322.746 663.073 319.04C623.074 315.333 579.441 313.333 532.174 313.04C484.907 312.746 434.007 314.158 379.475 317.276C324.942 320.394 266.776 325.217 204.977 331.745C143.178 338.273 77.746 346.506 8.68068 356.444C5.83636 356.923 3.06254 357.514 0.35923 358.219C0.288725 358.219 0.218219 358.219 0.147714 358.29C-0.0633023 358.36 0.0712085 358.646 0.282225 358.788C1.51733 359.718 2.89495 360.788 4.41508 361.999C23.6872 376.507 47.9654 394.053 77.2497 414.637C106.534 435.221 140.824 458.843 180.12 485.503C219.416 512.163 263.718 541.861 313.026 574.598C362.334 607.334 416.648 643.109 475.968 681.921C535.289 720.733 599.615 762.584 668.948 807.472C738.28 852.36 812.618 900.285 891.962 951.248C903.053 957.514 914.362 963.999 925.889 970.704C937.416 977.409 949.161 984.333 961.124 991.472C973.086 998.61 985.266 1005.97 997.665 1013.54C1010.06 1021.11 1022.68 1028.9 1023.7 1029.47C1024.15 1029.68 1024.3 1029.54 1024.22 1029.26C1024.01 1028.46 1023.65 1027.52 1023.15 1026.44C1021.15 1022.02 1018.15 1016.32 1014.13 1009.32C1006.1 995.382 995.043 979.052 980.963 960.33C952.802 922.885 911.332 875.961 856.551 819.558C801.77 763.155 733.678 697.272 652.275 621.909C570.873 546.546 476.159 461.703 368.134 367.38C260.11 273.057 138.775 169.255 3.11874 55.9734C2.34213 55.2678 1.49501 54.4917 0.647891 53.6449C-0.199225 52.7981 -0.90483 51.7328 0.147714 50.8155C0.35923 50.5969 0.647891 50.458 1.0074 50.39C32.0955 45.9782 66.8202 42.1455 105.181 38.8918C143.543 35.6382 185.541 33.0218 231.175 31.0427C276.81 29.0636 326.08 27.7218 378.986 27.0163C431.891 26.3109 488.433 26.2404 548.61 26.8072C608.787 27.374 672.599 28.5781 739.027 30.4196C805.454 32.261 874.498 34.7397 946.158 37.8579L957.514 38.4248C968.87 39.1303 980.226 39.8358 991.581 40.6826C1002.94 41.5294 1014.29 42.5181 1023.7 43.6487C1024.08 43.7192 1024.23 43.8582 1024.01 44.1436C1023.7 44.5709 1023.17 45.1436 1022.42 45.8579C1020.9 47.2845 1018.79 49.0636 1016.1 51.1954C1010.71 55.4581 1003.51 60.7136 994.49 66.979C985.47 73.2445 974.631 80.5027 961.973 88.7536C954.966 93.303 947.607 98.0636 940.7 103.016C913.886 122.288 881.047 145.418 842.183 172.404C803.319 199.39 758.43 230.233 707.516 264.933C656.601 299.633 599.661 338.19 536.696 379.033C530.019 383.921 523.11 388.904 516.433 393.999C503.078 404.181 488.715 414.718 473.344 425.61C457.973 436.503 441.594 447.749 424.207 459.349C406.819 470.948 388.423 482.901 369.018 495.199C349.613 507.497 329.199 519.864 307.776 532.288C264.933 557.13 216.065 583.503 161.171 611.409C106.278 639.315 45.36 668.753 1.0074 682.723C0.865893 682.801 0.795388 682.801 0.724883 682.723C0.583375 682.584 0.583375 682.373 0.724883 682.234C2.15149 680.923 3.8603 679.404 5.85131 677.679C12.8344 671.491 21.642 664.088 32.2736 655.467C53.5367 638.195 80.208 617.61 112.288 593.718C176.447 545.923 260.678 486.205 364.978 414.56C368.17 412.374 371.433 410.265 374.766 408.227C390.862 398.29 407.509 388.706 424.757 379.479C441.934 370.252 459.662 361.378 477.939 352.857C496.216 344.337 515.044 336.169 534.422 328.354C553.8 320.539 573.729 313.077 594.208 305.969C614.687 298.86 635.717 292.036 657.297 285.503C678.877 278.969 701.008 272.723 723.689 266.753C746.37 260.783 769.601 255.099 793.383 249.7C817.165 244.3 841.497 239.186 866.38 234.354C891.263 229.522 916.696 224.975 942.68 220.712C950.043 219.431 957.335 218.293 964.556 217.301C971.777 216.31 978.927 215.463 985.996 214.757C993.064 214.052 1000.06 213.489 1006.99 213.068C1013.92 212.646 1020.77 212.366 1023.7 212.228C1024.08 212.228 1024.23 212.366 1024.01 212.646C1023.7 213.074 1023.17 213.646 1022.42 214.361C1020.9 215.787 1018.79 217.566 1016.1 219.698C1010.71 223.961 1003.51 229.216 994.49 235.482C985.47 241.747 974.631 249.005 961.973 257.256C936.649 273.774 905.3 294.15 867.925 318.384C830.55 342.618 787.15 370.712 737.724 402.665C735.614 404.184 733.504 405.626 731.393 407.067C730.046 407.944 728.699 408.82 727.352 409.697C714.475 418.156 700.742 427.18 686.152 436.77C671.562 446.36 656.115 456.516 639.811 467.237C623.508 477.958 606.347 489.245 588.33 501.097C570.312 512.95 551.437 525.368 531.706 538.351C492.245 564.316 448.71 591.436 401.101 619.709C353.491 647.982 301.808 677.408 246.05 707.989C190.292 738.569 130.459 770.304 66.5516 803.19C63.1417 805.454 59.7319 807.64 56.322 809.748C55.0483 810.595 53.7746 811.365 52.5009 812.135C39.6946 820.672 26.0326 829.702 11.5149 839.215C10.7441 839.782 9.97327 840.278 9.20244 840.774C1.22272 846.541 0.441864 851.368 0.147714 852.36C0.0712085 852.579 -0.0633023 852.508 0.147714 852.36C0.218219 852.289 0.288725 852.219 0.35923 852.149C0.647891 851.863 1.0074 851.506 1.43742 851.079C2.29543 850.232 3.44215 849.099 4.87877 847.672C9.07074 843.36 15.0871 837.893 22.9279 831.272C38.6095 817.951 61.3417 799.646 91.1243 776.357C150.69 729.774 230.327 671.27 330.036 600.843C429.744 530.416 549.524 448.067 689.375 353.784C695.42 349.539 701.323 345.436 707.085 341.475C712.846 337.514 718.465 333.695 723.942 329.954C729.419 326.213 734.754 322.55 739.947 318.964C750.334 311.804 760.101 304.97 769.248 298.466C778.396 291.961 786.924 285.798 794.832 280.007C802.74 274.216 809.957 268.798 816.484 263.753C829.539 253.665 841.284 244.381 851.719 235.887C862.155 227.393 871.28 219.68 879.095 212.747C886.91 205.814 893.414 199.65 898.608 194.267C903.801 188.884 907.684 184.282 910.257 180.463C912.83 176.644 914.093 173.606 914.048 171.351C914.002 169.096 912.646 167.622 910.257 166.148C907.868 164.674 904.471 163.199 900.066 161.725C891.259 158.771 880.627 155.817 868.176 152.863C855.725 149.909 841.455 146.955 825.367 144.001C809.279 141.047 791.373 138.093 771.65 135.139C751.927 132.185 730.386 129.23 707.027 126.276C683.668 123.322 658.491 120.368 631.496 117.414C604.501 114.46 575.688 111.506 545.058 108.552C514.428 105.598 481.98 102.644 447.715 99.69C413.449 96.7358 377.365 93.7817 339.463 90.8275C301.56 87.8734 261.839 84.9192 220.3 81.965C178.761 79.0109 135.404 76.0567 90.2285 73.1026C45.0527 70.1484 0.0587247 67.1942 0.282225 67.1942C0.423733 67.1942 0.565242 67.2647 0.70675 67.4074C1.27231 67.9742 2.12644 68.7503 3.26876 69.739C6.9806 72.9926 12.331 77.3052 19.321 82.6806C33.3012 93.4311 53.6475 107.545 80.3601 125.021C133.785 159.972 208.761 206.502 305.289 264.611C401.817 322.721 519.901 392.409 659.539 473.676C665.654 477.527 671.629 481.233 677.462 484.796C683.295 488.359 688.986 491.781 694.535 495.061C700.084 498.34 705.491 501.478 710.756 504.474C721.286 510.463 731.226 516.148 740.575 521.529C749.924 526.91 758.683 531.988 766.852 536.759C775.02 541.53 782.528 545.923 789.375 550.026C803.067 558.233 815.429 565.807 826.46 572.744C837.491 579.68 847.192 585.98 855.563 591.649C863.934 597.317 870.974 602.352 876.685 606.757C882.395 611.162 886.776 614.931 889.827 618.064C892.878 621.196 894.6 623.693 894.992 625.552C895.385 627.411 894.469 628.633 892.511 629.855C890.553 631.077 887.587 632.299 883.613 633.52C875.665 635.964 865.825 638.408 854.093 640.852C842.361 643.296 828.737 645.74 813.22 648.184C797.703 650.627 780.294 653.071 760.993 655.515C741.692 657.959 720.5 660.403 697.415 662.847C674.33 665.29 649.353 667.734 622.484 670.178C595.615 672.622 566.854 675.066 536.201 677.51C505.548 679.954 473.003 682.398 438.566 684.842C404.129 687.286 367.799 689.73 329.577 692.174C291.355 694.618 251.24 697.062 209.233 699.506C167.225 701.95 123.325 704.394 77.5323 706.838C71.1894 707.211 64.8465 707.506 58.5036 707.724C52.1606 707.942 45.8177 708.08 39.4748 708.149C33.1319 708.219 26.789 708.219 20.446 708.149C14.1031 708.08 7.76019 707.942 1.41728 707.724C1.27578 707.724 1.20527 707.724 1.27578 707.795C1.41728 707.938 1.6283 708.156 1.91032 708.442C2.76834 709.297 4.05038 710.519 5.75644 712.103C10.8872 716.92 19.321 723.635 31.0583 732.256C54.533 749.497 90.1717 772.33 138.038 800.757C233.771 857.604 366.505 932.128 536.246 1024.33C543.085 1027.99 550.041 1031.54 557.114 1034.98C564.187 1038.42 571.378 1041.74 578.686 1044.95C586.064 1048.16 593.56 1051.25 601.173 1054.23C616.4 1060.19 630.938 1065.71 644.789 1070.78C658.64 1075.86 671.799 1080.48 684.27 1084.66C696.741 1088.84 708.519 1092.57 719.608 1095.85C730.697 1099.13 741.092 1101.98 750.793 1104.38C760.494 1106.79 769.499 1108.75 777.813 1110.27C786.126 1111.79 793.743 1112.87 800.665 1113.5C807.587 1114.13 813.815 1114.32 819.348 1114.07C824.882 1113.82 829.721 1113.12 833.866 1111.99C838.012 1110.86 841.462 1109.29 844.218 1107.29C846.974 1105.28 849.035 1102.84 850.4 1099.95C851.765 1097.06 852.433 1093.73 852.408 1090.33C852.383 1086.93 851.661 1083.52 850.246 1080.11C847.42 1073.29 842.632 1065.59 835.882 1057.01C822.381 1039.85 804.872 1020.1 783.355 997.757C740.32 953.071 685.05 898.349 617.545 833.589C550.04 768.829 469.7 694.032 376.525 609.199C373.333 606.354 370.07 603.58 366.737 600.877C353.407 590.063 339.294 579.916 324.397 570.436C309.501 560.955 293.821 552.14 277.357 543.991C260.893 535.843 243.645 528.36 225.613 521.542C207.581 514.724 188.753 508.572 169.13 503.086C149.506 497.6 129.088 492.78 107.876 488.625C86.6631 484.47 64.6563 480.982 41.8549 478.163C41.1498 478.092 40.5152 478.022 39.9511 477.881C39.3161 477.81 38.8225 477.67 38.4001 477.387C37.9066 477.033 37.5546 476.537 37.3436 475.9C37.1326 475.264 37.0621 474.488 37.1326 473.57C37.2031 472.653 37.4141 471.594 37.7661 470.392C38.4712 467.987 39.6973 465.045 41.4444 461.564C44.9385 454.602 50.1512 446.065 57.0824 435.954C71.0626 415.733 91.5484 391.018 118.539 361.808C172.52 303.388 248.053 234.931 345.138 156.438C442.223 77.9452 560.859 -11.5837 691.048 -103.149C694.24 -103.854 697.502 -104.489 700.835 -105.054C704.168 -105.618 707.572 -106.111 711.047 -106.533C714.521 -106.955 718.066 -107.306 721.681 -107.585C728.902 -108.149 736.305 -108.427 743.889 -108.427C751.473 -108.427 759.239 -108.149 767.186 -107.585C775.134 -107.022 783.264 -106.173 791.577 -105.042C799.89 -103.91 808.385 -102.493 817.061 -100.791C825.738 -99.0882 834.597 -97.1004 843.638 -94.8275C852.679 -92.5546 861.902 -90.0036 871.306 -87.1745C880.71 -84.3454 890.296 -81.2381 900.066 -77.8526C909.835 -74.4672 919.786 -70.8035 929.919 -66.8617C940.052 -62.9199 950.367 -58.7001 960.864 -54.2021C971.361 -49.7042 982.04 44.9272 968.528 450.315Z"
            fill="#f3f4f6"
            stroke="#d1d5db"
            strokeWidth="0.5"
          />
          {artisanList.map((artisan, index) => {
            const coords = artisanCoords[artisan.id];
            if (!coords) return null;
            const color = artisanColors[index % artisanColors.length];
            return (
              <g key={artisan.id} className="map-dot-group cursor-pointer">
                <circle
                  className="artisan-dot-pulse"
                  cx={coords.x}
                  cy={coords.y}
                  r="15"
                  fill={color}
                  style={{ opacity: 0.6 }}
                />
                <circle
                  cx={coords.x}
                  cy={coords.y}
                  r="13"
                  fill={color}
                  stroke="#ffffff"
                  strokeWidth="2"
                />
                <text
                  x={coords.x}
                  y={coords.y - 25}
                  fill="#111827"
                  fontSize="18"
                  textAnchor="middle"
                  className="map-tooltip opacity-0 transition-all duration-300 font-bold"
                >
                  {coords.name}
                </text>
              </g>
            );
          })}
          {userLocation && (
            <g className="map-dot-group cursor-pointer">
              <title>{userLocation.name}</title>
              <circle
                className="user-dot-pulse"
                cx={userLocation.x}
                cy={userLocation.y}
                r="16"
                fill="#3B82F6"
                style={{ opacity: 0.7 }}
              />
              <circle
                cx={userLocation.x}
                cy={userLocation.y}
                r="14"
                fill="#3B82F6"
                stroke="#ffffff"
                strokeWidth="2.5"
              />
              <circle
                cx={userLocation.x}
                cy={userLocation.y}
                r="6"
                fill="#ffffff"
              />
              <text
                x={userLocation.x}
                y={userLocation.y - 28}
                fill="#3B82F6"
                fontSize="18"
                textAnchor="middle"
                className="map-tooltip opacity-0 transition-all duration-300 font-bold"
              >
                {userLocation.name}
              </text>
            </g>
          )}
        </svg>
      </div>
    </div>
  );
};

const ArtisanStoryModal = ({ artisan, onClose }) => {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative">
          <img
            src={artisan.imageUrl}
            alt={artisan.name}
            className="w-full h-56 object-cover"
            onError={(e) => {
              e.target.src =
                "https://placehold.co/800x400/E2E8F0/AAAAAA?text=Image+Error";
            }}
          />
          <button
            onClick={onClose}
            className="absolute top-4 right-4 bg-white/70 p-1.5 rounded-full text-gray-700 hover:bg-white hover:scale-110 transition-all"
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
        </div>
        <div className="p-6 md:p-8 overflow-y-auto">
          <h2 className="text-3xl font-extrabold text-gray-800 mb-2">
            {artisan.name}
          </h2>
          <div className="flex items-center space-x-2 text-base text-google-blue font-medium mb-6">
            <Award size={18} />
            <span>
              {artisan.craft} from {artisan.location}
            </span>
          </div>
          <div className="prose prose-sm sm:prose-base max-w-none text-gray-700">
            <p>{artisan.fullStory}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function OurArtisansPage() {
  const [selectedArtisan, setSelectedArtisan] = useState(null);

  const uniqueArtisans = useMemo(() => {
    const all = [...featuredArtisans, ...allArtisans];
    const uniqueMap = new Map();
    all.forEach((artisan) => uniqueMap.set(artisan.id, artisan));
    return Array.from(uniqueMap.values());
  }, []);

  const stats = useMemo(() => {
    const states = new Set(
      uniqueArtisans.map((a) => a.location.split(", ")[1])
    );
    const crafts = new Set(uniqueArtisans.map((a) => a.craft.split(" ")[0]));
    return {
      totalArtisans: uniqueArtisans.length,
      totalStates: states.size,
      totalCrafts: crafts.size,
    };
  }, [uniqueArtisans]);

  const handleStoryClick = (artisan) => {
    setSelectedArtisan(artisan);
  };

  const handleCloseModal = () => {
    setSelectedArtisan(null);
  };

  return (
    <div className="font-sans bg-slate-50 min-h-screen text-gray-900">
      <main className="px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <HeroBanner />

        <section className="mb-12 md:mb-16">
          <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
            Featured Artisans
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
            {featuredArtisans.map((artisan) => (
              <FeaturedArtisanCard
                key={artisan.id}
                artisan={artisan}
                onStoryClick={handleStoryClick}
              />
            ))}
          </div>
        </section>

        <section className="mb-12 md:mb-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatCard
              icon={Users}
              title="Total Artisans"
              value={stats.totalArtisans}
              color="blue"
            />
            <StatCard
              icon={Globe}
              title="States Represented"
              value={stats.totalStates}
              color="green"
            />
            <StatCard
              icon={Palette}
              title="Crafts Featured"
              value={stats.totalCrafts}
              color="yellow"
            />
          </div>
        </section>

        <section className="mb-12 md:mb-16">
          <OurImpact />
        </section>

        <section className="mb-12 md:mb-16">
          <ArtisanLocationMap artisanList={uniqueArtisans} />
        </section>

        <section>
          <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
            Meet Our Artisans
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {uniqueArtisans.map((artisan) => (
              <ArtisanCard key={artisan.id} artisan={artisan} />
            ))}
          </div>
        </section>
      </main>

      {selectedArtisan && (
        <ArtisanStoryModal
          artisan={selectedArtisan}
          onClose={handleCloseModal}
        />
      )}
      <Footer />
    </div>
  );
}
