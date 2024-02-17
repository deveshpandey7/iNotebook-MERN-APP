import React from "react";
import noteContext from "./noteContext";
import { useState } from "react";


const NoteState = (props) =>{
    const host = "http://localhost:5000"
    const notesInitial =  []
      
    const [notes, setNotes] = useState(notesInitial);


    const getNotes = async () => {
      try {
          const response = await fetch(`${host}/api/notes/fetchallnotes`, {
              method: "GET",
              headers: {
                  "Content-Type": "application/json",
                  "auth-token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjVjOGUyNzU0OWFjNTlkYTIxNjU2MzMyIn0sImlhdCI6MTcwNzY4NDU0M30.ZZDmfMDirj56Qq4tFUm28L4KocAH3NT9RRriRKpldqk"
              },
          });
  
          if (!response.ok) {
              throw new Error(`HTTP error! Status: ${response.status}`);
          }
  
          const json = await response.json();
          console.log(json);
      } catch (error) {
          console.error('Error during fetch:', error);
      }
  };
  
  // Replace "your_token_here" with your actual authentication token.
  // Call the getNotes function when you want to fetch notes.
  // getNotes();
  
      // Add a Note
      const addNote = async (title, description, tag) =>{
         // API CAll           
         const response = await fetch(`${host}/api/notes/addnote`, { 
          method: "POST",  
            headers: {
              "Content-Type": "application/json",
              "auth-token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjVjOGUyNzU0OWFjNTlkYTIxNjU2MzMyIn0sImlhdCI6MTcwNzY4NDU0M30.ZZDmfMDirj56Qq4tFUm28L4KocAH3NT9RRriRKpldqk"
            },
            body: JSON.stringify(title, description, tag)
          });
          

          // Logic for Adding note at client
        console.log("Adding a new note");
       const note = {
          "_id": "65ccffb41f4a85cc1f950aa851",
          "user": "65c8e27549ac59da216563332",
          "title": title,
          "description": description,
          "tag": tag,
          "date": "2024-02-14T18:00:20.319Z",
          "__v": 0
        }
        setNotes(notes.concat(note));
      }

      // Delete a Note
      const deleteNote = (id) =>{
        console.log("Deleting note with id" +id)
       const newNotes = notes.filter( (note) => { return note._id !== id });
        setNotes(newNotes);
        
      }

      // Edit a Note
      const editNote = async (id, title, description, tag) =>{
        // API CAll           
          const response = await fetch(`${host}/api/notes/updatenote/${id}`, { 
            method: "POST",  
              headers: {
                "Content-Type": "application/json",
                "auth-token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjVjOGUyNzU0OWFjNTlkYTIxNjU2MzMyIn0sImlhdCI6MTcwNzY4NDU0M30.ZZDmfMDirj56Qq4tFUm28L4KocAH3NT9RRriRKpldqk"
              },
              body: JSON.stringify({title, description, tag})
            });
            const json =  response.json(); 

            // Logic to edit in client
        for(let index = 0; index < notes.length; index++){
          const element = notes[index];
          if(element._id === id){
            element.title = title;
            element.description = description;
            element.tag = tag;
          }
        }
      }
   
    return(
        <noteContext.Provider value={{notes, getNotes, addNote, deleteNote, editNote}}>
            {props.children}
        </noteContext.Provider>
    )
}

export default NoteState;