// Otc Routes

import Cors from "cors";
import AssistantV2 from "ibm-watson/assistant/v2";
import SpeechToTextV1 from "ibm-watson/speech-to-text/v1";
import { IamAuthenticator } from "ibm-watson/auth";
import { connectToDatabase } from "../../../../utils/mongodb";

import relations from "../../../../utils/relations";

const watsonId = process.env.WATSON_ASSISTANT_ID;

const cors = Cors({
  methods: ["GET", "HEAD", "POST"],
});

function runMiddleware(req, res, fn) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result) => {
      if (result instanceof Error) {
        return reject(result);
      }

      return resolve(result);
    });
  });
}

const stt = new SpeechToTextV1({
  authenticator: new IamAuthenticator({
    apikey: process.env.STT_API_KEY,
  }),
  url: process.env.STT_ENDPOINT,
});

const assistant = new AssistantV2({
  version: "2020-04-01",
  authenticator: new IamAuthenticator({
    apikey: process.env.WATSON_API_KEY,
  }),
  url: process.env.WATSON_ENDPOINT,
});

const handler = async (req, res) => {
  // Run the middleware
  await runMiddleware(req, res, cors);

  const { body, method, query } = req;
  const { otc: rawOtc } = query;

  console.log(rawOtc);

  const otc = rawOtc
    .trim()
    .split(/[\s-]+/)
    .join("")
    .toLowerCase();

  const { client } = await connectToDatabase();
  const db = await client.db(process.env.MONGODB_DB);
  const usersDB = await db.collection("users");

  const users = await usersDB.find({}).toArray();
  const user = users.find(
    (u) =>
      u.consumers.findIndex((c) => {
        return c.otc.split("-").join("") === otc;
      }) != -1
  );

  if (!user)
    return res
      .status(403)
      .json({ message: "You don't have access to this page" });

  const consumer = user.consumers.find(
    (c) => c.otc.split("-").join("") === otc
  );

  if (consumer) {
    switch (method) {
      case "POST":
        // ---------------- POST
        try {
          var assistantInput = {
            message_type: "text",
            text: "",
          };
          const recognizeParams = {
            audio: new Buffer(body, "base64"),
            contentType: "audio/mp3",
          };
          // call stt api with the audio in request and add this to assistant input
          const result = await stt.recognize(recognizeParams);

          assistantInput.text =
            result.result.results[0].alternatives[0].transcript;

          const {
            result: rawAssistantResult,
          } = await assistant.messageStateless({
            assistantId: watsonId,
            input: assistantInput,
          });
          const { output } = rawAssistantResult;

          if (output.intents.length == 0) {
            console.log("Couldn't recognize intent");
            return res.status(400).json("Watson couldn't recognize intents");
          }

          const userIntent = output.intents[0].intent;
          switch (userIntent) {
            case "Call_Contact":
              const contactToCall = output.generic[0].text.toLowerCase();
              return res.json({
                message: "call",
                data: consumer.contacts.find(
                  (contact) =>
                    contact.name.toLowerCase() === contactToCall ||
                    relations[contact.relation].toLowerCase() == contactToCall
                ),
              });
              break;
            case "Change_Background":
              return res.status(200).json({
                message: "changeBg",
                data: true,
              });
              break;
            case "Start_Exercise":
              return res.status(200).json({
                message: "exercise",
                data: true,
              });
              break;
            default:
              throw new Error("Undefined user intent");
          }
        } catch (err) {
          console.error(`api.otc.watson.POST: ${err}`);
          return res
            .status(500)
            .json({ message: "Uncaught Server Error", data: err });
        }
        break;
      case "GET":
      // ---------------- GET
      case "PUT":
      // ---------------- PUT
      case "DELETE":
      // ---------------- DELETE
      default:
        return res.status(405).json({ message: "This route does not exist" });
        break;
    }
  } else {
    return res
      .status(403)
      .json({ message: "You don't have access to this page" });
  }
};

export default handler;
