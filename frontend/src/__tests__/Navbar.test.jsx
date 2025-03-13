import React from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { expect, test } from "vitest";
import Navbar from "../components/Navbar.jsx";
import "@testing-library/jest-dom";

/**
 * Tests that the Navbar renders the logo with the correct alt text.
 */
test("renders logo with correct alt text", () => {
  render(
    <MemoryRouter>
      <Navbar />
    </MemoryRouter>
  );
  expect(screen.getByAltText(/Outfitly Logo/i)).toBeInTheDocument();
});

/**
 * Tests that the Navbar renders the Home button.
 */
test("renders Home button", () => {
  render(
    <MemoryRouter>
      <Navbar />
    </MemoryRouter>
  );
  expect(screen.getByRole("button", { name: /Home/i })).toBeInTheDocument();
});

/**
 * Tests that the Navbar renders the Closet button.
 */
test("renders Closet button", () => {
  render(
    <MemoryRouter>
      <Navbar />
    </MemoryRouter>
  );
  expect(screen.getByRole("button", { name: /Closet/i })).toBeInTheDocument();
});

/**
 * Tests that the Navbar renders the Log Out button.
 * Uses getAllByRole to filter out any buttons that do not exactly match "Log Out".
 */
test("renders Log Out button", () => {
  render(
    <MemoryRouter>
      <Navbar />
    </MemoryRouter>
  );
  const logOutButtons = screen.getAllByRole("button", { name: /Log Out/i });
  const logOutButton = logOutButtons.find(
    (btn) => btn.textContent.trim() === "Log Out"
  );
  expect(logOutButton).toBeInTheDocument();
});

/**
 * Snapshot test for the Navbar component.
 */
test("matches Navbar snapshot", () => {
  const { container } = render(
    <MemoryRouter>
      <Navbar />
    </MemoryRouter>
  );
  expect(container).toMatchSnapshot();
});
