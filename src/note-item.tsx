import React from 'react';

export default function NoteItem({
  id,
  title,
  content,
  handleDelete,
}: {
  id: string;
  title: string;
  content: string;
  handleDelete: any;
}) {
  return (
    <>
      <div className="notes-header">
        <button
          onClick={(e) => {
            handleDelete(e, id);
          }}
        >
          x
        </button>
      </div>
      <h2>{title}</h2>
      <p>{content}</p>
    </>
  );
}
