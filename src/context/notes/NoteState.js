import React from "react";
import noteContext from "./noteContext";
import { useState } from "react";


const NoteState = (props) =>{
    const host = "http://localhost:5000"
    const notesInitial =  [];
      
    const [notes, setNotes] = useState(notesInitial);


    // Get All Notes
    const getNotes = async () => {
      try {
          const response = await fetch(`${host}/api/notes/fetchallnotes`, { 
              method: "GET",
              headers: {
                  "Content-Type": "application/json",
                  "auth-token": localStorage.getItem('token')
              },
          });
  
          if (!response.ok) {
              throw new Error(`HTTP error! Status: ${response.status}`);
          }
  
          const json = await response.json();
          console.log('API response:', json);

           // Check if the response has the expected structure
            //   if (json && json.notes && Array.isArray(json.notes)) {
            //     setNotes(json.notes);
            // } else {
            //     console.error('Invalid response format:', json);
            // }

            // sending json object from backend json.notes is array required
            setNotes(json.notes);

      } catch (error) {
          console.error('Error during fetch:', error);
      }
  };
  
      // Add a Note
      const addNote = async (title, description, tag) =>{
         // API CAll           
         const response = await fetch(`${host}/api/notes/addnote`, { 
          method: "POST",  
            headers: {
              "Content-Type": "application/json",
              "auth-token": localStorage.getItem('token')
            },
            body: JSON.stringify({title, description, tag})
          });

          const note = await response.json();
          setNotes(notes.concat(note.savedNote));
         
       }

      // Delete a Note
      const deleteNote = async (id) =>{
         // API CAll           
         const response = await fetch(`${host}/api/notes/deletenote/${id}`, { 
          method: "DELETE",  
            headers: {
              "Content-Type": "application/json",
              "auth-token": localStorage.getItem('token')
            },
          });
          const json =  response.json(); 
          console.log(json);


        console.log("Deleting note with id" +id)
        const newNotes = notes.filter( (note) => { return note._id !== id });
        setNotes(newNotes);
        
      }

      // Edit a Note
      const editNote = async (id, title, description, tag) =>{
        // API CAll           
          const response = await fetch(`${host}/api/notes/updatenote/${id}`, { 
            method: "PUT",  
              headers: {
                "Content-Type": "application/json",
                "auth-token": localStorage.getItem('token')
              },
              body: JSON.stringify({title, description, tag})
            });
            const json = await response.json(); 
            console.log(json);

            // Logic to edit in client
            let newNotes = JSON.parse(JSON.stringify(notes))
        for(let index = 0; index < newNotes.length; index++){
          const element = newNotes[index];
          if(element._id === id){
            newNotes[index].title = title;
            newNotes[index].description = description;
            newNotes[index].tag = tag;
            break;
          }
        }
        setNotes(newNotes);
      }
   
    return(
        <noteContext.Provider value={{ notes, addNote, deleteNote, editNote, getNotes}}>
            {props.children}
        </noteContext.Provider>
    )
}

export default NoteState;