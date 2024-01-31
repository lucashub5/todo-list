import '../components/style.css';
import { createNewProject, getInfoProject, createNewNote, getNotesDB, updateNoteDB,
updateProyDB, removeNoteDB, favoriteStatus, deleteProyDB, filterNotes, checkStatus, getProysDB } from './functions.js';
import { format } from 'date-fns';
import logoImage from '../components/images/image-logo.svg';
import informationVariantCircle from '../components/images/information-variant-circle.svg';


export function templateDOM() {
    const headerHTML = `
    <header>
        <div class="logo-user">
            <img src="${logoImage}" alt="logo-user">
            <h1>@UsuarioDemo</h1>
        </div>
        <div class="info-container">
            <div class="abs-info-box">
                <div class="info-box">
                    <ul>
                        <li>Próximo update: </li>
                        <li>Agregarle funcionalidad al elemento Trash.</li>
                        <li>Crear un login para usuarios.</li>
                        <li>Borrar localStorage de usuario.</li>
                        <li>Responsive design.</li>
                        <li>Modularizar más el código.</li>                       
                    </ul>
                </div>
            </div>
            <img src="${informationVariantCircle}" alt="info">
        </div>
    </header>
    `;

    const mainHTML = `
    <main>
        <aside>
            <nav>
            <ul>
                <li id="inbox"><img src="../src/components/images/inbox.svg"><a>Inbox</a></li>
                <li id="today"><img src="../src/components/images/calendar-today.svg"><a>Today</a></li>
                <li id="week"><img src="../src/components/images/calendar-week.svg"><a>This week</a></li>
                <li id="completed-note"><img src="../src/components/images/calendar-multiple-check.svg"><a>Completed</a></li>
                <li id="incompleted-note"><img src="../src/components/images/calendar-incompleted.svg"><a>Incompleted</a></li>
                <li id="favorited-note"><img src="../src/components/images/calendar-star.svg"><a>Favorited</a></li>
                <li id="trash-note"><img src="../src/components/images/delete.svg"><a>Trash</a></li>
            </ul>
            </nav>
            <h2>Projects</h2>
            <nav>
                <ul id="aside-projects">
                </ul>
            </nav>
            <button id="add-project"><img src="../src/components/images/plus.svg"><a>New project</a></button>
        </aside>
        <content>
        </content>
    </main>
    `;

    const footerHTML = `<footer>Copyright © 2023 Lucas Carovano</footer>`;

    document.body.insertAdjacentHTML('beforeend', headerHTML);
    document.body.insertAdjacentHTML('beforeend', mainHTML);
    document.body.insertAdjacentHTML('beforeend', footerHTML);

    document.getElementById('add-project').addEventListener('click', addProjectDOM);
    document.getElementById('inbox').addEventListener('click', () => loadFilterNotes('Inbox'));
    document.getElementById('today').addEventListener('click', () => loadFilterNotes('Today'));
    document.getElementById('week').addEventListener('click', () => loadFilterNotes('This week'));
    document.getElementById('completed-note').addEventListener('click', () => loadFilterNotes('Completed'));
    document.getElementById('incompleted-note').addEventListener('click', () => loadFilterNotes('Incompleted'));
    document.getElementById('favorited-note').addEventListener('click', () => loadFilterNotes('Favorited'));
    document.getElementById('trash-note').addEventListener('click', () => loadFilterNotes('Trash'));

    loadProys();
}

