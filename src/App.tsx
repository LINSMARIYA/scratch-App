import React from 'react';
import './App.css';
import MainArea from './containers/mainArea';
import ErrorBoundary from './errorBoundary';

function App() {
  return (
    <div className="App">
      <ErrorBoundary>
    <MainArea/>
    </ErrorBoundary>
    </div>
  );
}

export default App;
