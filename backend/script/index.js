import FireData from "../model/classifierModel/index.js";
import fs from "fs";
import mongoose from "mongoose";

const mongoURI = "mongodb+srv://wildfire:wildfire123@cluster0.tuo0w.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";  // Paste your MongoDB URI here

// Connect to MongoDB
await mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
console.log('MongoDB Connected Successfully');

fs.readFile("fire_data_records.json", "utf8", async (err, data) => {
  if (err) {
    console.error("Error reading the file:", err);
    return;
  }

  // Parse the JSON file
  const jsonData = JSON.parse(data);

  // Iterate over each lat/lon pair and insert into the database
  for (let location in jsonData) {
    try {
      const data = jsonData[location];
      // Create a new FireData document
      const fireData = new FireData({
        location,
        data,
      });

      // Save to the database
      await fireData.save();
      console.log(`Data for ${location} saved successfully.`);
    } catch (err) {
      console.error(`Error saving data for ${location}:`, err);
    }
  }

  console.log("Data upload complete.");
});
