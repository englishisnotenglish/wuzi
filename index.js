const { app, BrowserWindow, globalShortcut } = require("electron");
const path = require("path");

function createWindow() {
  const win = new BrowserWindow({
    width: 1000,
    height: 1000,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });

  win.webContents.openDevTools();
  win.loadFile("index.html");

  const reload = () => {
    win.reload();
  };

  globalShortcut.register("F5", reload);
  win.addEventListener("beforeunload", () => {
    globalShortcut.unregister("F5", reload);
  });
}

app.whenReady().then(() => {
  createWindow();
});
