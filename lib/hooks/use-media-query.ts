"use client";

import * as React from "react";

/**
 * Returns false on the server and on the first client render, then the real
 * result after mount. Callers get a layout that is identical across
 * hydration, at the cost of one post-mount update.
 */
export function useMediaQuery(query: string) {
  const [matches, setMatches] = React.useState(false);

  React.useEffect(() => {
    const list = window.matchMedia(query);
    setMatches(list.matches);
    const onChange = (event: MediaQueryListEvent) => setMatches(event.matches);
    list.addEventListener("change", onChange);
    return () => list.removeEventListener("change", onChange);
  }, [query]);

  return matches;
}
