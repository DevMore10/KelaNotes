import React, { useContext } from "react";
import NoteContext from "../context/notes/NoteContext";

const NoteItem = (props) => {
  const { deleteNote } = useContext(NoteContext);

  const { note, updateNote } = props;

  return (
    <div className="col-md-3">
      <div className="card my-3">
        <div className="card-body">
          <h5 className="card-title">{note.title}</h5>
          <p className="card-text">{note.description}</p>
          <div className="d-flex flex-row-reverse">
            <i
              className="fa-solid fa-pen "
              onClick={() => {
                updateNote(note);
              }}
            ></i>
            <i
              className="fa-solid fa-trash mx-3"
              onClick={() => {
                deleteNote(note._id);
              }}
            ></i>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NoteItem;
