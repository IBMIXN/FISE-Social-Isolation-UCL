// Contact Routes

import { getSession } from "next-auth/client";
import { connectToDatabase } from "../../../utils/mongodb";
import relations from "../../../utils/relations";

const getContact = (user, contact_id) => {
  const consumer = user.consumers.find(
    (cons) => cons.contacts.findIndex((c) => c._id === c) !== -1
  );
  return consumer.contacts.find((contact) => contact._id === contact_id);
};

const handler = async (req, res) => {
  const session = await getSession({ req });

  if (session) {
    const {
      user: { email },
    } = session;
    const {
      query: { contact_id },
      body,
      method,
    } = req;

    const { client } = await connectToDatabase();
    const db = await client.db(process.env.MONGODB_DB);
    const users = db.collection("users");

    const user = await users.findOne({ email: email });

    const consumer = user.consumers.find(
      (cons) => cons.contacts.findIndex((c) => c._id === contact_id) !== -1
    );

    if (!consumer)
      return res
        .status(403)
        .json({ message: "You don't have access to this contact" });

    let contact = consumer.contacts.find((c) => c._id === contact_id);

    if (!contact)
      return res
        .status(403)
        .json({ message: "You don't have access to this contact" });

    switch (method) {
      case "GET":
        // ---------------- GET
        try {

          return res
            .status(200)
            .json({ message: "Contact Data found", data: {...contact, consumer_id: consumer._id} });
        } catch (err) {
          console.error(`api.contact.GET: ${err}`);
          return res.status(400).json({ message: "Unexpected error" });
        }
        break;
      case "PUT":
        // ---------------- PUT
        try {
          const {
            name,
            email: contactEmail,
            profileImage,
            relation: relationStr,
          } = body;

          const relation = relations.indexOf(relationStr);

          if (relation < 0) throw new Error("Invalid relation");
          console.log("contact.put First", 
          // contact);
          user.consumers[0]);
          contact = {
            ...contact,
            ...(name && { name }),
            ...(contactEmail && { email: contactEmail }),
            ...(profileImage && { profileImage }),
            ...(relation && { relation }),
          };
          console.log("Second", 
          // contact);
          user.consumers[0]);


          await users.updateOne({ email }, { $set: user });
          return res
            .status(200)
            .json({ message: "Contact updated successfully" });
        } catch (err) {
          console.error(`api.contact.PUT: ${err}`);
          return res.status(400).json({ message: "Database error" });
        }
        break;
      // ---------------- DELETE
      case "DELETE":
        console.log("delete");
        try {
          console.log(contact);
          const targetIndex = consumer.contacts.indexOf(contact)

          consumer.contacts.splice(targetIndex, 1);
          await users.updateOne({ email }, { $set: user });
          return res
            .status(200)
            .json({ message: "Contact Deleted successfully" });
        } catch (err) {
          console.error(`api.contact.DELETE: ${err}`);
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
