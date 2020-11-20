const pad = (n: number) => (n < 10) ? ("0" + n) : n;

export const secondsToTime = (seconds: number) => {
	let mins = Math.floor(seconds / 60);
	let secs = Math.floor(seconds) - mins * 60;
	if (isNaN(mins)) mins = 0;
	if (isNaN(secs)) secs = 0;
	const realmin = mins % 60;
	const hours = Math.floor(mins / 60);
	let hour = '';


	if (hours !== 0) {
		hour = `${pad(hours)}:`;
	}

	return {
		hour,
		mins,
		secs,
		rendered: `${hour}${pad(realmin)}:${(secs > 9 ? secs : '0' + secs)}`,
		playlistRender: `${hour !== '0' ? `${pad(hours)} hr` : ''} ${realmin} min`
	}
};