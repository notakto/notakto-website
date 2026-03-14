"use client";

import { Component, type ReactNode } from "react";

interface Props {
	children: ReactNode;
	fallback?: ReactNode;
}

interface State {
	hasError: boolean;
	error: Error | null;
}

export class QueryErrorBoundary extends Component<Props, State> {
	constructor(props: Props) {
		super(props);
		this.state = { hasError: false, error: null };
	}

	static getDerivedStateFromError(error: Error): State {
		return { hasError: true, error };
	}

	componentDidCatch(error: Error) {
		console.error("QueryErrorBoundary caught:", error);
	}

	render() {
		if (this.state.hasError) {
			if (this.props.fallback) return this.props.fallback;

			return (
				<div className="flex flex-col items-center justify-center gap-4 p-8">
					<p className="text-red-500 text-xl">Something went wrong.</p>
					<p className="text-sm opacity-70">{this.state.error?.message}</p>
					<button
						type="button"
						onClick={() => this.setState({ hasError: false, error: null })}
						className="px-4 py-2 border border-white text-white hover:bg-white hover:text-black transition-colors">
						Try Again
					</button>
				</div>
			);
		}

		return this.props.children;
	}
}
