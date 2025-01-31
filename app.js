const addButton = document.querySelector(".add-btn");
const cancelButton= document.querySelector(".cancel-btn");
const storageKey = "Notes";

document.addEventListener("DOMContentLoaded", function () {
  addButton.addEventListener("click", addNewNote);
  cancelButton.addEventListener("click", cancelEditing);

  const notes = retreiveFromStorage(storageKey);
  renderNotes(notes);
});

function addNewNote() {
  const noteInput = document.getElementById("noteInput").value.trim();
  const descriptionInput = document.getElementById("descriptionInput").value.trim();

  if (noteInput && descriptionInput) {
    const newNote = { title: noteInput, description: descriptionInput };
    const currentNotes = retreiveFromStorage(storageKey);
    const updatedNotesArray = [...currentNotes, newNote];
    saveToStorage(storageKey, updatedNotesArray);

    document.getElementById("noteInput").value = "";
    document.getElementById("descriptionInput").value = "";

    renderNotes(updatedNotesArray);
  }
}

function prepareForEditing(index, notes) {

  document.getElementById("noteInput").value = notes[index].title;
  document.getElementById("descriptionInput").value = notes[index].description;
  cancelButton.style.display = "inline-block";

  addButton.removeEventListener("click", addNewNote);
  addButton.textContent="Update Note";
  addButton.addEventListener("click", () => updateNote(index, notes));
}

function updateNote(index, notes) {
  const noteInput = document.getElementById("noteInput").value.trim();
  const descriptionInput = document.getElementById("descriptionInput").value.trim();

  if (noteInput && descriptionInput) {
    notes[index] = { title: noteInput, description: descriptionInput };

    saveToStorage(storageKey, notes);

    document.getElementById("noteInput").value = "";
    document.getElementById("descriptionInput").value = "";

    renderNotes(notes);

    addButton.removeEventListener("click", updateNote);
    addButton.addEventListener("click", addNewNote);
    addButton.textContent="Add Note";
  }
}

function cancelEditing() {
  document.getElementById("noteInput").value = "";
  document.getElementById("descriptionInput").value = "";

  cancelButton.style.display = "none";

  addButton.removeEventListener("click", updateNote);
  addButton.textContent="Add Note";
  addButton.addEventListener("click", addNewNote);
}


function deleteNote(index, notes) {
  const userResponse = confirm("Do you really want to delete this note?");
  if (userResponse) {
    const updatedNotes = notes.filter((note, i) => i !== index);
    saveToStorage(storageKey, updatedNotes);

    renderNotes(updatedNotes);
  }
}

function renderNotes(notes) {
  const notesContainer = document.getElementById("notes-container");
  notesContainer.innerHTML = "";

  //this for me to know when i am passing a wrong type
  if (!Array.isArray(notes)) {
    console.error("Notes should be an array");
    return;
  }

  if (notes.length === 0) {
    notesContainer.innerHTML = '<p class="no-notes-msg">No saved notes</p>';
    return;
  }

  notes.forEach((note, index) => {
    const item = createNoteElement(note, index, notes);
    notesContainer.appendChild(item);
  });
}

function createNoteElement(note, index, notes) {
  const noteCard = document.createElement("div");
  noteCard.classList.add("note-card");

  const noteTitle = document.createElement("h2");
  noteTitle.textContent = note.title;

  const noteDescription = document.createElement("p");
  noteDescription.textContent = note.description;

  const deleteBtn = document.createElement("button");
  deleteBtn.textContent = "Delete Note";
  deleteBtn.classList.add("delete-btn");

  noteCard.appendChild(noteTitle);
  noteCard.appendChild(noteDescription);
  noteCard.appendChild(deleteBtn);

  document.getElementById("noteInput").value = "";
  document.getElementById("descriptionInput").value = "";

  deleteBtn.addEventListener("click", () => deleteNote(index, notes));
  noteTitle.addEventListener("click", () => prepareForEditing(index, notes));
  noteDescription.addEventListener("click", () => prepareForEditing(index, notes));

  return noteCard;
}

//#region Storage
function retreiveFromStorage(key) {
  try {
    const storedData = localStorage.getItem(key);
    return storedData ? JSON.parse(storedData) : [];
  } catch (error) {
    console.error("Error retrieving data from localStorage:", error);
    return [];
  }
}

function saveToStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error("Error saving data to localStorage:", error);
  }
} //#endregion
