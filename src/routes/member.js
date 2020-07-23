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
    member.find({}, (err, result) => {
      if (err) throw err;
      res.json(result);
      next();
    });
  })
  .post(async (req, res, next) => {
    let user = new member({ id: 1, name: req.body.name });

    await member.create(user, (err, result) => {
      if (err) throw err;
      res.send(result.name + " added to DB");
      next();
    });
    await member.find({}, (err, result) => {
      if (err) throw err;
      result.forEach((element) => {
        member.findByIdAndUpdate(
          element._id,
          { id: result.indexOf(element) },
          { useFindAndModify: false },
          (err) => {
            if (err) throw err;
          }
        );
      });
      next();
    });
  });

router
  .route("/users/:id")
  .get((req, res, next) => {
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
      if (err) throw err;
      res.send(`user deleted`);
      next();
    });
    await member.find({}, (err, result) => {
      if (err) throw err;
      result.forEach((element) => {
        member.findByIdAndUpdate(
          element._id,
          { id: result.indexOf(element) },
          { useFindAndModify: false },
          (err) => {
            if (err) throw err;
          }
        );
      });
      next();
    });
  });

export { router };
