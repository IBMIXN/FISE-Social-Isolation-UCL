import { withIronSession } from "next-iron-session";

const VALID_EMAIL = "chris@decimal.fm";
const VALID_PASSWORD = "opensesame";

export default withIronSession(
  async (req, res) => {
    if (req.method === "POST") {
      const { email, password } = req.body;
      console.log(password);

      if (email === VALID_EMAIL && password === VALID_PASSWORD) {
        req.session.set("user", { email });
        await req.session.save();
        return res.status(201).send("");
      }

      return res.status(403).send("");
    }

    return res.status(404).send("");
  },
  {
    cookieName: "MYSITECOOKIE",
    cookieOptions: {
      secure: process.env.NODE_ENV === "production" ? true : false
    },
    password: process.env.APPLICATION_SECRET
  }
);
