const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  sendIPCMessage: (channel, data) => {
    ipcRenderer.send(channel, data);
  },
  receiveIPCMessage: (channel, listener) => {
    ipcRenderer.on(channel, (event, ...args) => listener(...args));
  }
});
