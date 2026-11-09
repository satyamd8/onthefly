import express from "express";
import passport from "passport";

const router = express.Router();

router.get("/login/success", (req, res) => {
   if (req.user) {
      res.status(200).json({ success: true, user: req.user });
   } else {
      res.status(401).json({ success: false, user: null });
   }
});

router.get("/login/failed", (req, res) => {
   res.status(401).json({ success: false, message: "failure" });
});

router.get("/logout", (req, res, next) => {
   req.logout((err) => {
      if (err) {
         return next(err);
      }

      req.session.destroy((err) => {
         res.clearCookie("connect.sid");
         res.json({ status: "logout", user: {} });
      });
   });
});

router.get(
   "/github",
   passport.authenticate("github", {
      scope: ["read:user"],
   }),
);

router.get(
   "/github/callback",
   (req, res, next) => {
      passport.authenticate("github", { scope: ["read:user"] }, (err, user) => {
         if (err) {
            return next(err);
         }
         if (!user) {
            return res.redirect("https://client-41vq.onrender.com/destinations");
         }

         req.logIn(user, (loginError) => {
            if (loginError) {
               return next(loginError);
            }
            req.session.save((saveError) => {
               if (saveError) {
                  return next(saveError);
               }
               res.redirect("https://client-41vq.onrender.com/");
            });
         });
      })(req, res, next);
   },
);

export default router;
