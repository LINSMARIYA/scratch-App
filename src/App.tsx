import React, { StrictMode } from 'react';
import './App.css';
import MainArea from './containers/mainArea';
import ErrorBoundary from './errorBoundary';

function App() {
	return (
		<StrictMode>
			<div className="App">
				<ErrorBoundary>
					<MainArea />
				</ErrorBoundary>
			</div>
		</StrictMode>
	);
}

export default App;
