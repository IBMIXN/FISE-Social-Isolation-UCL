// Admin User Routes

import { getSession } from "next-auth/client";
import { connectToDatabase } from "../../utils/mongodb";

const handler = async (req, res) => {
  const session = await getSession({ req });

  if (session) {
    const {
      user: { email },
    } = session;
    const { body, method } = req;

    const allowedKeys = ["name"];

    const { client } = await connectToDatabase();
    const db = await client.db(process.env.MONGODB_DB);
    const users = db.collection("users");

    switch (method) {
      case "GET":
        // ---------------- GET
        try {
          const user = await users.findOne({ email: email });
          if (user) {
            return res.status(200).json({ msg: "Data found", data: user });
          }
        } catch (err) {
          console.error(`api.user.GET: ${err}`);
          return res.status(500).json({ msg: "Uncaught Server Error" });
        }
        break;
      case "POST":
        // ---------------- POST
        try {
          const { name } = body;
          if (!name) throw new Error("Missing params");

          const user = await users.findOne({ email: email });
          user.consumers = [];
          user.name = name;
          await users.updateOne({ email }, { $set: user });
          // if (!user) return res.status(400).json({ success: false });
          return res.status(200).json({ msg: "Updated successfully" });
        } catch (err) {
          console.error(`api.user.POST: ${err}`);
          return res.status(500).json({ msg: "Uncaught Server Error" });
        }
        break;
      case "PUT":
        // ---------------- PUT
        try {
          const updates = Object.fromEntries(
            Object.entries(body).filter(([key]) => allowedKeys.includes(key))
          );
          await users.updateOne({ email }, { $set: updates });
          // if (!user) return res.status(400).json({ success: false });
          return res.status(200).json({ msg: "Updated successfully" });
        } catch (err) {
          console.error(`api.user.PUT: ${err}`);
          return res.status(500).json({ msg: "Uncaught Server Error" });
        }
        break;
      // ---------------- DELETE
      case "DELETE":
        try {
          await users.deleteOne({ email });
          return res.status(200).json({ msg: "Deleted successfully" });
        } catch (err) {
          console.error(`api.user.DELETE: ${err}`);
          return res.status(500).json({ msg: "Uncaught Server Error" });
        }
        break;

      default:
        return res.status(405).json({ msg: "This route does not exist" });
        break;
    }
  } else {
    return res.status(403).json({ msg: "You don't have access to this page" });
  }
};

export default handler;
