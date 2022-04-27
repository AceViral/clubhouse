import express from "express";
import dotenv from "dotenv";
import sharp from "sharp";
import cors from "cors";
import fs from "fs";
import AuthController from "./controllers/AuthController";
import RoomController from "./controllers/RoomController";
import { Room } from "../models";
dotenv.config({
   path: "server/.env",
});
import "./core/db";
import { passport } from "./core/passport";
import { uploader } from "./core/uploader";
import { createServer } from "http";
import socket from "socket.io";
import { UserInterface } from "../pages";
import { getUsersFromRoom, SocketRoom } from "../utils/getUsersFromRoom";

const app = express();
const server = createServer(app);
const io = socket(server, {
   cors: { origin: "*" },
});

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
app.post(
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
   const filePath = req.file?.path;
   if (!filePath) {
      throw new Error("Uppload photo error");
   }
   sharp(filePath)
      .resize(150, 150)
      .toFormat("jpeg")
      .toFile(filePath.replace(".png", ".jpeg"), (err) => {
         if (err) {
            throw err;
         }

         fs.unlinkSync(filePath);

         res.json({
            url: `/avatars/${req.file?.filename.replace(".png", ".jpeg")}`,
         });
      });
});
// SOCKETS =======================================
export const rooms: SocketRoom = {};

io.on("connection", (socket) => {
   console.log("SOCKETS", socket.id);

   socket.on("CLIENT@ROOMS:JOIN", ({ user, roomId }) => {
      socket.join(`room/${roomId}`);
      rooms[socket.id] = { roomId, user };
      const speakers = getUsersFromRoom(rooms, roomId);
      io.emit("SERVER@ROOMS:HOME", { roomId: Number(roomId), speakers });
      io.in(`room/${roomId}`).emit("SERVER@ROOMS:JOIN", speakers);
      Room.update(
         { speakers },
         {
            where: {
               id: roomId,
            },
         }
      );
   });

   socket.on("CLIENT@ROOMS:CALL", ({ user, roomId, signal }) => {
      socket.broadcast.to(`room/${roomId}`).emit("SERVER@ROOMS:CALL", {
         user,
         signal,
      });
   });

   socket.on("CLIENT@ROOMS:ANSWER", ({ targetUserId, roomId, signal }) => {
      socket.broadcast.to(`room/${roomId}`).emit("SERVER@ROOMS:ANSWER", {
         targetUserId,
         signal,
      });
   });

   socket.on("disconnect", () => {
      console.log("USERS:" + rooms);
      if (rooms[socket.id]) {
         const { roomId, user } = rooms[socket.id];
         socket.broadcast.to(`room/${roomId}`).emit("SERVER@ROOMS:LEAVE", user);
         delete rooms[socket.id];
         const speakers = getUsersFromRoom(rooms, roomId);
         io.emit("SERVER@ROOMS:HOME", { roomId: Number(roomId), speakers });
         Room.update(
            { speakers },
            {
               where: {
                  id: roomId,
               },
            }
         );
      }
   });
});

server.listen(3001, () => {
   console.log("SERVER STARTED");
});
