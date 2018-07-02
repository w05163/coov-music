import { createMuiTheme } from '@material-ui/core/styles';

export const palette = {
	primary: {
    light: '#ff7961',
		main: '#f44336',
		dark: '#ba000d',
		contrastText: '#fafafa',
	},
	secondary: {
		light: '#718792',
		main: '#455a64',
		dark: '#1c313a',
		contrastText: '#fff',
	}
};

const theme = createMuiTheme({ palette });

export default theme;
