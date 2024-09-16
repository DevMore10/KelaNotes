import React, { useContext, useState } from "react";
import NoteContext from "./NoteContext";
import AlertContext from "../alert/AlertContext";

const NoteState = (props) => {
  const { showAlert } = useContext(AlertContext);
  const initalNotes = [];

  const host = "http://localhost:5000";

  const [notes, setNotes] = useState(initalNotes);

  //Fetch all Notes
  const fetchNote = async () => {
    //API CALL
    const response = await fetch(`${host}/api/notes/fetchallnotes`, {
      method: "GET",
      headers: {
        "content-type": "application/json",
        "auth-token": localStorage.getItem("token"),
      },
    });

    const note = await response.json();
    setNotes(note);
  };

  //Add a Note
  const addNote = async (title, description, tag) => {
    //API CALL
    const response = await fetch(`${host}/api/notes/addnote`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "auth-token": localStorage.getItem("token"),
      },
      body: JSON.stringify({ title, description, tag }),
    });

    const note = await response.json();
    setNotes(notes.concat(note));
    showAlert("Note Added", "success");
  };

  //Delete a Note
  const deleteNote = async (id) => {
    //API CALL
    const response = await fetch(`${host}/api/notes/deletenote/${id}`, {
      method: "DELETE",
      headers: {
        "content-type": "application/json",
        "auth-token": localStorage.getItem("token"),
      },
    });

    // const json = response.json();

    const newNotes = notes.filter((note) => {
      return note._id !== id;
    });
    setNotes(newNotes);
    showAlert("Note Deleted", "danger");
  };

  //Update a Note

  const editNote = async (id, title, description, tag) => {
    //API CALL
    const response = await fetch(`${host}/api/notes/updatenote/${id}`, {
      method: "PUT",
      body: JSON.stringify({ title, description, tag }),
      headers: {
        "content-type": "application/json",
        "auth-token": localStorage.getItem("token"),
      },
    });

    const json = await response.json();

    const newNotes = notes.map((note) => {
      if (note._id === id) {
        return { ...note, title, description, tag };
      }
      return note;
    });

    setNotes(newNotes);
  };

  return (
    <NoteContext.Provider value={{ notes, setNotes, addNote, deleteNote, editNote, fetchNote }}>
      {props.children}
    </NoteContext.Provider>
  );
};

export default NoteState;
