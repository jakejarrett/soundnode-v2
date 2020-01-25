import { CSSObject } from "styled-components";

export const common: CSSObject = {
    display: 'flex',
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
    fontWeight: 'bold',
    cursor: 'pointer',
    borderRadius: '100%',
    letterSpacing: 0,
    width: '15px',
    height: '15px',

    '& > svg': {
        transform: 'scale(0.8)',
    }
};