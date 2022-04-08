import express from "express";
import dotenv from "dotenv";
import sharp from "sharp";
import cors from "cors";
import fs from "fs";
import { Code } from "../models";

declare global {
   namespace Express {
      interface User extends UserInterface {}
   }
}

dotenv.config({
   path: "server/.env",
});
import "./core/db";
import { passport } from "./core/passport";
import { uploader } from "./core/uploader";
import { UserInterface } from "../pages";
import { runInNewContext } from "vm";

const app = express();

app.use(cors());
// app.use(express.json);
app.use(passport.initialize());

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

const randomCode = (max: number = 9999, min: number = 1000): number =>
   Math.floor(Math.random() * (max - min + 1)) + min;

app.get(
   "/auth/me",
   passport.authenticate("jwt", { session: false }),
   (req, res) => {
      res.json(req.user);
   }
);

app.get(
   "/auth/sms/activate",
   passport.authenticate("jwt", { session: false }),
   async (req, res) => {
      const userId = req.user.id;
      const smsCode = req.query.code;

      if (!smsCode) {
         return res.status(400).send();
      }

      const whereQuery = { code: smsCode, user_id: userId };

      try {
         const findCode = await Code.findOne({
            where: whereQuery,
         });
         if (findCode) {
            await Code.destroy({
               where: whereQuery,
            });
            return res.send();
         } else {
            throw new Error("User not found");
         }
      } catch (error) {
         res.status(500).json({ message: "Error activation" });
      }
   }
);

app.get(
   "/auth/sms",
   passport.authenticate("jwt", { session: false }),
   async (req, res) => {
      const phone = req.query.phone;
      const userId = req.user.id;
      const smsCode = randomCode();

      if (!phone) {
         return res.status(400).send();
      }
      try {
         // await Axios.get(
         //    `https://sms.ru/sms/send?api_id=${process.env.SMS_API_ID}&to=79961236250&msg${smsCode}`
         // );
         await Code.create({
            code: smsCode,
            user_id: userId,
         });

         res.status(201).send();
      } catch (error) {
         res.status(500).json({ message: "Error sms" });
      }
   }
);

app.get("/auth/github", passport.authenticate("github"));

app.get(
   "/auth/github/callback",
   passport.authenticate("github", { failureRedirect: "/login" }),
   (req, res) => {
      console.log("error");
      res.send(
         `<script>
         window.opener.postMessage('${JSON.stringify(req.user)}','*');
         window.close();
         </script>`
      );
   }
);

app.listen(3001, () => {
   console.log("SERVER STARTED");
});
