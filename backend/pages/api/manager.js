export default function handle(req, res) {
    console.log(process.env.SESSION_SECRET);
    res.end("Hello Manager Route");
}
