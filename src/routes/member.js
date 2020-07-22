//gestion des routes des membres
import express from "express";
import { member } from "../model/member.js";
import mongoose from "mongoose";

let router = express.Router();
const db = mongoose.connection;

let checkId = (id) => {
  if (!isNaN(id)) return true;
  else return false;
};

router
  .route("/users")
  .get((req, res, next) => {
    db.collection("members")
      .find({})
      .toArray((err, result) => {
        if (err) throw err;
        res.json(result);
        next();
      });
  })
  .post((req, res, next) => {
    let user = new member({ id: 1, name: req.body.name });
    db.collection("members").insertOne(user, (err, result) => {
      if (err) throw err;
      res.send(result["ops"]);
      next();
    });
    db.collection("members")
      .find({})
      .toArray((err, result) => {
        if (err) throw err;
        result.forEach((element) => {
          db.collection("members").updateOne(element, {
            $set: { id: result.indexOf(element) },
          });
        });
        next();
      });
  });

router
  .route("/users/:id")
  .get((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
      "Access-Control-Allow-Methods",
      "GET, POST, OPTIONS, PUT,  DELETE"
    );
    res.setHeader(
      "Access-Control-Allow-Headers",
      "X-Requested-With,content-type"
    );
    res.setHeader("Access-Control-Allow-Credentials", true);
    if (!checkId(req.params.id)) {
      res.send("Not a valid ID");
      return;
    }
    member.findOne({ id: req.params.id }, (err, result) => {
      if (err) throw err;
      res.json(result);
      next();
    });
  })
  .put(async (req, res, next) => {
    if (!checkId(req.params.id)) {
      res.send("Not a valid ID");
      return;
    }
    await member.updateOne(
      { id: req.params.id },
      { name: req.body.name },
      (err, result) => {
        if (err) throw err;
        member.findOne({ id: req.params.id }, (err, result) => {
          if (err) throw err;
          res.json(result);
          next();
        });
      }
    );
  })
  .delete(async (req, res, next) => {
    if (!checkId(req.params.id)) {
      res.send("Not a valid ID");
      return;
    }
    await member.deleteOne({ id: req.params.id }, (err) => {
      res.send(`user deleted`);
      next();
    });
    db.collection("members")
      .find({})
      .toArray((err, result) => {
        if (err) throw err;
        result.forEach((element) => {
          db.collection("members").updateOne(element, {
            $set: { id: result.indexOf(element) },
          });
        });
        next();
      });
  });

export { router };
