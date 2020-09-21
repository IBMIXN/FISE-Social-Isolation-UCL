import crypto from "crypto";
import { connectToDatabase } from "../utils/mongodb";

export async function createUser({ name, email, password }) {
  // Create the user and save the salt and hashed password

  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto
    .pbkdf2Sync(password, salt, 1000, 64, "sha512")
    .toString("hex");

  const { client } = await connectToDatabase();
  const db = await client.db(process.env.MONGODB_DB);
  const users = db.collection("users");

  const existingUser = await users.findOne({ email: email });

  if (existingUser) throw new Error("User Already Exists");

  await users.insertOne({
    name,
    email,
    salt,
    hash,
    consumers: [],
    createdAt: Date.now(),
  });

  return { email, createdAt: Date.now() };
}

export async function findUser({ username, password }) {
  // Lookup user in DB and compare the password:
  const email = username;

  const { client } = await connectToDatabase();
  const db = await client.db(process.env.MONGODB_DB);
  const users = db.collection("users");

  const user = await users.findOne({ email: email });

  if (!user) throw new Error("Invalid Email/Password");
  const hash = crypto
    .pbkdf2Sync(password, user.salt, 1000, 64, "sha512")
    .toString("hex");
  const passwordsMatch = user.hash === hash;

  if (!passwordsMatch) throw new Error("Invalid Email/Password");
  return { username, createdAt: user.createdAt };
}
