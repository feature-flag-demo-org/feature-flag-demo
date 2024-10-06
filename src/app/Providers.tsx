'use client';

import { FeatureFlagProvider } from '@/context/FeatureFlagContext';
import { FC, PropsWithChildren } from 'react';

const Providers: FC<PropsWithChildren> = ({ children }) => {
  return (
    <FeatureFlagProvider environmentId={process.env.NEXT_PUBLIC_FLAGSMITH_CLIENT_KEY}>{children}</FeatureFlagProvider>
  );
};

export { Providers };
