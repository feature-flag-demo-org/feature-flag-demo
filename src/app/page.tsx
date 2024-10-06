'use client';
import PokemonCard from '@/components/PokemonCard';
import { useFeatureFlags } from '@/context/FeatureFlagContext';
import { getRandomPokemonIds } from '@/utils/getRandomPokemonIds';
import { useState } from 'react';

export default function Home() {
  const {
    flags: { isTestEnabled },
  } = useFeatureFlags();
  const [pokemonIds] = useState<number[]>(getRandomPokemonIds(3));

  return (
    <div className="container mx-auto px-4 py-8">
      {isTestEnabled && <p className="text-center text-xl text-green-500 mt-4">Test feature is enabled!!</p>}

      <h1 className="text-4xl font-bold mb-8 text-center">Pokémon Feature Flag Demo</h1>

      <div className="flex flex-wrap justify-center gap-4">
        {pokemonIds.map((id) => (
          <PokemonCard key={id} id={id} />
        ))}
      </div>
    </div>
  );
}
