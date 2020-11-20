const { ipcMain, globalShortcut, Menu } = require('electron');

function initializeMediaShortcuts() {
	globalShortcut.register('MediaPlayPause', () => {
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

const menuBar = () => {
	const template = [
		{
			role: 'editMenu',
			label: 'Soundnode'
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
}

module.exports = {
	initializeMediaShortcuts,
	menuBar
}