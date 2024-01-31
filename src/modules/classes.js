export class Notes {
    constructor() {
        this.notes = [];
    }

    addNote(note) {
        this.notes.push(note);
    }

    getNotes() {
        return this.notes;
    }
}

export class Projects {
    constructor() {
        this.projects = [];
    }

    addProject(project) {
        this.projects.push(project)
    }

    getProjects() {
        return this.projects;
    }
}
