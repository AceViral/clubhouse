import { UserInterface } from "../pages";

export type SocketRoom = Record<
   string,
   { roomId: string; user: UserInterface }
>;

export const getUsersFromRoom = (rooms: SocketRoom, roomId: string) =>
   Object.values(rooms)
      .filter((obj) => obj.roomId === roomId)
      .map((obj) => ({ ...obj.user, roomId: Number(roomId) }));
