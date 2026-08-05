import express from "express";
import notesRoutes from "./routes/notesRoutes.js";
import {connectDB} from "./config/db.js"
import dotenv from "dotenv"

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;
//adds port from hidden env or if failed just our given port of 3000

connectDB()

//middleware, must be before routs
app.use(express.json())

app.use("/api/notes", notesRoutes)
// the beauty of this code base is now that we have
// seperated the routes and controllers from the server file,
// we can create different page routes like to //api/product!
// to a file called productRoutes etc

// app.get("/api/notes", (req,res) => {
//     //delete a note
//     res.send("you got 5 nodes");
// });
// app.post("/api/notes", (req,res) => {
//     //create a note
//     res.status(201).json({message:"Note created successfully"})
// });
// app.put("/api/notes/:id", (req,res) => {
//     //create a note
//     res.status(201).json({message:"Note updated successfully"})
// });
// app.dlete("/api/notes/:id", (req,res) => {
//     //create a note
//     res.status(201).json({message:"Note deleted successfully"})
// });

app.listen(PORT,() => {
    console.log("server started on port:", PORT)
})