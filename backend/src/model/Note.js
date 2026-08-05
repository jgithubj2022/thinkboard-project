//all notes have values title description, created date ad updated date.
import mongoose from "mongoose"
//first create a schema
//second crete a model bsaed off of that schema

const noteSchema = new mongoose.Schema({
    title: {//all notes have title
        type:String,
        required: true,
    },
    content: {
        type:String,
        required: true,
    },
    
    },
    {timestamps: true} //createdAt and updatedAt
);

const Note = mongoose.model("Note", noteSchema)

export default Note//create a note model based on the schema above is what this means, and adds timestamp when created