import React, { Component, ErrorInfo } from 'react';
import styled from 'styled-components';

interface ComponentProps { }

interface ComponentState {
	hasError: boolean;
	errorInfo?: ErrorInfo;
	message?: string;
}

const StyledBox = styled.div({
	padding: 20,
	borderRadius: 10,
	background: "#FFFFFF11",
});

export class ErrorBoundary extends Component<ComponentProps, ComponentState> {
	state = { hasError: false, errorInfo: undefined, message: undefined };

	constructor(props: ComponentProps) {
		super(props);
		this.state = { hasError: false, errorInfo: undefined, message: undefined };
	}

	static getDerivedStateFromError(error: Error) {
		// Update state so the next render will show the fallback UI.
		return { hasError: true };
	}

	componentDidCatch(error: Error, errorInfo: ErrorInfo) {
		// You can also log the error to an error reporting service
		// TODO: We would hand this off to sentry here.
		console.error(error, errorInfo);

		this.setState({ hasError: true, errorInfo: errorInfo, message: error.message });
	}

	render() {
		return !this.state.hasError ? this.props.children : (
			<StyledBox>
				<p>Jim he's dead!.</p>
				<p>Error:</p>
				{this.state.errorInfo !== undefined ? (
					<pre style={{ wordWrap: 'break-word', whiteSpace: 'pre-wrap', padding: 0, margin: 0 }}>
						{this.state.message}
						{(this.state.errorInfo as unknown as ErrorInfo).componentStack}
					</pre>

				) : undefined}
			</StyledBox>
		);
	}
}