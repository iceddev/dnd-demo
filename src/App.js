import React, { Component } from 'react';
import './App.css';
import Workspace from './components/Workspace';
import uuidv4 from 'uuid/v4';

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

if(window.experimental) {
  const { experimental } = window;
  console.log(window.experimental);
  experimental.datPeers.setSessionData({name: uuidv4()}).then((p) =>{ 
    console.log('set session data', p);
  });
  experimental.datPeers.addEventListener('message', ({peer, message}) => {
    console.log(peer, 'has sent the following message:', message)
  });
  experimental.datPeers.addEventListener('connect', ({peer}) => {
    console.log(peer, 'has connected');
  });
  experimental.datPeers.addEventListener('session-data', ({peer}) => {
    console.log(peer, 'has set their session data to', peer.sessionData)
  });
  experimental.datPeers.broadcast({message: 'waddup!!!!', id: uuidv4()});
  experimental.datPeers.addEventListener('disconnect', ({peer}) => {
    console.log(peer, 'has disconnected')
  });
} else {
  console.log('experimental api not enabled');
}

export default App;
