//variables globales
const port = process.env.PORT || 3030;
// import { morganChalk } from "./morganChalk.js";

//initialisation Express
import express from "express";
const app = express();
import cors from "cors";

//Body-Parser
import bodyParser from "body-parser";
app.use(cors({ origin: "*", methods: ["GET", "POST", "PUT", "DELETE"] }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

//initialize DB
import mongoose from "mongoose";
const URI =
  "mongodb+srv://tankarasu:Efend!ler1@tankarasu-mmpal.mongodb.net/members_handler_app?authSource=admin";
mongoose.connect(URI, { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Connected to the DB");
});

//middleware
// app.use(morganChalk);

//routes
import { router as memberRouter } from "./routes/member.js";
app.use("/api", memberRouter);

//listening
app.listen(port, () => {
  console.log(`listening on port ${port}`);
});
