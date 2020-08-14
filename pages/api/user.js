import { getSession } from "next-auth/client";
import dbConnect from "../../utils/dbConnect";
import users from "../../models/users";

const handler = async (req, res) => {
  const session = await getSession({ req });
  console.log("SESS", session);

  if (session) {
    const {
      user: { email },
    } = session;
    const {
      // query: { id },
      method,
    } = req;

    await dbConnect();

    switch (method) {
      // ---------------- GET
      case "GET":
        console.log("user.GET");
        try {
          const user = await users.findOne({ email: email });
          if (!user) return res.status(400).json({ success: false });
          return res.status(200).json({ data: user });
        } catch (error) {
          console.error(`api.user.GET: ${error}`);
          res.status(400).json({ success: false });
        }
        break;
      // ---------------- POST
      case "POST":
        console.log("user.POST");
        try {
          const user = await users.findOne({ email: email });
          if (!user) return res.status(400).json({ success: false });

          user.name = "adamStatic";
          user.consumers.push({
            name: "Aydam",
            otc: "fise-otc",
            isCloudEnabled: true,
          });

          await user.save();

          return res.status(200).json({ success: true, data: user });
        } catch (error) {
          console.error(`api.user.GET: ${error}`);
          res.status(400).json({ success: false });
        }
        break;
      // ---------------- PUT
      case "PUT":
        console.log("user.PUT");
        try {
          const user = await users.findOne({ email: email });
          if (!user) return res.status(400).json({ success: false });

          const { name } = req.body;
          user.name = name ? user.name : name;
          await user.save();

          return res.status(200).json({ success: true, data: user });
        } catch (error) {
          console.error(`api.user.PUT: ${error}`);
          res.status(400).json({ success: false });
        }
      // ---------------- DELETE
      case "DELETE":
        console.log("user.DELETE");
        try {
          await users.deleteMany({email: email})
          return res.status(200).json({ success: true });
        } catch (error) {
          console.error(`api.user.PUT: ${error}`);
          res.status(400).json({ success: false });
        }
      default:
        res.status(400).json({ success: false });
        break;
    }
    res.send({ content: "This is protected Content." });
  } else {
    res.status(401).send({ error: "Access Denied" });
  }
  res.end()
};

export default handler;
