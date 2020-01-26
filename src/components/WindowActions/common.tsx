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
    width: '14px',
    height: '14px',

    '& > svg': {
        transform: 'scale(0.7)',
    }
};