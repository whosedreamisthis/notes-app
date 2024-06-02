import React, { useState, useEffect } from 'react';
import NoteItem from './note-item';
import './App.css';
import './note-item';
const BASE_URL = 'https://notes-app-ae7v.onrender.com';
const { v4 } = require('uuid');

const initialNote = {
  id: '',
  title: '',
  content: '',
};
const App = () => {
  const [notes, setNotes] = useState([]);
  const [currentNote, setCurrentNote] = useState(null);
  const [title, setTitle] = useState ("");
  const [content, setContent] = useState("");
  useEffect(() => {
    fetch(`${BASE_URL}/notes`, {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    })
      .then((res) => res.json())
      .then((data) => setNotes(data.notes));
    //       console.log(res);
    //     });
  }, []);
  const handleAddNote = (event) => {
    event.preventDefault();
    if (currentNote) {
      handleUpdateNote(event);
      return;
    }
    if (title.trim() === '' || content.trim() === '') {
      return;
    }
    const note = {
      title,
      content,
      id: v4(),
    };
    setNotes([...notes, note]);
    setTitle('');
    setContent('');
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(note),
    };
    fetch(`${BASE_URL}/newnote`, {
      headers: {
        method: 'POST',
        'Content-Type': 'application/json',
        Accept: 'application/json',
        body: JSON.stringify(note),
      },
    }).then((res) => res.json());
  };
  const handleCancel = (e) => {
    setTitle('');
    setContent('');
    setCurrentNote(null);
  };
  const handleUpdateNote = (event) => {
    event.preventDefault();
    if (!currentNote) {
      return;
    }
    const updatedNote = {
      id: currentNote.id,
      title,
      content,
    };
    const updatedNotes = notes.map((note) =>
      note.id === currentNote.id ? updatedNote : note
    );
    setNotes(updatedNotes);
    setTitle('');
    setContent('');
    setCurrentNote(null);
  };

  const handleNoteClick = (note) => {
    setCurrentNote(note);
    setTitle(note.title);
    setContent(note.content);
  };

  const handleNoteDelete = (event, noteId) => {
    event.stopPropagation();
    setNotes(notes.filter((note) => note.id !== noteId));

    fetch(`${BASE_URL}/deletenote`, {
      headers: {
        method: 'POST',
        'Content-Type': 'application/json',
        Accept: 'application/json',
        body: JSON.stringify({
          id: noteId,
        }),
      },
    });
  };
  return (
    <div className="app-container">
      <form className="note-form" onSubmit={handleAddNote}>
        <input
          value={title}
          placeholder="title"
          required
          onChange={(e) => {
            setTitle(e.target.value);
          }}
        ></input>
        <textarea
          value={content}
          placeholder="Content"
          rows={10}
          required
          onChange={(e) => {
            setContent(e.target.value);
          }}
        ></textarea>
        {currentNote ? (
          <div className="buttons-container">
            <button type="submit">Save</button>
            <button
              onClick={handleCancel}
              className="cancel-button"
              type="button"
            >
              Cancel
            </button>
          </div>
        ) : (
          <button type="submit" className="add-note-button">
            Add Note
          </button>
        )}
      </form>

      <div className="notes-grid">
        {notes.map((note) => (
          <div
            key={note.id}
            className="note-item"
            onClick={(e) => {
              handleNoteClick(note);
            }}
          >
            <NoteItem
              id={note.id}
              title={note.title}
              content={note.content}
              handleDelete={handleNoteDelete}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;
