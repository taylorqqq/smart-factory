const { app, BrowserWindow, ipcMain } = require("electron");
const winState = require("electron-win-state").default;
const path = require("path");
const createTray = require("./tray");

const createWindow = () => {
  const state = new winState({
    defaultWidth: 1280,
    defaultHeight: 800,
    //全屏
  });
  const win = new BrowserWindow({
    show: false,
    ...state.winOptions,
    // width: 1280,
    // height: 800,
    fullscreen: true,
    // //最大化
    fullscreenable: true,
    //最小化
    minimizable: true,
    //最大化
    maximizable: true,
    //关闭
    closable: true,
    //是否显示边框
    frame: true,

    webPreferences: {
      // nodeIntegration: true, // 集成node
      // contextIsolation: false, // 隔离上下文
      preload: path.resolve(__dirname, "./preload.js"), // 预加载脚本
    },
  });

  createTray(app, win);

  // 读取本地文件
  // win.loadFile("index.html"); // 错误
  win.loadURL("http://localhost:5173/");

  // 临时打开一个控制台
  // win.webContents.openDevTools();

  // 暂时关闭安全警告
  // process.env.ELECTRON_DISABLE_SECURITY_WARNINGS = true;

  state.manage(win);
  win.on("ready-to-show", () => {
    // 窗口准备好了
    win.show();
  });
};

app.whenReady().then(() => {
  createWindow();

  // 激活时创建窗口
  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

// 所有窗口关闭时退出
app.on("window-all-closed", () => {
  if (process.platform === "darwin") {
    // macos
    app.quit();
  }
});

ipcMain.handle("send-event ", (event, arg) => {
  console.log(arg); // prints "ping"
  return "pong";
});
