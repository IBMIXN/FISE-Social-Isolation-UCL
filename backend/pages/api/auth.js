import { withIronSession } from "next-iron-session";

const VALID_EMAIL = "spam@alphabetiq.com";
const VALID_PASSWORD = "rtyu4567";

export default withIronSession(
  async (req, res) => {
    if (req.method === "POST") {
      const { email, password } = req.body;
      console.log("pass", password);

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
    cookieName: "FISEAUTHCOOKIE",
    cookieOptions: {
      secure: process.env.NODE_ENV === "production" ? true : false
    },
    password: process.env.APPLICATION_SECRET
  }
);