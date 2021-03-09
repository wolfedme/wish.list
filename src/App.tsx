import React from 'react';
import Dashboard from './components/ui/dashboard/Dashboard';
import ConfigurationService from './services/configuration/ConfigurationService';
import FirebaseService from './services/firebase/FirebaseService';

class App extends React.Component {
  firebaseService = FirebaseService;

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
