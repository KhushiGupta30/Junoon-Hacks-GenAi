require("dotenv").config({ path: "./.env" });

const { db } = require("./firebase");
const UserService = require("./services/UserService");

const cityCoordinates = {
  "Port Blair": { lat: 11.6234, lon: 92.7265 },
  Visakhapatnam: { lat: 17.6868, lon: 83.2185 },
  Vijayawada: { lat: 16.5062, lon: 80.648 },
  Guntur: { lat: 16.3067, lon: 80.4365 },
  Nellore: { lat: 14.4426, lon: 79.9865 },
  Kurnool: { lat: 15.8281, lon: 78.0373 },
  Itanagar: { lat: 27.0859, lon: 93.6053 },
  Guwahati: { lat: 26.1445, lon: 91.7362 },
  Dibrugarh: { lat: 27.4728, lon: 94.912 },
  Silchar: { lat: 24.8249, lon: 92.7936 },
  Patna: { lat: 25.5941, lon: 85.1376 },
  Gaya: { lat: 24.7963, lon: 85.0084 },
  Bhagalpur: { lat: 25.2497, lon: 86.985 },
  Chandigarh: { lat: 30.7333, lon: 76.7794 },
  Raipur: { lat: 21.2514, lon: 81.6296 },
  Bhilai: { lat: 21.2132, lon: 81.3854 },
  Bilaspur: { lat: 22.0792, lon: 82.1392 },
  Daman: { lat: 20.4283, lon: 72.8397 },
  Silvassa: { lat: 20.2763, lon: 73.0149 },
  "New Delhi": { lat: 28.6139, lon: 77.209 },
  Panaji: { lat: 15.4909, lon: 73.8278 },
  Ahmedabad: { lat: 23.0225, lon: 72.5714 },
  Surat: { lat: 21.1702, lon: 72.8311 },
  Vadodara: { lat: 22.3072, lon: 73.1812 },
  Rajkot: { lat: 22.3039, lon: 70.8022 },
  Faridabad: { lat: 28.4089, lon: 77.3178 },
  Gurugram: { lat: 28.4595, lon: 77.0266 },
  Panipat: { lat: 29.3909, lon: 76.9635 },
  Shimla: { lat: 31.1048, lon: 77.1734 },
  Dharamshala: { lat: 32.219, lon: 76.3234 },
  Srinagar: { lat: 34.0837, lon: 74.7973 },
  Jammu: { lat: 32.7266, lon: 74.857 },
  Ranchi: { lat: 23.3441, lon: 85.3096 },
  Jamshedpur: { lat: 22.8046, lon: 86.2029 },
  Dhanbad: { lat: 23.7957, lon: 86.4304 },
  Bengaluru: { lat: 12.9716, lon: 77.5946 },
  Mysuru: { lat: 12.2958, lon: 76.6394 },
  "Hubballi-Dharwad": { lat: 15.3647, lon: 75.124 },
  Thiruvananthapuram: { lat: 8.5241, lon: 76.9366 },
  Kochi: { lat: 9.9312, lon: 76.2673 },
  Kozhikode: { lat: 11.2588, lon: 75.7804 },
  Leh: { lat: 34.1526, lon: 77.5771 },
  Kavaratti: { lat: 10.5669, lon: 72.6417 },
  Indore: { lat: 22.7196, lon: 75.8577 },
  Bhopal: { lat: 23.2599, lon: 77.4126 },
  Jabalpur: { lat: 23.1815, lon: 79.9864 },
  Gwalior: { lat: 26.2183, lon: 78.1828 },
  Mumbai: { lat: 19.076, lon: 72.8777 },
  Pune: { lat: 18.5204, lon: 73.8567 },
  Nagpur: { lat: 21.1458, lon: 79.0882 },
  Thane: { lat: 19.2183, lon: 72.9781 },
  Imphal: { lat: 24.817, lon: 93.9368 },
  Shillong: { lat: 25.5788, lon: 91.8933 },
  Aizawl: { lat: 23.7271, lon: 92.7176 },
  Kohima: { lat: 25.6586, lon: 94.1053 },
  Dimapur: { lat: 25.9061, lon: 93.7424 },
  Bhubaneswar: { lat: 20.2961, lon: 85.8245 },
  Cuttack: { lat: 20.4625, lon: 85.883 },
  Rourkela: { lat: 22.2604, lon: 84.8536 },
  Puducherry: { lat: 11.9416, lon: 79.8083 },
  Ludhiana: { lat: 30.901, lon: 75.8573 },
  Amritsar: { lat: 31.634, lon: 74.8723 },
  Jalandhar: { lat: 31.326, lon: 75.5762 },
  Jaipur: { lat: 26.9124, lon: 75.7873 },
  Jodhpur: { lat: 26.2389, lon: 73.0243 },
  Kota: { lat: 25.2138, lon: 75.8648 },
  Udaipur: { lat: 24.5854, lon: 73.7125 },
  Gangtok: { lat: 27.3389, lon: 88.6065 },
  Chennai: { lat: 13.0827, lon: 80.2707 },
  Coimbatore: { lat: 11.0168, lon: 76.9558 },
  Madurai: { lat: 9.9252, lon: 78.1198 },
  Tiruchirappalli: { lat: 10.7905, lon: 78.7047 },
  Hyderabad: { lat: 17.385, lon: 78.4867 },
  Warangal: { lat: 17.9689, lon: 79.5941 },
  Nizamabad: { lat: 18.6724, lon: 78.0945 },
  Agartala: { lat: 23.8315, lon: 91.2868 },
  Lucknow: { lat: 26.8467, lon: 80.9462 },
  Kanpur: { lat: 26.4499, lon: 80.3319 },
  Ghaziabad: { lat: 28.6692, lon: 77.4538 },
  Agra: { lat: 27.1767, lon: 78.0081 },
  Varanasi: { lat: 25.3176, lon: 82.9739 },
  Dehradun: { lat: 30.3165, lon: 78.0322 },
  Haridwar: { lat: 29.9457, lon: 78.1642 },
  Kolkata: { lat: 22.5726, lon: 88.3639 },
  Asansol: { lat: 23.6826, lon: 86.9563 },
  Siliguri: { lat: 26.7271, lon: 88.3953 },
};

async function populateUserCoordinates() {
  try {
    console.log("Fetching all users to add coordinates...");
    const users = await UserService.findMany({});
    console.log(`Found ${users.length} users to process.`);

    const updatePromises = [];
    let updatedCount = 0;

    for (const user of users) {
      const city = user.profile?.location?.city;

      if (city && cityCoordinates[city] && !user.profile?.location?.latitude) {
        const baseCoords = cityCoordinates[city];

        const lat = baseCoords.lat + (Math.random() - 0.5) * 0.1;
        const lon = baseCoords.lon + (Math.random() - 0.5) * 0.1;

        const promise = UserService.update(user.id, {
          "profile.location.latitude": lat,
          "profile.location.longitude": lon,
        });
        updatePromises.push(promise);
        updatedCount++;
      }
    }

    if (updatePromises.length > 0) {
      await Promise.all(updatePromises);
      console.log(
        `Successfully updated ${updatedCount} users with mock coordinates.`
      );
    } else {
      console.log("No users needed coordinate updates.");
    }
  } catch (error) {
    console.error(
      "An error occurred while populating user coordinates:",
      error
    );
  }
}

populateUserCoordinates();
