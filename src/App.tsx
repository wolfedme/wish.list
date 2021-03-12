import Dashboard from './components/ui/dashboard/Dashboard';
import React from 'react';
import ConfigurationService from './services/configuration/ConfigurationService';
import { CssBaseline, withTheme } from '@material-ui/core';
import { ThemeProvider } from '@material-ui/core';

import { createMuiTheme } from '@material-ui/core/styles';

class App extends React.Component {
  render(): JSX.Element {
    const theme = createMuiTheme();

    return (
      <React.Fragment>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Dashboard />
        </ThemeProvider>
      </React.Fragment>
    );
  }
}

export default withTheme(App);
