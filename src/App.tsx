import Dashboard from './components/ui/dashboard/Dashboard';
import React from 'react';
import ConfigurationService from './services/configuration/ConfigurationService';

class App extends React.Component {
  componentDidMount(): void {
    ConfigurationService.initialize();
  }

  render(): JSX.Element {
    return (
      <div>
        <Dashboard />
      </div>
    );
  }
}

export default App;
