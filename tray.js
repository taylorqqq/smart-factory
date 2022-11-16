const { Tray, nativeImage } = require("electron");
const path = require("path");
const iconSrc = path.join(__dirname, "icon.png");
const trayIcon = nativeImage.createFromPath(iconSrc);

function createTray(app, win) {
  const tray = new Tray(trayIcon);
  tray.setToolTip("孔洞仪");
  tray.on("click", (e) => {
    if (e.shiftKey) {
      app.quit();
    }
  });
}

module.exports = createTray;
