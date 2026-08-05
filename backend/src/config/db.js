import mongoose from "mongoose"

export const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        //before mongodb.net/? before the ? I added the name of my database
        console.log("MONGODB CONNECTED SUCCESSFULLY");
    } catch (error) { //if connecting to database fails
        console.error("Error connecting to mongoDB", error);
        process.exit(1); // exit 1 refers to exit as failure
    }
}