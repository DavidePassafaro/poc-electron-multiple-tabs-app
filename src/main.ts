import { app, BrowserWindow, WebContentsView } from "electron";
import { ipcMain } from "electron";
import * as path from "path";

const HEADER_HEIGHT = 40;

let win: BrowserWindow;
let frameMenu: WebContentsView;
let activeViewIndex = 1;

const createWindow = () => {
  win = new BrowserWindow({ width: 1200, height: 1000, frame: false });

  win.on("resize", () => {
    if (win) resizeWindowViews();
  });

  frameMenu = new WebContentsView({
    webPreferences: { preload: path.join(__dirname, "preload.js") },
  });
  frameMenu.webContents.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
  win.contentView.addChildView(frameMenu);

  setFrameMenuBounds();

  createNewView();

  // Open the DevTools.
  if (HEADER_HEIGHT > 40) {
    frameMenu.webContents.openDevTools();
  }
};

const setFrameMenuBounds = () => {
  const bounds = win.getBounds();
  frameMenu.setBounds({
    x: 0,
    y: 0,
    width: bounds.width,
    height: HEADER_HEIGHT,
  });
};

const createNewView = (url?: string) => {
  const view = new WebContentsView();

  view.webContents.loadURL(url || "https://www.google.it/").then(() => {
    frameMenu.webContents.send("new-view-created", view.webContents.getTitle());
  });

  win.contentView.addChildView(view);

  const viewIndex = win.contentView.children.length - 1;
  activeViewIndex = viewIndex;

  view.webContents.on("page-title-updated", (_, title) => {
    frameMenu.webContents.send("title-change", viewIndex, title);
  });

  resizeWindowViews();
};

const resizeWindowViews = () => {
  const bounds = win.getBounds();

  win.contentView.children.forEach((view: WebContentsView, index: number) => {
    if (index === 0) {
      setFrameMenuBounds();
      return;
    } else if (index === activeViewIndex) {
      view.setBounds({
        x: 0,
        y: HEADER_HEIGHT,
        width: bounds.width,
        height: bounds.height - HEADER_HEIGHT,
      });
      return;
    }

    view.setBounds({ x: 0, y: 0, width: 0, height: 0 });
  });
};

ipcMain.on("set-active-view", (_: Electron.IpcMainEvent, viewIndex: number) => {
  activeViewIndex = viewIndex;
  resizeWindowViews();
});

ipcMain.on("destroy-view", (_: Electron.IpcMainEvent, viewIndex: number) => {
  win.contentView.removeChildView(win.contentView.children[viewIndex]);

  if (activeViewIndex === viewIndex) {
    const newActiveView = viewIndex - 1 < 1 ? 1 : viewIndex - 1;
    activeViewIndex = newActiveView;
  } else {
    activeViewIndex = viewIndex;
  }

  resizeWindowViews();
});

ipcMain.on(
  "perform-window-action",
  (event: Electron.IpcMainEvent, action: "close" | "minimize" | "maximize") => {
    switch (action) {
      case "close":
        win.close();
        break;
      case "minimize":
        win.minimize();
        break;
      case "maximize":
        if (win.isMaximized()) {
          win.unmaximize();
        } else {
          win.maximize();
        }
        break;
    }
  }
);

ipcMain.on("create-new-view", (event: Electron.IpcMainEvent, url: string) => {
  createNewView(url);
});

app.on("ready", createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
