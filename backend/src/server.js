import express from "express";
import notesRoutes from "./routes/notesRoutes.js";
import {connectDB} from "./config/db.js"
import dotenv from "dotenv"
import rateLimiter from "./middleware/ratelimiter.js";

dotenv.config();//allows us to access .env files made for encrypting important strings
const app = express();
const PORT = process.env.PORT || 3000;
//adds port from hidden env or if failed just our given port of 3000

connectDB()

//middleware, must be before routs
app.use(express.json());//this middleware parses the JSON bodies: allows us to do req.body

// for vercel hosting or reverse proxy
// it ensures req.headers["x-forwarded-for"] returns the real client IP instead of the proxy's ip.
app.set("trust proxy", 1); 

app.use(rateLimiter);

app.use((req,res,next) => {
    console.log(`Req method is ${req.method} & Requests URL is ${req.url}`);
    next();
});//our middleware in this case only acts as a log messanger after the client does a task that forces our controllers to send a request or post to the server
//then our middleware executes the task in its body before returning the answer visually back to the client from the server

app.use("/api/notes",rateLimiter,notesRoutes);//since express.js reads left->right set rate limiter first 

app.listen(PORT,() => {
    console.log("server started on port:", PORT);
})