const express = require('express');
const router = express.Router();
const fetchuser = require('../middleware/fetchuser');
const Notes = require('../models/Notes');
const { body, validationResult } = require('express-validator');



// ROUTE 1: Get All the Notes using GET "/api/notes/fetchallnotes".  Login required
router.get('/fetchallnotes', fetchuser, async (req, res) => {
    try{
    const notes = await Notes.find({user: req.user.id});
    return res.status(200).json({ message: 'Notes fetched successfully', notes });

    }  catch (error) {
        console.error('Error fetching all notes:', error.message);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
})

// ROUTE 2: Add a new Note using POST "/api/notes/addnote".  Login required
router.post('/addnote', fetchuser, [
    body('title').isLength({ min: 3 }).withMessage('title must be at least 3 characters'),
    body('description').isLength({ min: 5 }).withMessage('description must be at least 5 characters')
], async (req, res) => {
    try {
         // If there are errors, return bad request and errors
         const result = validationResult(req);
         if (!result.isEmpty()) {
             return res.status(400).json({ errors: result.array() });
         }
         const { title, description, tag } = req.body;
         const notes = new Notes({
            title, description, tag, user: req.user.id
         })
        const savedNote = await notes.save();

        return res.status(200).json({ message: 'Notes added successfully', savedNote });

    } catch (error) {
        console.error('Error adding notes:', error.message);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
    
})

// ROUTE 3: Update an existing Note using PUT "/api/notes/updatenote".  Login required
router.put('/updatenote/:id', fetchuser, async (req, res) => {
    try {
        // extracting values from request body
        const { title, description, tag } = req.body;

        // Create a newNote object
        const newNote = {};

        // Setting new values in newNote object for making updation
        if (title) { newNote.title = title };
        if (description) { newNote.description = description };
        if (tag) { newNote.tag = tag };

        // Find the note to be updated and update it
        const note = await Notes.findById(req.params.id);
        if (!note) {
            return res.status(404).send("Not Found");
        }

        // note.user.toString() gives existing note id and matches with login user id
        // to check if the user is changing his own notes only, otherwise deny
        if (note.user.toString() !== req.user.id) {
            return res.status(401).send("Not Allowed");
        }

        // actually updating notes with newNote
        const updatedNote = await Notes.findByIdAndUpdate(req.params.id, { $set: newNote }, { new: true });
        return res.status(200).send({ note: updatedNote });

    } catch (error) {
        console.error('Error while Updating note:', error.message);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});


// ROUTE 4: Delete an existing Note using DELETE "/api/notes/deletenote".  Login required
router.delete('/deletenote/:id', fetchuser, async (req, res) => {
    try {    

        // Find the note to be deleted and delete it
        const note = await Notes.findById(req.params.id);
        if (!note) {
            return res.status(404).send("Not Found");
        }

        // note.user.toString() gives existing note id and matches with login user id
        // to check if the user is changing his own notes only, otherwise deny
        if (note.user.toString() !== req.user.id) {
            return res.status(401).send("Not Allowed");
        }

        // actually deleting
        const deletedNote = await Notes.findByIdAndDelete(req.params.id);
        return res.status(200).json({ "Success": "Note Deleted Successfully" });

    } catch (error) {
        console.error('Error while Deleting note:', error.message);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});


module.exports = router