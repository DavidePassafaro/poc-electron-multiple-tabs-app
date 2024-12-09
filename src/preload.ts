// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

import { ipcRenderer, contextBridge } from "electron";

// Here we expose the ipcRenderer and ipcMain to the window object
// so we can use it in the web app.
// window.electronAPI = {
//   setActiveView: (viewId: string) =>
//     ipcRenderer.send("set-active-view", viewId),
// };

contextBridge.exposeInMainWorld("electronAPI", {
  setActiveView: (viewId: string) =>
    ipcRenderer.send("set-active-view", viewId),
});
