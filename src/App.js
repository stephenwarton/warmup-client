import React, { Component } from 'react';
import './App.css';
import Navbar from './components/Navbar';
import Reviews from './components/Reviews';

class App extends Component {
  // constructor(props) {
  //   super(props);
  // }

  render() {
    return (
      <div className="App">
        <Navbar />
        <Reviews />
      </div>
    );
  }
}

export default App;
