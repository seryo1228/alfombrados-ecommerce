"use client";

import { AppProgressBar } from "next-nprogress-bar";

export function ProgressBar() {
  return (
    <AppProgressBar
      height="3px"
      color="#2b5aa9"
      options={{ showSpinner: false }}
      shallowRouting
    />
  );
}
