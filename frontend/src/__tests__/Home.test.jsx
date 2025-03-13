import React from "react";
import { render, screen } from "@testing-library/react";
import { expect, test } from "vitest";
import Home from "../pages/Home.jsx";
import "@testing-library/jest-dom";

/**
 * Test that the Home page renders the welcome message.
 */
test("renders home page with welcome message", () => {
  render(<Home />);
  expect(screen.getByText(/Welcome to Outfitly/i)).toBeInTheDocument();
});

/**
 * Test that the Home page renders the "Most Recent Outfit" heading.
 */
test("renders Most Recent Outfit heading", () => {
  render(<Home />);
  expect(screen.getByText(/Most Recent Outfit/i)).toBeInTheDocument();
});

/**
 * Test that the Home page renders the "Recently Added Clothing" heading.
 */
test("renders Recently Added Clothing heading", () => {
  render(<Home />);
  expect(screen.getByText(/Recently Added Clothing/i)).toBeInTheDocument();
});

/**
 * Test that the Home page renders both the "Most Worn Item" and "Least Worn Item" headings.
 */
test("renders Most Worn Item and Least Worn Item headings", () => {
  render(<Home />);
  expect(screen.getByText(/Most Worn Item/i)).toBeInTheDocument();
  expect(screen.getByText(/Least Worn Item/i)).toBeInTheDocument();
});

/**
 * Snapshot test for the Home page.
 */
test("matches Home page snapshot", () => {
  const { container } = render(<Home />);
  expect(container).toMatchSnapshot();
});
