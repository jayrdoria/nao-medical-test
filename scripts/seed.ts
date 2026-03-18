import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const MONGODB_URI = process.env.MONGODB_URI ?? "mongodb://mongo:27017/ajaia-docs";

const UserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true, lowercase: true },
  passwordHash: String,
  createdAt: { type: Date, default: Date.now },
});

const User = mongoose.models.User ?? mongoose.model("User", UserSchema);

const users = [
  { name: "Alice", email: "alice@ajaia.dev" },
  { name: "Bob", email: "bob@ajaia.dev" },
  { name: "Carol", email: "carol@ajaia.dev" },
];

async function seed() {
  await mongoose.connect(MONGODB_URI);
  console.log("Connected to MongoDB");

  const hash = await bcrypt.hash("password123", 10);

  for (const u of users) {
    await User.updateOne(
      { email: u.email },
      { $setOnInsert: { name: u.name, email: u.email, passwordHash: hash } },
      { upsert: true }
    );
    console.log(`Upserted user: ${u.email}`);
  }

  console.log("Seed complete");
  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
