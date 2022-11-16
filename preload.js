const { contextBridge, ipcRenderer } = require("electron");

console.log(ipcRenderer);

const handleSent = () => {
  ipcRenderer.invoke("send-event", "ping");
};

contextBridge.exposeInMainWorld =
  ("myAPI",
  {
    platform: process.platform,
  });