export function addProjectDOM(projects, loadBool = false) {
    console.log("creando nuevo proyecto en DOM");

    const newInput = document.createElement('input');
    newInput.setAttribute('placeholder', 'New folder');
    const newProject = document.createElement('li');
    newProject.innerHTML = `<img src="../src/components/images/calendar-multiselect.svg">`;
    newProject.appendChild(newInput);
    const projectsContainer = document.getElementById('aside-projects');
    projectsContainer.appendChild(newProject);
    newInput.focus();

    if (loadBool) {
        newInput.value = projects.title;
        getEmptyFolder();
    }
    else {
        document.addEventListener('mouseup', getEmptyFolder);
    }

    function getEmptyFolder(event) {
        if(newInput.value.trim() !== '') {
            const newLink = document.createElement('a');
            newLink.textContent = newInput.value;
            let setIdNewProject = '';
            if(loadBool == true) {
                setIdNewProject = projects;
            }
            else {
                setIdNewProject = createNewProject(newInput.value);
            }
            newProject.setAttribute('id-project', setIdNewProject.id);
            newProject.removeChild(newInput);
            newProject.appendChild(newLink);
            const btnRemoveProy = document.createElement('button');
            btnRemoveProy.innerHTML = `<img src="../src/components/images/close.svg">`;
            newProject.appendChild(btnRemoveProy);
            newProject.addEventListener('mouseover', () => {
                btnRemoveProy.style.display = 'flex';
            });
            
            newProject.addEventListener('mouseout', () => {
                btnRemoveProy.style.display = 'none';
            });

            btnRemoveProy.addEventListener('click', removeProy);

            let infoID = newProject.getAttribute('id-project');
            const setTitle = getInfoProject(infoID);
            function setupLoadContDOM() {
                console.log("Cargando proyecto en Content del ID: " + infoID);
                loadProyInContent(getInfoProject(infoID), infoID);
            }
            newLink.addEventListener('click', setupLoadContDOM);
            newLink.addEventListener('click', setupLoadContDOM);
            loadProyInContent(setTitle, infoID);
        }
        else if (event.target == newProject || newProject.contains(event.target)) {
            newProject.remove();
            addProjectDOM();
        }
        else if (newInput.value.trim() === '') {
            newProject.remove();
        }
        document.removeEventListener('mouseup', getEmptyFolder);
    }
}

function preloadContent(title, id) {
    const contentCont = document.querySelector('content');
    contentCont.innerHTML = '';
    const titleProject = document.createElement('textarea');
    titleProject.classList = 'title-project';
    titleProject.textContent = title;
    titleProject.setAttribute('id-project', id);
    console.log("consultando notas del proyecto...");
    const sectionNotes = document.createElement('section');

    return { contentCont, titleProject, sectionNotes };
}

function loadProyInContent(title, id) {
    const { contentCont, titleProject, sectionNotes } = preloadContent(title, id);

    const btnNewNote = `
    <button id="add-note">
        <img src="../src/components/images/plus.svg">
        <a>New note</a>
    </button>
    `;
    sectionNotes.insertAdjacentHTML('beforeend', btnNewNote);

    contentCont.appendChild(titleProject);
    contentCont.appendChild(sectionNotes);

    titleProject.addEventListener('change', saveChangesProy);

    document.getElementById('add-note').addEventListener('click', function() {
        const { noteContainer, descTextarea } = addNoteDOM();
        addNewNote(noteContainer);
        console.log("se ejecuto focus");
        descTextarea.focus();
    });

    loadNotes(id);
}

function addNoteDOM(...args) {
    const [title = "",
     desc = "",
     dueDate = format(new Date(), 'yyyy-MM-dd'),
     priority = false,
     check = false,
     id] = args;

    const noteContainer = document.createElement('div');
    noteContainer.classList.add('note');
    noteContainer.setAttribute('id-note', id);

    const titleInput = document.createElement('textarea');
    titleInput.value = title;
    titleInput.classList.add('title');
    titleInput.setAttribute('placeholder', 'Titulo...');
    titleInput.setAttribute('rows', '1');

    const descTextarea = document.createElement('textarea');
    descTextarea.value = desc;
    descTextarea.classList.add('desc');
    descTextarea.setAttribute('placeholder', 'Crear una nota...');
    descTextarea.setAttribute('rows', '1');

    const dateInput = document.createElement('input');
    dateInput.value = dueDate;
    dateInput.setAttribute('type', 'date');
    dateInput.setAttribute('name', 'date');
    dateInput.classList.add('date');

    const btnsHTML = `
    <button class="check-note">
        <img src="../src/components/images/${check ? 'check-circle' : 'check-circle-outline'}.svg">
    </button>
    <button class="favorite-note">
        <img src="../src/components/images/${priority ? 'star' : 'star-outline'}.svg">
    </button>
    <button class="remove-note">
        <img src="../src/components/images/close.svg">
    </button>`;
    const btnsContainer = document.createElement('div');
    btnsContainer.classList = 'btns-cont'
    btnsContainer.innerHTML = btnsHTML;
   
    noteContainer.addEventListener('mouseover', () => {
        btnsContainer.style.display = 'flex';
    });
    
    noteContainer.addEventListener('mouseout', () => {
        btnsContainer.style.display = 'none';
    });

    noteContainer.appendChild(titleInput);
    noteContainer.appendChild(descTextarea);
    noteContainer.appendChild(dateInput);
    noteContainer.appendChild(btnsContainer);

    const addNote = document.getElementById('add-note');
    if(addNote != null) {
        addNote.insertAdjacentElement('beforebegin', noteContainer);
    }
    else {
        document.querySelector('section').appendChild(noteContainer);
    }

    titleInput.addEventListener('change', saveChanges);
    descTextarea.addEventListener('change', saveChanges);
    dateInput.addEventListener('change', saveChanges);

    document.querySelector(`[id-note="${id}"]`).querySelector('.remove-note').addEventListener('click', removeNote);
    document.querySelector(`[id-note="${id}"]`).querySelector('.favorite-note').addEventListener('click', favoriteNote);
    document.querySelector(`[id-note="${id}"]`).querySelector('.check-note').addEventListener('click', checkNote);
    
    return { titleInput, descTextarea, noteContainer, dateInput };
}

