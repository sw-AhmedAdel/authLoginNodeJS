import mongoose from "mongoose";

const MONGO_URL = process.env.DB_URL;

mongoose.connection.once("open", () => {
  console.log("Runnung Mongo");
});

mongoose.connection.on("error", (err) => {
  console.error(`Error in mongo: ${err}`);
});

async function mongoConnect() {
  await mongoose.connect(MONGO_URL);
}

async function mongoDisconnect() {
  await mongoose.disconnect();
}

export { mongoConnect };
