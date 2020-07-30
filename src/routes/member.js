//gestion des routes des membres
import express from "express";
import { member } from "../model/member.js";
import mongoose from "mongoose";
mongoose.Promise = global.Promise;

let router = express.Router();

let checkId = (id) => {
  if (!isNaN(id)) return true;
  else return false;
};

router
  .route("/users")
  .get((req, res) => {
    member
      .find({})
      .exec()
      .then((name) => res.json(name))
      .catch((err) => res.send(err));
  })
  .post(async (req, res) => {
    let user = new member({
      id: 1,
      name: req.body.name,
      lastName: req.body.lastName,
      avatar: req.body.avatar,
      bornAt: req.body.bornAt,
      adress: req.body.adress,
      zip: req.body.zip,
      city: req.body.city,
      tel1: req.body.tel1,
      tel2: req.body.tel2,
      eMail: req.body.eMail,
    });
    let data = [];

    await member
      .create(user)
      .then((newUser) => {})
      .catch((err) => res.send(err));
    //on met à jour l'id visible sur l'UI
    await member
      .find({})
      .then((userList) => {
        data = userList;
        data.forEach((element) => {
          console.log(element._id);
          member.findOneAndUpdate(
            { _id: element._id },
            { id: data.indexOf(element) },
            { new: true },
            (err, result) => {
              if (err) throw err;
              console.log(result);
            }
          );
        });
      })
      .then("ok")
      .catch((err) => console.log(err));
  });

router
  .route("/users/:id")
  .get((req, res, next) => {
    if (!checkId(req.params.id)) {
      res.send("Not a valid ID");
      return;
    }
    member
      .findOne({ id: req.params.id })
      .exec()
      .then((name) => res.json(name))
      .catch((err) => res.send(err));
  })
  .put(async (req, res, next) => {
    if (!checkId(req.params.id)) {
      res.send("Not a valid ID");
      return;
    }
    await member.updateOne(
      { id: req.params.id },
      {
        name: req.body.name,
        lastName: req.body.lastName,
        avatar: req.body.avatar,
        bornAt: req.body.bornAt,
        adress: req.body.adress,
        zip: req.body.zip,
        city: req.body.city,
        tel1: req.body.tel1,
        tel2: req.body.tel2,
        eMail: req.body.eMail,
      },
      (err, result) => {
        if (err) throw err;
        member.findOne({ id: req.params.id }, (err, result) => {});
        next();
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

router.route("/borndate/:id").put(async (req, res, next) => {
  if (!checkId(req.params.id)) {
    res.send("Not a valid ID");
    return;
  }
  console.log(req.body.born);
  await member.updateOne(
    { id: req.params.id },
    { bornAt: req.body.born },
    (err, result) => {
      if (err) throw err;
      res.json(result);
      next();
    }
  );
});

router.route("/lastname/:id").put();
router.route("/avatar/:id").put();
router.route("/adress/:id").put();
router.route("/zip/:id").put();
router.route("/city/:id").put();
router.route("/tel1/:id").put();
router.route("/tel2/:id").put();
router.route("/mail/:id").put();

router.route("/getname").get((req, res) => {
  member
    .find({})
    .exec()
    .then((name) => res.json(name))
    .catch((err) => res.send(err));
});

export { router };
