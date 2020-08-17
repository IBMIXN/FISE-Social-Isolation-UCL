// Consumer Routes

import { getSession } from "next-auth/client";
import { connectToDatabase } from "../../../utils/mongodb";
import randomWords from "random-words";

const handler = async (req, res) => {
  const session = await getSession({ req });

  if (session) {
    const {
      user: { email },
    } = session;
    const {
      query: { consumer_id },
      body,
      method,
    } = req;

    const allowedKeys = ["name", ""];

    const { client } = await connectToDatabase();
    const db = await client.db(process.env.MONGODB_DB);
    const users = db.collection("users");

    const user = await users.findOne({ email: email });

    let consumer = user.consumers.find((c) => c._id === consumer_id);

    if (!consumer)
      return res
        .status(403)
        .json({ message: "You don't have access to this consumer" });

    switch (method) {
      case "GET":
        // ---------------- GET
        try {
          return res
            .status(200)
            .json({ message: "Consumer Data found", data: consumer });
        } catch (err) {
          console.error(`api.consumer.GET: ${err}`);
          return res.status(400).json({ message: "Unexpected error" });
        }
        break;
      case "PUT":
        // ---------------- PUT
        try {
          const { name, isCloudEnabled } = body;

          consumer.name = name || consumer.name;
          consumer.isCloudEnabled = isCloudEnabled || consumer.isCloudEnabled;

          await users.updateOne({ email }, { $set: user });
          return res
            .status(200)
            .json({ message: "Consumer updated successfully" });
        } catch (err) {
          console.error(`api.consumer.PUT: ${err}`);
          return res.status(400).json({ message: "Database error" });
        }
        break;
      // ---------------- DELETE
      case "DELETE":
        try {
          const targetIndex = user.consumers.indexOf(consumer);
          user.consumers.splice(targetIndex, 1);

          await users.updateOne({ email }, { $set: user });
          return res
            .status(200)
            .json({ message: "Consumer Deleted successfully" });
        } catch (err) {
          console.error(`api.consumer.DELETE: ${err}`);
          return res.status(400).json({ message: "Database error" });
        }
        break;
      case "POST":
      // ---------------- POST
      default:
        return res.status(400).json({ message: "This route does not exist" });
        break;
    }
  } else {
    return res
      .status(403)
      .json({ message: "You don't have access to this page" });
  }
};

export default handler;
