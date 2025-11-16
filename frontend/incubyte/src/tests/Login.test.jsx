import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import Login from "../pages/Login";

// --- Mock Dependencies ---
// 1. Mock the useNavigate hook from react-router-dom
const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

// 2. Mock the AuthContext hook (Navbar dependency)
const mockLogin = jest.fn();
jest.mock("../context/AuthContext", () => ({
  useAuth: () => ({
    login: mockLogin,
    user: null, // Default user state for tests
    logout: jest.fn(),
  }),
}));

// 3. MOCK THE MESSAGECONTEXT HOOK (Login page dependency)
const mockShowMessage = jest.fn();
jest.mock("../context/MessageContext", () => ({
  useMessages: () => ({
    showMessage: mockShowMessage,
  }),
}));

// 4. MOCK THE CARTCONTEXT HOOK (Navbar dependency - CRITICAL FIX)
jest.mock("../context/CartContext", () => ({
  useCart: () => ({
    // totalItems is destructured in Navbar.jsx
    totalItems: 0, 
    addToCart: jest.fn(),
    cartTotal: 0,
    removeFromCart: jest.fn(),
    clearCart: jest.fn(),
  }),
}));
// --- End Mocks ---

// Helper component to provide the necessary router context for the test
const Wrapper = ({ children }) => <BrowserRouter>{children}</BrowserRouter>;

describe('Login Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('1. should render email and password inputs and the login button', () => {
    render(<Login />, { wrapper: Wrapper });
    
    expect(screen.getByPlaceholderText(/Email/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Login/i })).toBeInTheDocument();
  });

  it('2. should navigate to /dashboard on successful login', async () => {
    // Arrange: Mock the login function to return success
    mockLogin.mockResolvedValue({ ok: true });

    render(<Login />, { wrapper: Wrapper });

    // Act: Simulate user input and form submission
    fireEvent.change(screen.getByPlaceholderText(/Email/i), { target: { value: 'test@user.com' } });
    fireEvent.change(screen.getByPlaceholderText(/Password/i), { target: { value: '123' } });
    fireEvent.click(screen.getByRole('button', { name: /Login/i }));

    // Assert
    await waitFor(() => {
      // Check if the mock login function was called with the form data
      expect(mockLogin).toHaveBeenCalledWith({ email: 'test@user.com', password: '123' });
      // Check if the success message was shown
      expect(mockShowMessage).toHaveBeenCalledWith("Successfully logged in!", "success"); 
      // Check if navigation to the dashboard occurred
      expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
    });
  });

  it('3. should display an error message on failed login', async () => {
    // Arrange: Mock the login function to return failure
    mockLogin.mockResolvedValue({ ok: false, message: 'Invalid credentials' });

    render(<Login />, { wrapper: Wrapper });

    // Act: Simulate form submission
    fireEvent.click(screen.getByRole('button', { name: /Login/i }));

    // Assert: Check if the error message is displayed
    await waitFor(() => {
      expect(screen.getByText('Invalid credentials')).toBeInTheDocument();
    });
    // Ensure success message was NOT called
    expect(mockShowMessage).not.toHaveBeenCalled();
  });
});