import React from "react";
import { render, screen } from "@testing-library/react";
import { expect, test } from "vitest"; // ✅ Import Vitest's `expect`
import Button from "../components/Button.jsx";
import "@testing-library/jest-dom";

test("renders button with correct label", () => {
  render(<Button label="Click Me" />);
  expect(screen.getByText(/Click Me/i)).toBeInTheDocument();
});
