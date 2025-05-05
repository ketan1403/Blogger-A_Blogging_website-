import mongoose from "mongoose";

export const connectDB = async () => {
  await mongoose.connect(
    "mongodb+srv://ketanbadgujar5:Ketan50@cluster0.vkl19ut.mongodb.net/blog-app"
  );
  console.log("MongoDB connected");
};
