'use client';
import PokemonCard from '@/components/PokemonCard';
import PokemonOfTheDay from '@/components/PokemonOfTheDay';
import PokemonTrivia from '@/components/PokemonTrivia';
import UserManagement from '@/components/UserManagement';
import { useFeatureFlags } from '@/context/FeatureFlagContext';
import { getRandomPokemonIds } from '@/utils/getRandomPokemonIds';
import { useState } from 'react';

export default function Home() {
  const {
    flags: { isReady, isUserManagementEnabled, isPokemonOfTheDayEnabled },
    traits,
  } = useFeatureFlags();
  const [pokemonIds] = useState<number[]>(getRandomPokemonIds(3));

  if (!isReady) return null;

  return (
    <div className="container mx-auto px-4 py-8">
      {isUserManagementEnabled && (
        <section>
          <UserManagement />
        </section>
      )}
      <h1 className="text-4xl font-bold mb-8 text-center">Pokémon Feature Flag Demo</h1>
      {isPokemonOfTheDayEnabled && (
        <section className="my-8">
          <PokemonOfTheDay />
        </section>
      )}
      {traits.user_group == 'beta' && (
        <section className="my-8">
          <PokemonTrivia />
        </section>
      )}
      <div className="flex flex-wrap justify-center gap-4">
        {pokemonIds.map((id) => (
          <PokemonCard key={id} id={id} />
        ))}
      </div>
    </div>
  );
}
