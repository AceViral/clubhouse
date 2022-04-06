import Link from "next/link";
import React from "react";
import { Button } from "../components/Button";
import { ConversationCard } from "../components/ConversationCard";
import { Header } from "../components/Header";
import { Axios } from "../core/axios";

export default function RoomsPage({ rooms = [] }) {
   return (
      <>
         <Header />
         <div className="container ">
            <div className="mt-40 d-flex align-items-center justify-content-between">
               <h1>All conversations</h1>
               <Button color="green"> + Start room</Button>
            </div>
            <div className="grid mt-30">
               {rooms.map((obj) => {
                  return (
                     <Link
                        href={`/rooms/${obj.speakers[0].id}`}
                        key={obj.speakers[0].id}
                     >
                        <a className="d-flex">
                           <ConversationCard
                              title={obj.title}
                              speakers={obj.speakers}
                              listenersCount={obj.listenersCount}
                           />
                        </a>
                     </Link>
                  );
               })}
            </div>
         </div>
      </>
   );
}

export const getServerSideProps = async () => {
   try {
      const { data } = await Axios.get("/rooms.json");

      return {
         props: {
            rooms: data,
         },
      };
   } catch (error) {
      console.log("ERROR in rooms.tsx");
      return {
         props: {
            rooms: [],
         },
      };
   }
};
