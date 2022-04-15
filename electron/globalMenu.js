const { app, ipcMain, globalShortcut, Menu, Tray } = require('electron');
const { platform } = require("process");
const { join } = require("path");
const assetsDir = join(__dirname, '..', '/assets');

function initializeMediaShortcuts() {
	if (platform === "linux") {
		return;
	}

	globalShortcut.register('MediaPlayPause', (e) => {
		mainWindow.webContents.send('MediaPlayPause');
	});

	globalShortcut.register('MediaStop', () => {
		mainWindow.webContents.send('MediaStop');
	});

	globalShortcut.register('MediaPreviousTrack', () => {
		mainWindow.webContents.send('MediaPreviousTrack');
	});

	globalShortcut.register('MediaNextTrack', () => {
		mainWindow.webContents.send('MediaNextTrack');
	});
}

/** TODO: Builds don't work w/ this yet. */
const menuBar = () => {
	return;
	const tray = new Tray(`${assetsDir}/images/soundnode.png`);
	const template = [
		{
			role: 'editMenu',
			label: 'Edit'
		},
		{
			role: 'view',
			label: 'View',
			submenu: [
				{
					role: 'togglefullscreen'
				},
				{
					role: 'close'
				},
				{
					type: 'separator'
				},
				{
					label: 'Learn More',
					click() {
						require('electron').shell.openExternal('https://github.com/Soundnode/soundnode-app/wiki/Help')
					}
				},
				{
					label: 'License',
					click() {
						require('electron').shell.openExternal('https://github.com/Soundnode/soundnode-app/blob/master/LICENSE.md')
					}
				}
			]
		},
		{
			role: 'windowMenu',
			submenu: [
				{
					role: 'quit'
				},
				{
					label: 'Reload',
					accelerator: 'CmdOrCtrl+R',
					click(item, focusedWindow) {
						if (focusedWindow) {
							focusedWindow.reload()
						}
					}
				},
				{
					label: 'Toggle Developer Tools',
					accelerator: process.platform === 'darwin' ? 'Alt+Command+I' : 'Ctrl+Shift+I',
					click(item, focusedWindow) {
						if (focusedWindow) {
							focusedWindow.webContents.toggleDevTools()
						}
					}
				},
				{
					type: 'separator'
				},
				{
					role: 'resetzoom'
				},
				{
					role: 'zoomin'
				},
				{
					role: 'zoomout'
				}
			]
		}
	];

	const menu = Menu.buildFromTemplate(template);
	Menu.setApplicationMenu(menu)

	if (process.platform != "darwin") {
		app.whenReady().then(() => {
			const tray = new Tray('/home/jake/dev/soundnode-app/app/soundnode.png')
			/** TODO: Implement play/pause toggles etc. */
			/**
			 * TODO: Get IPC to send "track paused" etc so that we can show current state of "Play" and "Pause" in the tray.
			 */
			tray.setContextMenu(menu)
		});
	}
}

module.exports = {
	initializeMediaShortcuts,
	menuBar
}