import flagsmith from 'flagsmith';
import React, { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useState } from 'react';

type FeatureFlagContext = {
  isLoading: boolean;
  flags: FeatureFlagsState;
  traits: TraitsState;
  identifyUser: (userId: string) => Promise<void>;
};

type FeatureFlagsState = {
  isTestEnabled: boolean;
};

type TraitsState = Record<string, string | number | boolean | null>;

const traitsInitialState: TraitsState = {
  favoriteColor: null,
};

const featureFlagInitialState: FeatureFlagsState = {
  isTestEnabled: false,
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
          onChange: () => {
            setFlags((currentState) => ({
              ...currentState,
              isTestEnabled: flagsmith.hasFeature('test_feature'),
            }));
            setTraits((currentState) => ({
              ...currentState,
              favoriteColor: flagsmith.getTrait('favourite_color'),
            }));
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

  const identifyUser = useCallback(async (userId: string) => {
    setIsLoading(true);
    try {
      await flagsmith.setContext({
        identity: {
          identifier: userId,
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
