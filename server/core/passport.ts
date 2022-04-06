import passport from "passport";
import { Strategy as GitHubStrategy } from "passport-github2";
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import { user } from "../../models";
import { UserInterface } from "../../pages";
import { createJwtToken } from "../../utils/createJwtToken";

const opts = {
   jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
   secretOrKey: process.env.JWT_SECRET_KEY,
};

passport.use(
   "jwt",
   new JwtStrategy(opts, (jwt_payload, done) => {
      done(null, jwt_payload.data);
   })
);

passport.use(
   "github",
   new GitHubStrategy(
      {
         clientID: process.env.GITHUB_CLIENT_ID,
         clientSecret: process.env.GITHUB_CLIENT_SECRET,
         callbackURL: "http://localhost:3001/auth/github/callback",
      },
      async (_: unknown, __: unknown, profile, done) => {
         try {
            let userData: UserInterface;

            const obj: Omit<UserInterface, "id"> = {
               fullname: profile.displayName,
               avatarUrl: profile.photos?.[0].value,
               isActive: 0,
               username: profile.username,
               phone: "",
            };

            const findUser = await user.findOne({
               where: {
                  username: obj.username,
               },
            });

            if (!findUser) {
               const userProfile = await user.create(obj);
               userData = userProfile.toJSON();
            } else {
               userData = await findUser.toJSON();
            }

            done(null, {
               ...userData,
               token: createJwtToken(userData),
            });
         } catch (error) {
            done(error);
         }
      }
   )
);

passport.serializeUser(function (user, done) {
   done(null, user.id);
});

passport.deserializeUser(function (id, done) {
   user.findById(id, function (err, user) {
      err ? done(err) : done(null, user);
   });
});

export { passport };
