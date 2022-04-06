import jwt from "jsonwebtoken";
import { UserInterface } from "../pages";

export const createJwtToken = (user: UserInterface): string => {
   const token = jwt.sign(
      {
         data: user,
      },
      process.env.JWT_SECRET_KEY || "",
      {
         expiresIn: process.env.JWT_MAX_AGE,
         algorithm: "HS256",
      }
   );

   return token;
};
