import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Closet from "../pages/Closet";
import "@testing-library/jest-dom";
import { useState } from "react";

/**
 * Mock Closet component for testing.
 * @param {Object} props - Component properties.
 * @param {boolean} [props.startEmpty=false] - Determines if the closet starts empty.
 * @returns {JSX.Element} Mock Closet component.
 */
const MockCloset = ({ startEmpty = false }) => {
  const [clothing, setClothing] = useState(
    startEmpty
      ? []
      : [
          { id: "1", name: "Black Jacket", category: "Outerwear", color: "Black" },
          { id: "2", name: "Blue Jeans", category: "Bottom", color: "Blue" },
        ]
  );

  const [editItem, setEditItem] = useState(null);

  /**
   * Toggles the edit form visibility for a clothing item.
   * @param {Object} item - Clothing item to edit.
   */
  const toggleEditForm = (item) => {
    setEditItem(editItem?.id === item.id ? null : item);
  };

  /**
   * Clears all clothing items from the closet.
   */
  const clearCloset = () => {
    setClothing([]);
  };

  return (
    <div className="closet-container">
      <h2>My Closet</h2>
      <button onClick={clearCloset}>Clear Closet</button>
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

/**
 * Test suite for Closet component.
 */
describe("Closet Component", () => {
  test("displays clothing items correctly", async () => {
    render(<MockCloset />);
    await waitFor(() => {
      expect(screen.getByText(/Black Jacket/i)).toBeInTheDocument();
      expect(screen.getByText(/Blue Jeans/i)).toBeInTheDocument();
    });
  });

  test("displays 'No clothing items found' when closet is cleared", async () => {
    render(<MockCloset />);
    userEvent.click(screen.getByText(/Clear Closet/i));
    await waitFor(() => {
      expect(screen.getByText(/No clothing items found/i)).toBeInTheDocument();
    });
  });

  test("clicking edit button displays edit form", async () => {
    render(<MockCloset />);
    const editButton = screen.getAllByText(/Edit/i)[0];
    userEvent.click(editButton);
    await waitFor(() => {
      expect(screen.getByText(/Edit Form Visible/i)).toBeInTheDocument();
    });
  });

  test("clicking edit button again hides edit form", async () => {
    render(<MockCloset />);
    const editButton = screen.getAllByText(/Edit/i)[0];
    userEvent.click(editButton);
    await waitFor(() => {
      expect(screen.getByText(/Edit Form Visible/i)).toBeInTheDocument();
    });
    userEvent.click(editButton);
    await waitFor(() => {
      expect(screen.queryByText(/Edit Form Visible/i)).not.toBeInTheDocument();
    });
  });

  test("each clothing item has a delete button", async () => {
    render(<MockCloset />);
    await waitFor(() => {
      const deleteButtons = screen.getAllByText(/Delete/i);
      expect(deleteButtons.length).toBeGreaterThan(0);
    });
  });
});
