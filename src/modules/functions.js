import { Notes, Projects } from './classes.js'
import { format, endOfWeek, isWithinInterval } from 'date-fns';
import { saveDataToLocalStorage } from './localStorage.js';

export const projectsDB = new Projects();
export const notesDB = new Notes();

function incrementID() {
    const maxIdInNotes = notesDB.notes.reduce((maxId, note) => {
        return note.id > maxId ? note.id : maxId;
    }, -1);

    const maxIdInProjects = projectsDB.projects.reduce((maxId, project) => {
        return project.id > maxId ? project.id : maxId;
    }, -1);

    return { idNotes: maxIdInNotes + 1, idProjects: maxIdInProjects + 1 };
}

export function createNewProject(title) {
    const idProjects = incrementID().idProjects;
    const newProject = { title, id: idProjects };
    projectsDB.addProject(newProject);
    console.log("proyecto '" + title + "' guardado correctamente en base de datos con ID: " + idProjects);
    saveDataToLocalStorage();
    return newProject;
}

export function createNewNote(title, description, dueDate, priority, check, project) {
    const idNotes = incrementID().idNotes;
    const newNote = { title, description, dueDate, priority, check, project, id: idNotes };
    notesDB.addNote(newNote);
    console.log("nueva nota creada correctamente en base de datos con ID: " + idNotes);
    saveDataToLocalStorage();
    return newNote;
}

export function removeNoteDB(id) {
    const index = notesDB.notes.findIndex(note => note.id == id);
    notesDB.notes.splice(index, 1);
    saveDataToLocalStorage();
}

export function deleteProyDB(id) {
    const index = projectsDB.projects.findIndex(project => project.id == id);
    projectsDB.projects.splice(index, 1);
    notesDB.notes = notesDB.notes.filter(note => note.project !== id);
    saveDataToLocalStorage();
} 

export function getInfoProject(infoID) {
    const intID = parseInt(infoID, 10);
    const project = projectsDB.projects.find(project => project.id == intID);
    return project.title || null;
}

export function getNotesDB(id) {
    const getNotes = notesDB.notes.filter(note => note.project == id);
    return getNotes;
  }

export function getProysDB() {
    return projectsDB.projects;
}

export function updateNoteDB(id, type, data) {
    const index = notesDB.notes.findIndex(note => note.id == id);

        switch (type) {
            case 'title':
                notesDB.notes[index].title = data;
                break;
            case 'desc':
                notesDB.notes[index].description = data;
                break;
            case 'date':
                notesDB.notes[index].dueDate = data;
                break;
        }

    saveDataToLocalStorage();
}

export function updateProyDB(id, data) {
    const index = projectsDB.projects.findIndex(proy => proy.id == id);
    projectsDB.projects[index].title = data;
    saveDataToLocalStorage();
}

export function favoriteStatus(id) {
    const index = notesDB.notes.findIndex(note => note.id == id);
    saveDataToLocalStorage();
    return notesDB.notes[index].priority = !notesDB.notes[index].priority;

}

export function checkStatus(id) {
    const index = notesDB.notes.findIndex(note => note.id == id);
    saveDataToLocalStorage();
    return notesDB.notes[index].check = !notesDB.notes[index].check;

}

export function filterNotes(mode) {
    const currentDate = format(new Date(), 'yyyy-MM-dd');

    if (mode === 'Inbox') {
        const filteredNotes = notesDB.notes.filter(note => note.dueDate >= currentDate);
        return filteredNotes.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
    }
    else if (mode === 'Today') {
        const filteredNotes = notesDB.notes
        .filter(note => !note.check)
        .filter(note => {
            return currentDate == note.dueDate;
        }); 
        return filteredNotes;
    }
    else if (mode === 'This week') {
        const dateEndOfWeek = format(endOfWeek(currentDate), 'yyyy-MM-dd');

        const filteredNotes = notesDB.notes
        .filter(note => !note.check)
        .filter(note => {
            const formattedDueDate = new Date(note.dueDate);
            return isWithinInterval(formattedDueDate, { start: currentDate, end: dateEndOfWeek });
        });
    
        return filteredNotes.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
    }
    else if (mode === 'Completed') {
        return notesDB.notes.filter(note => note.check == true);
    }
    else if (mode === 'Incompleted') {
        const filteredNotes = notesDB.notes
        .filter(note => !note.check)
        .filter(note => note.dueDate < currentDate);
        return filteredNotes.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
    }
    else if (mode === 'Favorited') {
        return notesDB.notes.filter(note => note.priority);
    }
    else if (mode === 'Trash') {
    }

    return [];
}

