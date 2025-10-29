require("dotenv").config({ path: "./.env" });

const { admin, db } = require("./firebase");

async function updateUserDocuments() {
  console.log("Fetching all users from the database...");
  const usersRef = db.collection("users");
  const snapshot = await usersRef.get();

  if (snapshot.empty) {
    console.log("No user documents found.");
    return;
  }

  const batch = db.batch();
  let updatedCount = 0;

  snapshot.forEach((doc) => {
    const userRef = db.collection("users").doc(doc.id);
    batch.update(userRef, { uninvested: true });
    updatedCount++;
  });

  await batch.commit();
  console.log(`Successfully updated ${updatedCount} user documents!`);
}

updateUserDocuments().catch((error) => {
  console.error("An error occurred:", error);
});
