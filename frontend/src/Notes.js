import React, { useState, useEffect } from "react";
import shortid from "shortid";

const { REACT_APP_NOTES_URL } = process.env;

const Notes = (props) => {
  const [notes, setNotes] = useState([]);
  const [thisNote, setThisNote] = useState("");

  const loaderHandler = () => {
    fetch(REACT_APP_NOTES_URL)
      .then((response) => response.json())
      .then((all) => {
        setNotes(all);
      });
  };
  const sendHandler = (event, thisNote) => {
    event.preventDefault();
    const data = {
      content: thisNote,
      id: shortid.generate(),
    };

    fetch(REACT_APP_NOTES_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(data),
    }).then((response) => {
      setThisNote("");
      loaderHandler();
    });
  };

  const deleteHandler = (id) => {
    fetch(`${REACT_APP_NOTES_URL}/${id}`, {
      method: "DELETE",
    }).then((response) => loaderHandler());
  };

  useEffect(() => {
    loaderHandler();
  });

  return (
    <>
      <div className="header">
        <h1>Notes</h1>
        <button className="update_button" onClick={loaderHandler}>
          ↻
        </button>
      </div>

      <div className="notes">
        {notes.map((item) => {
          return (
            <div key={item.id} className="item">
              <p className="item_text">{item.content}</p>
              <button
                className="delete_button"
                onClick={() => deleteHandler(item.id)}
              >
                X
              </button>
            </div>
          );
        })}
      </div>

      <form
        className="add_form"
        onSubmit={(event) => sendHandler(event, thisNote)}
      >
        <h2>New item</h2>
        <div className="input_form">
          <textarea
            className="textarea"
            value={thisNote}
            onChange={(event) => setThisNote(event.target.value)}
          />
          <button className="add_button" type="submit">
            ➢
          </button>
        </div>
      </form>
    </>
  );
};

export default Notes;
