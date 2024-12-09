import { app, BrowserWindow, WebContentsView } from "electron";
import started from "electron-squirrel-startup";
import { ipcMain } from "electron";
import * as path from "path";

const HEADER_HEIGHT = 40;

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (started) {
  app.quit();
}

let win: BrowserWindow;
let view2: WebContentsView;
let view3: WebContentsView;

const createWindow = () => {
  win = new BrowserWindow({ width: 1800, height: 1200, frame: false });

  const bounds = win.getBounds();

  const view1 = new WebContentsView({
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });
  view1.webContents.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
  view1.setBounds({ x: 0, y: 0, width: bounds.width, height: HEADER_HEIGHT });
  win.contentView.addChildView(view1);

  view2 = new WebContentsView();
  view2.webContents.loadURL("https://develop.cwork.io/my/dashboard");
  view2.setBounds({
    x: 0,
    y: HEADER_HEIGHT,
    width: bounds.width,
    height: bounds.height - HEADER_HEIGHT,
  });
  win.contentView.addChildView(view2);

  view3 = new WebContentsView();
  view3.webContents.loadURL("https://www.google.it/");
  view3.setBounds({ x: 0, y: 0, width: 0, height: 0 });
  win.contentView.addChildView(view3);

  win.on("resize", () => {
    if (!win) {
      return;
    }

    const bounds = win.getBounds();

    view1.setBounds({
      x: 0,
      y: 0,
      width: bounds.width,
      height: HEADER_HEIGHT,
    });

    view2.setBounds({
      x: 0,
      y: HEADER_HEIGHT,
      width: bounds.width,
      height: bounds.height - HEADER_HEIGHT,
    });
  });

  // Open the DevTools.
  view3.webContents.openDevTools();
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", createWindow);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

ipcMain.on(
  "set-active-view",
  (event: Electron.IpcMainEvent, viewId: string) => {
    const bounds = win.getBounds();

    const isView1 = viewId === "view1";
    if (isView1) {
      view2.setBounds({
        x: 0,
        y: HEADER_HEIGHT,
        width: bounds.width,
        height: bounds.height - HEADER_HEIGHT,
      });
      view3.setBounds({ x: 0, y: 0, width: 0, height: 0 });
    } else {
      view2.setBounds({ x: 0, y: 0, width: 0, height: 0 });
      view3.setBounds({
        x: 0,
        y: HEADER_HEIGHT,
        width: bounds.width,
        height: bounds.height - HEADER_HEIGHT,
      });
    }
  }
);

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
