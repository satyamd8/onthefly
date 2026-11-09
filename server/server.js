import express from "express";
import cors from "cors";
import passport from "passport";
import session from "express-session";
import { GitHub } from "./config/auth.js";
import tripRoutes from "./routes/trips.js";
import activityRoutes from "./routes/activities.js";
import destinationRoutes from "./routes/destinations.js";
import tripDestinationRoutes from "./routes/tripsDestinations.js";
import authRoutes from "./routes/auth.js"

const app = express();

app.use(session({
   secret: 'codepath',
   resave: false,
   saveUninitialized: false,
   cookie: {
      secure: true,
      httpOnly: true,
      sameSite: "lax"
   }
}))

app.use(express.json());

app.use(cors({
   origin: 'https://client-41vq.onrender.com',
   methods: 'GET, POST, PUT, DELETE, PATCH',
   credentials: true
}));

app.use(passport.initialize())
app.use(passport.session())

passport.use(GitHub)

passport.serializeUser((user, done) => {
   const { accesstoken, ...sessionUser } = user
   done(null, sessionUser)
})

passport.deserializeUser((user, done) => {
   done(null, user)
})

app.get("/", (req, res) => {
   res.status(200).send(
      '<h1 style="text-align: center; margin-top: 50px;">✈️ On the Fly API</h1>',
   );
});

app.use("/api/trips", tripRoutes);
app.use("/api/activities", activityRoutes);
app.use("/api/destinations", destinationRoutes);
app.use("/api/trip-destinations", tripDestinationRoutes);
app.use("/auth", authRoutes)

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
   console.log(`🚀 Server running on http://localhost:${PORT}`);
});
