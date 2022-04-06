import { useRouter } from "next/router";
import React from "react";
import { BackButton } from "../../components/BackButton";
import { Header } from "../../components/Header";
import { Room } from "../../components/Room";
import { Axios } from "../../core/axios";

export default function RoomPage({ room }) {
   const router = useRouter();
   const { id } = router.query;

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

export const getServerSideProps = async (ctx) => {
   try {
      const { data } = await Axios.get("/rooms.json");
      const room = data.find((obj) => obj.speakers[0].id === ctx.query.id);
      return {
         props: {
            room,
         },
      };
   } catch (error) {
      console.log("ERROR in rooms/[id].tsx");
      return {
         props: {
            rooms: [],
         },
      };
   }
};
