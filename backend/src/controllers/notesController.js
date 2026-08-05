export const getAllNotes = (req,res) => {
     res.status(200).send("you just fetched the notes");
};//to get the controller i simply copied the entire routing 
    //second parameter but to make it work stored it as a variable or function

export const createNote = (req,res) => {
    //create a note using post method
    res.status(201).json({message: "Note created successfully!"});//HTTP status creation 201
};

export const updateNote = (req,res) => {
    res.status(200).json({message: "Note updated successfully!"});//HTTP status ok = 200
};

export const deleteNote = (req,res) => {
    res.status(200).json({message: "Note successfully deleted"});
};