import express from "express";
import { Room } from "../../models";

class RoomController {
   async index(req: express.Request, res: express.Response) {
      try {
         const items = await Room.findAll();
         res.json(items);
      } catch (error) {
         res.status(500).json({
            message: "Ошибка в RoomContoller.ts index method, " + error.message,
         });
      }
   }

   async create(req: express.Request, res: express.Response) {
      try {
         const data = {
            title: req.body.title,
            type: req.body.type,
         };
         if (!data.title || !data.type) {
            return res
               .status(400)
               .json({ message: "Отсуствует заголовок или тип комнаты" });
         }
         const room = await Room.create(data);
         res.status(201).json(room);
      } catch (error) {
         res.status(500).json({
            message:
               "Ошибка в RoomContoller.ts create method, " + error.message,
         });
      }
   }

   async show(req: express.Request, res: express.Response) {
      try {
         const roomId = req.params.id;
         if (isNaN(Number(roomId))) {
            return res.status(404).json({ message: "Неверный ID комнаты" });
         }

         const room = await Room.findByPk(roomId);
         if (!room) {
            return res.status(404).json({ message: "Комната не найдена" });
         }

         res.json(room);
      } catch (error) {
         res.status(500).json({
            message: "Ошибка в RoomContoller.ts show method, " + error.message,
         });
      }
   }

   async delete(req: express.Request, res: express.Response) {
      try {
         const roomId = req.params.id;
         if (isNaN(Number(roomId))) {
            return res.status(404).json({ message: "Неверный ID комнаты" });
         }
         await Room.destroy({ where: { id: roomId } });
         res.send();
      } catch (error) {
         res.status(500).json({
            message:
               "Ошибка в RoomContoller.ts delete method, " + error.message,
         });
      }
   }
}

export default new RoomController();