function addNewNote(noteContainer) {
    const titleProject = document.querySelector('.title-project').getAttribute('id-project');

    const setIdNewNotes = createNewNote('', '', format(new Date(), 'yyyy-MM-dd'), false, false, titleProject);
    noteContainer.setAttribute('id-note', setIdNewNotes.id);
}

function saveChanges(event) {
    const setType = event.target.className;
    const setData = event.target.value;
    const idNote = event.target.parentNode.getAttribute('id-note');
    updateNoteDB(idNote, setType, setData);
}

function saveChangesProy(event) {
    const idProy = event.target.getAttribute('id-project');
    const setName = event.target.value;
    updateProyDB(idProy, setName);
    const proyAside = document.getElementById('aside-projects').querySelector(`[id-project="${idProy}"]`);
    const getProy = getInfoProject(idProy)
    proyAside.querySelector('a').textContent = getProy;
}

function removeNote(event) {
    const idNote = event.target.closest('.note').getAttribute('id-note');
    removeNoteDB(idNote);
    event.target.closest('.note').remove();
}

function checkNote(event) {
    const idNote = event.target.closest('.note').getAttribute('id-note');
    const getStatus = checkStatus(idNote);

    if(getStatus == true) {
        const newImage = document.createElement('img');
        newImage.src = '../src/components/images/check-circle.svg';
        event.target.parentNode.appendChild(newImage);
        event.target.remove();
    }
    else {
        const newImage = document.createElement('img');
        newImage.src = '../src/components/images/check-circle-outline.svg';
        event.target.parentNode.appendChild(newImage);
        event.target.remove();
    }
}

function favoriteNote(event) {
    const idNote = event.target.closest('.note').getAttribute('id-note');
    const getStatus = favoriteStatus(idNote);

    if(getStatus == true) {
        const newImage = document.createElement('img');
        newImage.src = '../src/components/images/star.svg';
        event.target.parentNode.appendChild(newImage);
        event.target.remove();
    }
    else {
        const newImage = document.createElement('img');
        newImage.src = '../src/components/images/star-outline.svg';
        event.target.parentNode.appendChild(newImage);
        event.target.remove();
    }
}

function removeProy(event) {
    const idNote = event.target.closest('li').getAttribute('id-project');
    deleteProyDB(idNote);
    event.target.closest('li').remove();
    const getIdProyCont = document.querySelector('.title-project').getAttribute('id-project');
    if (idNote == getIdProyCont) {
        document.querySelector('content').innerHTML = '';
    }
}

function loadFilterNotes(mode) {
    const { contentCont, titleProject, sectionNotes } = preloadContent(mode, undefined);
    contentCont.appendChild(titleProject);
    contentCont.appendChild(sectionNotes);
    const arrayNotes = filterNotes(mode);

    getArray(arrayNotes);
}

function loadNotes(id) {
    const arrayNotes = getNotesDB(id);
    getArray(arrayNotes);
}

function getArray(notes) {
    notes.forEach(note => {
        addNoteDOM(note.title, note.description, note.dueDate, note.priority, note.check, note.id);
    });
}

function loadProys() {
    const arrayProys = getProysDB();
    getProys(arrayProys);
}

function getProys(projects) {
    let loadBool = true;

    projects.forEach(projects => {
        addProjectDOM(projects, loadBool);
    });
}

