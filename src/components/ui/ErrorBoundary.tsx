"use client";

import { Component, type ReactNode } from "react";

type Props = {
  children: ReactNode;
  /** Rendered when the wrapped subtree throws. Defaults to nothing. */
  fallback?: ReactNode;
};

type State = { hasError: boolean };

/**
 * Isolates failures in non-critical subtrees (e.g. the WebGL hero scene) so a
 * thrown error there can't abort hydration of the whole page.
 */
export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch() {
    // Swallow: the boundary only protects decorative content.
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback ?? null;
    }
    return this.props.children;
  }
}
