'use client';
import PokemonCard from '@/components/PokemonCard';
import { getRandomPokemonIds } from '@/utils/getRandomPokemonIds';
import { useState } from 'react';

export default function Home() {
  const [pokemonIds] = useState<number[]>(getRandomPokemonIds(3));

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8 text-center">Pokémon Feature Flag Demo</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {pokemonIds.map((id) => (
          <PokemonCard key={id} id={id} />
        ))}
      </div>
    </div>
  );
}
