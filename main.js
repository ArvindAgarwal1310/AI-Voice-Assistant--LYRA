const { app, BrowserWindow,ipcMain  } = require('electron');
const path = require('path');
const url = require('url');
const { exec } = require('child_process');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true,
    }
  });

  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes: true
  }));


  ipcMain.on('run-python-script', (event, scriptPath) => {
    // Replace 'python' with the actual command to run Python on your system if needed
    exec(`python ${scriptPath}`, (error, stdout, stderr) => {
        console.log("In it 2");
        if (error) {
            console.error('Error executing Python script:', error);
            event.reply('python-script-result', { success: false, output: error.message });
      } else {
            console.log('Python script executed successfully:', stdout);
            event.reply('python-script-result', { success: true, output: stdout });
      }
    });
  });
  ipcMain.on('run-python-script', (event, scriptPath) => {
    // ... (previous code for running Python script)
  
    // Send the result of the Python script execution back to the renderer process
    ipcMain.on('python-script-result', (event, result) => {
        mainWindow.webContents.send('python-script-result', result);
    });
  });
  





  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});
