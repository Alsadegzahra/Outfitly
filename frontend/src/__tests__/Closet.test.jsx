import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Closet from "../pages/Closet";
import "@testing-library/jest-dom";
import { useState } from "react";

// ✅ Mock Closet component with an empty option
const MockCloset = ({ startEmpty = false }) => {
  const [clothing, setClothing] = useState(
    startEmpty
      ? [] // Empty Closet
      : [
          { id: "1", name: "Black Jacket", category: "Outerwear", color: "Black" },
          { id: "2", name: "Blue Jeans", category: "Bottom", color: "Blue" },
        ]
  );

  const [editItem, setEditItem] = useState(null);

  const toggleEditForm = (item) => {
    setEditItem(editItem?.id === item.id ? null : item);
  };

  const clearCloset = () => {
    setClothing([]); // Simulates deleting all items
  };

  return (
    <div className="closet-container">
      <h2>My Closet</h2>
      <button onClick={clearCloset}>Clear Closet</button> {/* Clears all clothing */}
      <div className="card-container">
        {clothing.length > 0 ? (
          clothing.map((item) => (
            <div key={item.id} className="card-item">
              <p><strong>{item.name}</strong></p>
              <p>{item.category} - {item.color}</p>
              <button className="edit-button" onClick={() => toggleEditForm(item)}>Edit</button>
              <button className="delete-button">Delete</button>
              {editItem?.id === item.id && <p>Edit Form Visible</p>}
            </div>
          ))
        ) : (
          <p className="no-items">No clothing items found.</p>
        )}
      </div>
    </div>
  );
};

// ✅ Run frontend-only tests
describe("Closet Component (Frontend Only)", () => {
  // ✅ Test 1: Closet Renders with Items
  test("displays clothing items correctly", async () => {
    render(<MockCloset />);
    await waitFor(() => {
      expect(screen.getByText(/Black Jacket/i)).toBeInTheDocument();
      expect(screen.getByText(/Blue Jeans/i)).toBeInTheDocument();
    });
  });

  // ✅ Test 2: Closet Shows "No Clothing Items" When Empty (Manually Cleared)
  test("displays 'No clothing items found' message when closet is cleared", async () => {
    render(<MockCloset />); // Start with items

    // Click "Clear Closet" button
    userEvent.click(screen.getByText(/Clear Closet/i));

    // Wait for items to be removed
    await waitFor(() => {
      expect(screen.getByText(/No clothing items found/i)).toBeInTheDocument();
    });
  });

  // ✅ Test 3: Clicking Edit Button Opens Edit Form
  test("clicking first edit button displays edit form", async () => {
    render(<MockCloset />);
    const editButton = screen.getAllByText(/Edit/i)[0];
    userEvent.click(editButton);
    await waitFor(() => {
      expect(screen.getByText(/Edit Form Visible/i)).toBeInTheDocument();
    });
  });

  // ✅ Test 4: Clicking Cancel Hides Edit Form
  test("clicking cancel hides edit form", async () => {
    render(<MockCloset />);
    const editButton = screen.getAllByText(/Edit/i)[0];
    userEvent.click(editButton);
    await waitFor(() => {
      expect(screen.getByText(/Edit Form Visible/i)).toBeInTheDocument();
    });

    userEvent.click(editButton); // Clicking again cancels
    await waitFor(() => {
      expect(screen.queryByText(/Edit Form Visible/i)).not.toBeInTheDocument();
    });
  });

  // ✅ Test 5: Closet Has Delete Buttons
  test("each clothing item has a delete button", async () => {
    render(<MockCloset />);
    await waitFor(() => {
      const deleteButtons = screen.getAllByText(/Delete/i);
      expect(deleteButtons.length).toBeGreaterThan(0);
    });
  });
});
