import React from 'react';
import styled from "styled-components";
import { ipcRenderer, remote } from 'electron';
import { Close } from './Close';
import { Minimize } from './Minimize';
import { Maximize } from './Maximize';

import { IoIosClose, IoIosRemove, IoIosExpand, IoIosContract } from 'react-icons/io';

const Wrapper = styled.div({
	display: 'flex',
	justifyContent: 'space-between',
	alignItems: 'center',
	width: '70px',
	height: '100%',
	marginLeft: '20px',
	'-webkit-app-region': 'no-drag',
});



interface ComponentProps { }

const onClick = (action: 'close' | 'minimize' | 'maximize' = 'close') => ipcRenderer.send('window-action-clicked', { action });

interface Colors {
	close: 'transparent' | '#4d0000';
	minimize: 'transparent' | '#995700';
	maximize: 'transparent' | '#006500';
}

const defaultState: Colors = Object.freeze({ close: 'transparent', minimize: 'transparent', maximize: 'transparent' });

export const WindowActions: React.FC<ComponentProps> = () => {
	const [color, setColor] = React.useState<Colors>(defaultState);
	const [maximized, setMaximized] = React.useState<boolean>(false);
	const mouseIn = () => {
		setColor({
			close: '#4d0000',
			maximize: "#006500",
			minimize: "#995700",
		});
	};

	const mouseOut = () => setColor(defaultState);

	React.useEffect(() => {
		const handleMaximizeChange = (event: Electron.IpcRendererEvent, isMaximized: boolean) => setMaximized(isMaximized);
		ipcRenderer.on('maximize-change', handleMaximizeChange);

		return () => {
			ipcRenderer.removeListener('maximize-change', handleMaximizeChange)
		}
	}, [maximized]);

	return (
		<Wrapper onMouseOver={mouseIn} onMouseOut={mouseOut}>
			<Close onClick={() => onClick('close')}>
				<IoIosClose color={color.close} size={"0.9em"} />
			</Close>

			<Minimize onClick={() => onClick('minimize')}>
				<IoIosRemove color={color.minimize} size={"0.9em"} />
			</Minimize>

			<Maximize onClick={() => onClick('maximize')}>
				{maximized ? (<IoIosContract color={color.maximize} size={"0.9em"} />) : (<IoIosExpand color={color.maximize} size={"1em"} />)}
			</Maximize>
		</Wrapper>
	);
};