import express from "express";
import dotenv from "dotenv";
import sharp from "sharp";
import cors from "cors";
import fs from "fs";
import AuthController from "./controllers/AuthController";
import RoomController from "./controllers/RoomController";
dotenv.config({
   path: "server/.env",
});
import "./core/db";
import { passport } from "./core/passport";
import { uploader } from "./core/uploader";

const app = express();

app.use(cors());
// app.use(express.json);
// Замена верхней строчки
const bodyParser = require("body-parser");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
//
app.use(passport.initialize());

// ROOMS =========================================
app.get(
   "/rooms",
   passport.authenticate("jwt", { session: false }),
   RoomController.index
);
app.post(
   "/rooms",
   passport.authenticate("jwt", { session: false }),
   RoomController.create
);
app.get(
   "/rooms/:id",
   passport.authenticate("jwt", { session: false }),
   RoomController.show
);
app.delete(
   "/rooms/:id",
   passport.authenticate("jwt", { session: false }),
   RoomController.delete
);

// AUTH ==========================================
app.get(
   "/auth/me",
   passport.authenticate("jwt", { session: false }),
   AuthController.getMe
);
app.get(
   "/auth/sms",
   passport.authenticate("jwt", { session: false }),
   AuthController.sensSMS
);
app.get("/auth/github", passport.authenticate("github"));
app.get(
   "/auth/sms/activate",
   passport.authenticate("jwt", { session: false }),
   AuthController.activate
);
app.get(
   "/auth/github/callback",
   passport.authenticate("github", { failureRedirect: "/login" }),
   AuthController.authCallBack
);

// UPLOAD ========================================
app.post("/upload", uploader.single("photo"), (req, res) => {
   const filePath = req.file.path;

   sharp(filePath)
      .resize(150, 150)
      .toFormat("jpeg")
      .toFile(filePath.replace(".png", ".jpeg"), (err) => {
         if (err) {
            throw err;
         }

         fs.unlinkSync(filePath);

         res.json({
            url: `/avatars/${req.file.filename.replace(".png", ".jpeg")}`,
         });
      });
});

app.listen(3001, () => {
   console.log("SERVER STARTED");
});
