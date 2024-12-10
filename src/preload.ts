// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

import { ipcRenderer, contextBridge } from "electron";

contextBridge.exposeInMainWorld("electronAPI", {
  setActiveView: (viewIndex: string) =>
    ipcRenderer.send("set-active-view", viewIndex),
  createNewView: (url?: string) => ipcRenderer.send("create-new-view", url),
  performWindowAction: (action: "close" | "minimize" | "maximize") =>
    ipcRenderer.send("perform-window-action", action),

  onTitleChange: (callback: CallableFunction) =>
    ipcRenderer.on("title-change", (_, ...args) => callback(...args)),
  onNewViewCreated: (callback: CallableFunction) =>
    ipcRenderer.on("new-view-created", (_, ...args) => callback(...args)),
});
