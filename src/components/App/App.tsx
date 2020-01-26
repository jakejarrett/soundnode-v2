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
				<Navigation />
				<div>
					<Router>
						<Switch>
							<Route exact path="/stream">
								<Stream />
							</Route>
							<Route exact path="/">
								<Link to="/stream">Hello</Link>
							</Route>

						</Switch>

					</Router>
				</div>
			</div>
		</>
	);
}

