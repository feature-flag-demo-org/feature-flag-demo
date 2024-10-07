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
      isReady: true,
    },
    traits: {
      user_group: 'internal',
    },
    identifyUser: jest.fn().mockResolvedValue(undefined),
  }),
}));

describe('App Component', () => {
  it('renders the title correctly', async () => {
    render(<Home />);
    const titleElement = await screen.findByText(/Pokémon Hub/i);
    expect(titleElement).toBeInTheDocument();
  });
});
