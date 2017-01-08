const Electron = require("electron");
const app = Electron.app;  // Module to control application life.
const ipc = Electron.ipcMain;
const BrowserWindow = Electron.BrowserWindow;  // Module to create native browser window.
const Menu = Electron.Menu;
const Hexo = require("hexo");

let Markdown = require("./services/markdown");
let path = "/Users/geminiwen/Code/github/blog";

let hexo = new Hexo(path, {});

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the javascript object is GCed.
let mainWindow = null;

//menu
let menuTemplate = [
    {
        label: "GM Editor",
        submenu: [
            {
                label: "About GM Editor"
            },
            {
                type: 'separator'
            },
            {
                label: "Hide All",
                accelerator: 'CommandOrControl+H',
                selector: 'hide:'
            },
            {
                label: 'Show All',
                selector: 'unhideAllApplications:'
            },
            {
                type: 'separator'
            },
            {
                label: 'Quit',
                accelerator: 'Command+Q',
                click: function() { app.quit(); }
            }
        ]
    },
    {
        label: "File",
        submenu: [
            {
                label: "Save",
                accelerator: 'CommandOrControl+S',
                click: function () {
                    mainWindow.webContents.send("saveFileRequest");
                }
            },
            {
                label: "Open..",
                accelerator: 'CommandOrControl+O',
                click: function () {
                    var homeDirectory = process.env.HOME || process.env.HOMEPATH || process.env.USERPROFILE;
                    var defaultPath =  path.join(homeDirectory, "Documents");
                    dialog.showOpenDialog(
                        mainWindow,
                        {
                            title: "Select File To Open",
                            defaultPath: defaultPath,
                            properties: ["openFile"],
                            filters: [
                                {
                                    name: "Markdown file",
                                    extensions: ["md", "markdown"]
                                }
                            ]
                        },
                        function (files) {
                            if (!files) {
                                return;
                            }
                            fs.readFile(files[0], {"encoding": "utf-8"}, function (err, data) {
                                if (err) {
                                    console.error(err);
                                    return;
                                }
                                mainWindow.webContents.send("openFile", data);
                            });
                        }
                    );
                    mainWindow.webContents.send("saveFileRequest");
                }
            }
        ]
    },
    {
        label: "Edit",
        submenu: [

            {
                label: 'Undo',
                accelerator: 'CommandOrControl+Z',
                selector: 'undo:'
            },
            {
                label: 'Redo',
                accelerator: 'Shift+CommandOrControl+Z',
                selector: 'redo:'
            },
            {
                type: 'separator'
            },
            {
                label: 'Cut',
                accelerator: 'CommandOrControl+X',
                selector: 'cut:'
            },
            {
                label: 'Copy',
                accelerator: 'CommandOrControl+C',
                selector: 'copy:'
            },
            {
                label: 'Paste',
                accelerator: 'CommandOrControl+V',
                selector: 'paste:'
            },
            {
                label: 'Select All',
                accelerator: 'CommandOrControl+A',
                selector: 'selectAll:'
            }
        ]
    },
    {
        label: "Development",
        submenu: [
            {
                label: 'Toggle DevTools',
                accelerator: 'Alt+CommandOrControl+I',
                click: function() { BrowserWindow.getFocusedWindow().toggleDevTools(); }
            }
        ]
    }
];
let menu = Menu.buildFromTemplate(menuTemplate);


// Quit when all windows are closed.
app.on('window-all-closed', function() {
    if (process.platform != 'darwin')
        app.quit();
});

app.on('ready', function() {
    mainWindow = new BrowserWindow({width: 1024, height: 768});

    mainWindow.loadURL('file://' + __dirname + '/index.html');

    mainWindow.on('closed', function() {
        mainWindow = null;
    });

    Menu.setApplicationMenu(menu); // Must be called within app.on('ready', function(){ ... });
    new Markdown(mainWindow, hexo);
});


app.on('window-all-closed', function() {
    app.quit();
});

app.on("activate-with-no-open-windows", function () {
    mainWindow.show();
});

ipc.on("window", function (event, arg) {
    if (arg == "close") {
        mainWindow.hide();
    } else if (arg == "maxium") {
        mainWindow.maximize();
    } else if (arg == "minus") {
        mainWindow.minimize();
    }
});




