import React from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { expect, test } from "vitest";
import Navbar from "../components/Navbar.jsx"; // ✅ Ensure correct path
import "@testing-library/jest-dom";

test("renders Outfitly brand in Navbar", () => {
  render(
    <MemoryRouter>
      <Navbar />
    </MemoryRouter>
  );

  expect(screen.getByText(/Home/i)).toBeInTheDocument();
});
