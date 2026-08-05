import Note from "../model/Note.js"//include not from notejs for models

export async function getAllNotes(req,res) {//using async since there is a try and ctch block to implement and async fulfills promises
    try {
        const notes = await Note.find();//fetches every single note
        res.status(200).json(notes);//response = status ok with json to send notes
    } catch (error) {//500 http method since server failed
        console.error("Error in getAllNotes controller",error);
        res.status(500).json({message:"internal server error"});
    }
};//to get the controller i simply copied the entire routing 
    //second parameter but to make it work stored it as a variable or function

export async function createNote(req,res) {//after making model and importing, note that to make a note i need a title and content
    //create a note using post method
    //use asynch for try and catch for error handling
    try {
        const{title,content} = req.body;
        const note = new Note({title, content});

        const savedNote = await note.save()
        res.status(201).json(savedNote);//201 http method for success
    }catch (error) {
        console.error("Error in createNote controller", error);
        res.status(500).json({message: "internal server error"});//http method 500 for server internal error

    }
};

export async function updateNote(req,res){
    try {
        const {title,content}= req.body;//requests our title and content from our note models schema
        const updatedNote = await Note.findByIdAndUpdate(req.params.id, {title, content},{new:true});//update params title and content
        //new true param gives us the new node with updated fields but is an optional param

        if (!updatedNote) {//not found or doesnt exist a note with this id
            return res,status(404).json({message: "Note not found"})//http method error 400's which is clientside error for not foundd
        } 
        res.status(200).json({message: "Note updated successful"})
        
    }catch (error) {
        console.error("Error in updateNote controller", error);
        res.status(500).json({message: "Internal server error "});
    }
};

export async function deleteNote(req,res) {
    res.status(200).json({message: "Note successfully deleted"});
};