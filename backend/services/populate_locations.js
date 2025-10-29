require("dotenv").config({ path: "../.env" });
const { db } = require("./../firebase");
const UserService = require("./UserService");

const indianStates = {
  "Andaman and Nicobar Islands": ["Port Blair"],
  "Andhra Pradesh": [
    "Visakhapatnam",
    "Vijayawada",
    "Guntur",
    "Nellore",
    "Kurnool",
  ],
  "Arunachal Pradesh": ["Itanagar"],
  Assam: ["Guwahati", "Dibrugarh", "Silchar"],
  Bihar: ["Patna", "Gaya", "Bhagalpur"],
  Chandigarh: ["Chandigarh"],
  Chhattisgarh: ["Raipur", "Bhilai", "Bilaspur"],
  "Dadra and Nagar Haveli and Daman and Diu": ["Daman", "Silvassa"],
  Delhi: ["New Delhi"],
  Goa: ["Panaji", "Vasco da Gama", "Margao"],
  Gujarat: ["Ahmedabad", "Surat", "Vadodara", "Rajkot"],
  Haryana: ["Faridabad", "Gurugram", "Panipat"],
  "Himachal Pradesh": ["Shimla", "Dharamshala"],
  "Jammu and Kashmir": ["Srinagar", "Jammu"],
  Jharkhand: ["Ranchi", "Jamshedpur", "Dhanbad"],
  Karnataka: ["Bengaluru", "Mysuru", "Hubballi-Dharwad"],
  Kerala: ["Thiruvananthapuram", "Kochi", "Kozhikode"],
  Ladakh: ["Leh"],
  Lakshadweep: ["Kavaratti"],
  "Madhya Pradesh": ["Indore", "Bhopal", "Jabalpur", "Gwalior"],
  Maharashtra: ["Mumbai", "Pune", "Nagpur", "Thane"],
  Manipur: ["Imphal"],
  Meghalaya: ["Shillong"],
  Mizoram: ["Aizawl"],
  Nagaland: ["Kohima", "Dimapur"],
  Odisha: ["Bhubaneswar", "Cuttack", "Rourkela"],
  Puducherry: ["Puducherry"],
  Punjab: ["Ludhiana", "Amritsar", "Jalandhar"],
  Rajasthan: ["Jaipur", "Jodhpur", "Kota", "Udaipur"],
  Sikkim: ["Gangtok"],
  "Tamil Nadu": ["Chennai", "Coimbatore", "Madurai", "Tiruchirappalli"],
  Telangana: ["Hyderabad", "Warangal", "Nizamabad"],
  Tripura: ["Agartala"],
  "Uttar Pradesh": ["Lucknow", "Kanpur", "Ghaziabad", "Agra", "Varanasi"],
  Uttarakhand: ["Dehradun", "Haridwar"],
  "West Bengal": ["Kolkata", "Asansol", "Siliguri"],
};

const states = Object.keys(indianStates);

async function populateUserLocations() {
  try {
    console.log("Fetching all users...");
    const users = await UserService.findMany({});
    console.log(`Found ${users.length} users to update.`);

    const updatePromises = users.map((user) => {
      const randomState = states[Math.floor(Math.random() * states.length)];
      const citiesInState = indianStates[randomState];
      const randomCity =
        citiesInState[Math.floor(Math.random() * citiesInState.length)];

      return UserService.update(user.id, {
        "profile.location.state": randomState,
        "profile.location.city": randomCity,
      });
    });

    await Promise.all(updatePromises);
    console.log("Successfully updated all users with random locations.");
  } catch (error) {
    console.error("Error populating user locations:", error);
  }
}

populateUserLocations();
