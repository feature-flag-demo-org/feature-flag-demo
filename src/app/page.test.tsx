import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import React from 'react';
import Home from './page';

// Mock the FeatureFlagContext
jest.mock('../context/FeatureFlagContext', () => ({
  FeatureFlagProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  useFeatureFlags: () => ({
    isLoading: false,
    flags: {
      isTestEnabled: false,
    },
    traits: {
      favoriteColor: null,
    },
    identifyUser: jest.fn().mockResolvedValue(undefined),
  }),
}));

describe('App Component', () => {
  it('renders the title correctly', () => {
    render(<Home />);
    const titleElement = screen.getByText(/Pokémon Feature Flag Demo/i);
    expect(titleElement).toBeInTheDocument();
  });
});
