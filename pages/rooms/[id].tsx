import React from "react";
import { Api } from "../../api";
import { BackButton } from "../../components/BackButton";
import { Header } from "../../components/Header";
import { Room } from "../../components/Room";
import { GetServerSideProps } from "next";
import { wrapper } from "../../redux/store";
import { checkAuth } from "../../utils/checkAuth";

export default function RoomPage({ room }) {
   return (
      <>
         <Header />
         <div className="container mt-30">
            <BackButton title={"All rooms"} href={"/rooms"} />
            <Room title={room.title} />
         </div>
      </>
   );
}

export const getServerSideProps: GetServerSideProps =
   wrapper.getServerSideProps((store) => async (ctx) => {
      try {
         const user = await checkAuth(ctx, store);

         if (!user) {
            return {
               props: {},
               redirect: {
                  permanent: false,
                  destination: "/",
               },
            };
         }

         const roomId = ctx.query.id;
         const room = await Api(ctx).getRoom(roomId as string);

         return {
            props: {
               room,
            },
         };
      } catch (error) {
         console.log("Ошибка в [id].tsx");
         return {
            props: {},
            redirect: {
               destination: "/rooms",
               permanent: false,
            },
         };
      }
   });
