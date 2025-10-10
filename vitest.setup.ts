import "@testing-library/jest-dom";
import React from "react";

// Make React globally available in tests
(globalThis as typeof globalThis & { React: typeof React }).React = React;
