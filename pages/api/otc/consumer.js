// Admin User Routes

import { connectToDatabase } from "../../../utils/mongodb";
import nodemailer from "nodemailer";

const handler = async (req, res) => {
  const { body, method } = req;
  const { otc: rawOtc } = body;

  const otc = rawOtc
    .trim()
    .split(/[\s-]+/)
    .join("-");

  const { client } = await connectToDatabase();
  const db = await client.db(process.env.MONGODB_DB);
  const usersDB = await db.collection("users");

  const users = await usersDB.find({}).toArray();
  const user = users.find(
    (u) =>
      u.consumers.findIndex((c) => {
        return c.otc === otc;
      }) != -1
  );

  if (!user)
    return res.status(403).json({ msg: "You don't have access to this page" });

  const consumer = user.consumers.find((c) => c.otc === otc);

  if (consumer) {
    switch (method) {
      case "GET":
        // ---------------- GET
        try {
          return res.status(200).json({ msg: "Data found", data: consumer });
        } catch (err) {
          console.error(`api.otc.consumer.GET: ${err}`);
          return res.status(500).json({ msg: "Uncaught Server Error" });
        }
        break;
      case "POST":
        // ---------------- POST
        try {
          const { contact_id } = body;
          if (!contact_id)
            return res.status(400).json({ msg: "Missing Params" });

          const contact = consumer.contacts.find((c) => c._id === contact_id);

          if (!contact) return res.status(400).json({ msg: "Missing Params" });

          let transporter = nodemailer.createTransport(
            process.env.EMAIL_SERVER
          );

          const message = {
            from: process.env.EMAIL_FROM,
            to: contact.email,
            subject: `${consumer.name} would like to speak to you on Lounge`,
            text: `Hi ${contact.name}, ${consumer.name} would like to speak to you on Lounge.`,
            html: `<p>Hi there ${contact.name},<br /> ${consumer.name} would like to speak to you on Lounge. Click <a href="${process.env.JITSI_MEET_URL}/${contact._id}">here</a> to join.<br /><br />Thanks,<br />FISE Lounge Team</p>`,
          };

          transporter.sendMail(message);

          return res.status(200).json({ msg: "Invite Sent successfully" });
        } catch (err) {
          console.error(`api.otc.consumer.POST: ${err}`);
          return res.status(500).json({ msg: "Uncaught Server Error" });
        }
        break;
      case "PUT":
      // ---------------- PUT
      case "DELETE":
      // ---------------- DELETE
      default:
        return res.status(405).json({ msg: "This route does not exist" });
        break;
    }
  } else {
    return res.status(403).json({ msg: "You don't have access to this page" });
  }
};

export default handler;
