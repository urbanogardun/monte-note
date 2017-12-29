"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = require("../../utils/constants");
const index_1 = require("../../store/index");
const actions = require("../../actions/");
let ipcRenderer;
// Electron's methods are not available outside of electron itself. When we're
// running unit tests and are accessing our application through the web browser
// we'll get an error thrown: window.require is not a function - this try/catch
// suppresses that.
function ipcRendererEventsBootstrap() {
    try {
        ipcRenderer = window.require('electron').ipcRenderer;
        ipcRenderer.on('start-it!', (event, arg) => {
            if (arg) {
                return true;
            }
            else {
                return false;
            }
        });
        ipcRenderer.on('location-for-notebooks', (event, arg) => {
            if (arg) {
                index_1.default.dispatch(actions.setNotebooksLocation(arg));
                localStorage.setItem(constants_1.NOTEBOOK_SAVE_DIRECTORY, arg);
            }
        });
        ipcRenderer.on(constants_1.GET_NOTEBOOKS, (event, arg) => {
            console.log(arg);
            if (arg) {
                index_1.default.dispatch(actions.getNotebooks(arg));
            }
        });
    }
    catch (error) {
        ipcRenderer = {};
    }
    finally {
        return ipcRenderer;
    }
}
exports.ipcRendererEventsBootstrap = ipcRendererEventsBootstrap;
