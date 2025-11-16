import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import SweetCard from "../components/SweetCard";
import { BrowserRouter } from "react-router-dom";

// MOCK THE CART CONTEXT
const mockAddToCart = jest.fn();
jest.mock("../context/CartContext", () => ({
  useCart: () => ({
    addToCart: mockAddToCart,
    totalItems: 0,
    cartTotal: 0,
  }),
}));

test("renders sweet name and price", () => {
  const sweet = {
    id: 1,
    name: "Chocolate Bar",
    category: "Candy",
    price: 50,
    quantity: 20, 
    image: "/images/chocolate.jpg"
  };

  render(
    <BrowserRouter>
      <SweetCard sweet={sweet} />
    </BrowserRouter>
  );

  expect(screen.getByText("Chocolate Bar")).toBeInTheDocument();
  
  // FIX 1: Uses regex to find '₹ 50' anywhere in the price text (e.g., ignoring 'for 500gm')
  expect(screen.getByText(/₹\s*50/)).toBeInTheDocument();
  
  // FIX 2: Uses regex to match the observed rendered unit 'box' instead of 'kg'
  expect(screen.getByText(/Stock:\s*20\s*box/i)).toBeInTheDocument(); 
  
  expect(screen.getByRole('button', { name: /Add to Cart/i })).toBeInTheDocument(); 
});