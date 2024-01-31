import { templateDOM } from './modules/domLoad.js';
import { loadDataFromLocalStorage } from './modules/localStorage.js';
//localStorage.clear();
loadDataFromLocalStorage();
templateDOM();
