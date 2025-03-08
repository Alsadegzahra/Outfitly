import React from "react";
import { render, screen } from "@testing-library/react";
import { expect, test } from "vitest";
import Home from "../pages/Home.jsx"; // ✅ Ensure correct path
import "@testing-library/jest-dom";

test("renders home page with welcome message", () => {
  render(<Home />);
  expect(screen.getByText(/Welcome to Outfitly/i)).toBeInTheDocument();
});
