import { useRouter } from "next/router";
import React from "react";
import { Avatar } from "../../components/Avatar";
import { Button } from "../../components/Button";
import { Header } from "../../components/Header";
import { Profile } from "../../components/Profile";

export default function ProfilePage() {
   const router = useRouter();
   const { id } = router.query;

   return (
      <>
         <Header />
         <div className="container mt-40">
            <Profile
               fullname={"Ibragimov Bulat"}
               username={"yonko_0"}
               avatarUrl={"/static/Me.jpg"}
               about={
                  "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Magnireiciendis ipsum neque incidunt accusamus a esse, libero,necessitatibus culpa totam quo fuga sapiente dolorum nihilvoluptatum natus dolores explicabo earum nobis."
               }
            />
         </div>
      </>
   );
}
