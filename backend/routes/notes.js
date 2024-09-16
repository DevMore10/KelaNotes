const express = require("express");
const router = express.Router();
const Note = require("../models/Note");
var fetchuser = require("../middleware/fetchuser");
const { body, validationResult } = require("express-validator");

// Route 1: Get all Notes using GET "/api/notes/fetchallnotes". Login req

router.get("/fetchallnotes", fetchuser, async (req, res) => {
  try {
    const notes = await Note.find({ user: req.user.id });
    res.json(notes);
  } catch (error) {
    console.error(error.message);
    res.status(500).json("Internal Server Error");
  }
});

// Route 2: Add a new Note using POST "/api/notes/addnote". Login req

router.post(
  "/addnote",
  fetchuser,
  [
    body("title", "Enter a valid title").isLength({ min: 1 }),
    body("description", "Description must atleast be a Character").isLength({
      min: 1,
    }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { title, description, tag } = req.body;
    try {
      // if errors, send bad request
      const note = new Note({
        title,
        description,
        tag,
        user: req.user.id,
      });
      const savedNote = await note.save();
      res.json(savedNote);
    } catch (error) {
      console.error(error.message);
      res.status(500).json("Internal Server Error");
    }
  }
);

// Route 3: Updating a existing Note using PUT "/api/notes/updatenote". Login req
router.put("/updatenote/:id", fetchuser, async (req, res) => {
  const { title, description, tag } = req.body;
  try {
    const newNote = {};
    if (title) {
      newNote.title = title;
    }
    if (description) {
      newNote.description = description;
    }
    if (tag) {
      newNote.tag = tag;
    }

    //Find the note to be updated and update it
    let note = await Note.findById(req.params.id);
    if (!note) {
      return res.status(404).send("Not Found");
    }
    if (note.user.toString() !== req.user.id) {
      return res.status(401).send("Not Allowed");
    }

    note = await Note.findByIdAndUpdate(
      req.params.id,
      { $set: newNote },
      { new: true }
    );
    //The $set operator is used to specify the fields to update and their new values.

    //new: true specifies that the method should return the updated document instead of the original document.

    res.json({ note });
  } catch (error) {
    console.error(error.message);
    res.status(500).json("Internal Server Error");
  }
});

// Route 4: Deleting a existing Note using DELETE "/api/notes/delete". Login req
router.delete("/deletenote/:id", fetchuser, async (req, res) => {
  try {
    //Find the note to be deleted and delete it
    let note = await Note.findById(req.params.id);
    if (!note) {
      return res.status(404).send("Not Found");
    }

    //Allow deletion only if user owns this note
    if (note.user.toString() !== req.user.id) {
      return res.status(401).send("Not Allowed");
    }

    note = await Note.findByIdAndDelete(req.params.id);
    res.json({ Success: "Note has been Deleted", note });
  } catch (error) {
    console.error(error.message);
    res.status(500).json("Internal Server Error");
  }
});
module.exports = router;
