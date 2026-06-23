"use client";

import { Component, type ErrorInfo, type ReactNode } from 'react';

type Props = { children: ReactNode };
type State = { failed: boolean };

export default class SceneErrorBoundary extends Component<Props, State> {
  state: State = { failed: false };

  static getDerivedStateFromError(): State {
    return { failed: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('Campus 3D scene failed; using the static fallback.', error, info.componentStack);
  }

  render() {
    if (this.state.failed) {
      return <div className="scene-fallback-message">Interactive campus view unavailable</div>;
    }
    return this.props.children;
  }
}
