import { notesDB, projectsDB } from './functions';

export function saveDataToLocalStorage() {
    const notesData = JSON.stringify(notesDB.getNotes());
    const projectsData = JSON.stringify(projectsDB.getProjects());

    localStorage.setItem('notes', notesData);
    localStorage.setItem('projects', projectsData);
}

export function loadDataFromLocalStorage() {
    const storedNotes = localStorage.getItem('notes');
    const storedProjects = localStorage.getItem('projects');

    if (storedNotes) {
        const parsedNotes = JSON.parse(storedNotes);
        notesDB.notes = parsedNotes;
      }
    
    if (storedProjects) {
        const parsedProjects = JSON.parse(storedProjects);
        projectsDB.projects = parsedProjects;
      }
    
    console.log("las notas subidas en localStorage son: ");
    console.log(notesDB.notes);
    console.log("los proyectos subidos en localStorage son: ");
    console.log(projectsDB.projects);  
}