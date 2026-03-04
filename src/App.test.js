import { render, screen } from '@testing-library/react';
import App from './App';

jest.mock('./FirebaseService', () => ({
    firebaseService: {
        useState: () => false,
        signIn: jest.fn(),
    }
}));

test('renders sign in button when not authenticated', () => {
    render(<App />);
    const signInButton = screen.getByText(/sign in with google/i);
    expect(signInButton).toBeInTheDocument();
});
