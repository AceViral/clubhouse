import { UserInterface } from "../pages";

declare global {
   namespace Express {
      interface User extends UserInterface {}
   }
}
