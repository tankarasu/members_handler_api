import Mongoose from "mongoose";
let Schema = Mongoose.Schema;

let memberSchema = new Schema({
  id: Number,
  name: String,
});

let member = Mongoose.model("member", memberSchema);

export {member}