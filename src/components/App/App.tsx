import React from 'react';
import {
	BrowserRouter as Router,
	Switch,
	Route,
	Link
} from "react-router-dom";

import { Headerbar } from '../Headerbar';
import { Stream } from '../Stream';
import { Navigation } from '../Navigation';

export const App: React.FC = () => {
	return (
		<>
			<Headerbar />
			<div className="App">
				<Router>
					<Navigation />
					<div>

						<Switch>
							<Route exact path="/">
								<Stream />
							</Route>
						</Switch>

					</div>
				</Router>
			</div>
		</>
	);
}

