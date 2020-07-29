import Mongoose from "mongoose";
let Schema = Mongoose.Schema;

let memberSchema = new Schema({
  id: Number,
  name: String, 
  avatar: String, //à faire
  lastName: String, //à faire
  bornAt: String, //à faire
  adress: String, //à faire
  zip: Number, //à faire
  city: String, //à faire
  tel1: Number, //à faire
  tel2: Number, //à faire
  eMail: String, //à faire
});

let member = Mongoose.model("member", memberSchema);

export { member };
