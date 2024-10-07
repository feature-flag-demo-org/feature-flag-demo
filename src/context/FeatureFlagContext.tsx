import flagsmith from 'flagsmith';
import React, { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useState } from 'react';

type FeatureFlagContext = {
  isLoading: boolean;
  flags: FeatureFlagsState;
  traits: TraitsState;
  identifyUser: (userId: string, traits: Partial<TraitsState>) => Promise<void>;
};

type FeatureFlagsState = {
  isReady: boolean;
  isUserManagementEnabled: boolean;
  isPokemonOfTheDayEnabled?: boolean;
};

type UserTraits = 'favorite_color' | 'user_group';
type TraitsState = Record<UserTraits, string | number | boolean | null>;

const traitsInitialState: TraitsState = {
  favorite_color: null,
  user_group: null,
};

const featureFlagInitialState: FeatureFlagsState = {
  isReady: false,
  isUserManagementEnabled: false,
  isPokemonOfTheDayEnabled: false,
};

const FeatureFlagContext = createContext<FeatureFlagContext | undefined>(undefined);

interface FeatureFlagProviderProps {
  children: ReactNode;
  environmentId?: string;
}

export const FeatureFlagProvider: React.FC<FeatureFlagProviderProps> = ({ children, environmentId }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [flags, setFlags] = useState<FeatureFlagsState>(featureFlagInitialState);
  const [traits, setTraits] = useState<TraitsState>(traitsInitialState);

  useEffect(() => {
    if (!environmentId) {
      console.error('Environment ID is required to initialize Flagsmith');
      return;
    }

    const initFlagsmith = async () => {
      try {
        await flagsmith.init({
          environmentID: environmentId,
          onChange: (oldFlags, params) => {
            if (params.flagsChanged) {
              setFlags((currentState) => ({
                ...currentState,
                isReady: true,
                isUserManagementEnabled: flagsmith.hasFeature('enable_user_management'),
                isPokemonOfTheDayEnabled: flagsmith.hasFeature('experimental_pokemon_of_the_day'),
              }));
            }
            if (params.traitsChanged) {
              setTraits((currentState) => ({
                ...currentState,
                favorite_color: flagsmith.getTrait('favorite_color'),
                user_group: flagsmith.getTrait('user_group'),
              }));
            }
          },
        });
        setIsLoading(false);
      } catch (error) {
        console.error('Failed to initialize Flagsmith:', error);
        setIsLoading(false);
      }
    };

    initFlagsmith();
  }, [environmentId]);

  const identifyUser = useCallback(async (userId: string, updatedTraits: Partial<TraitsState> = {}) => {
    setIsLoading(true);
    try {
      await flagsmith.setContext({
        identity: {
          identifier: userId,
          traits: Object.entries(updatedTraits).reduce((acc, [key, value]) => {
            if (value !== undefined) {
              acc[key] = { value };
            }
            return acc;
          }, {} as Record<string, { value: string | number | boolean | null }>),
        },
      });
    } catch (error) {
      console.error('Failed to identify user:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const value = useMemo(
    () => ({
      isLoading,
      flags,
      traits,
      identifyUser,
    }),
    [isLoading, flags, traits, identifyUser]
  );

  return <FeatureFlagContext.Provider value={value}>{children}</FeatureFlagContext.Provider>;
};

export const useFeatureFlags = () => {
  const context = useContext(FeatureFlagContext);
  if (context === undefined) {
    throw new Error('useFeatureFlags must be used within a FeatureFlagsProvider');
  }
  return context;
};
