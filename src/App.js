import React, { Component } from 'react';
import './App.css';
import Workspace from './components/Workspace';

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <Workspace/>
        </header>
      </div>
    );
  }
}

export default App;
