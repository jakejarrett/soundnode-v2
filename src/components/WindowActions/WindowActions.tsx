import React from 'react';
import styled, { CSSObject } from "styled-components";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faMinus, faPlus } from '@fortawesome/free-solid-svg-icons';
import { ipcRenderer } from 'electron';
import { Close } from './Close';
import { Minimize } from './Minimize';
import { Maximize } from './Maximize';

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

const close = () => ipcRenderer.send('windowActionClicked', { action: 'close' });

interface Colors {
	close: 'transparent' | '#4d0000';
	minimize: 'transparent' | '#995700';
	maximize: 'transparent' | '#006500';
}

const defaultState: Colors = { close: 'transparent', minimize: 'transparent', maximize: 'transparent' };

export const WindowActions: React.FC<ComponentProps> = () => {
	const [color, setColor] = React.useState<Colors>(defaultState);
	const mouseIn = () => {
		setColor({
			close: '#4d0000',
			maximize: "#006500",
			minimize: "#995700",
		})
	};

	const mouseOut = () => setColor(defaultState);

	return <Wrapper onMouseOver={mouseIn} onMouseOut={mouseOut}>
		<Close onClick={close}>
			<FontAwesomeIcon icon={faTimes} color={color.close} size={"xs"} />
		</Close>

		<Minimize onClick={close}>
			<FontAwesomeIcon icon={faMinus} color={color.minimize} size={"xs"} />
		</Minimize>

		<Maximize onClick={close}>
			<FontAwesomeIcon icon={faPlus} color={color.maximize} size={"xs"} />
		</Maximize>
	</Wrapper>
};