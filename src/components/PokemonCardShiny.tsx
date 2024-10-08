import { useFeatureFlags } from '@/context/FeatureFlagContext';
import { logger } from '@/logger';
import { PokemonData } from '@/types';
import axios from 'axios';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';

interface PokemonCardProps {
  id: number;
}

const PokemonCardShiny: React.FC<PokemonCardProps> = ({ id }) => {
  const {
    flags: { isPokemonSpriteEnabled, pokemonCardLayout },
  } = useFeatureFlags();
  const [pokemon, setPokemon] = useState<PokemonData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPokemon = async () => {
      logger.info(`Fetching Pokemon with id: ${id}`);
      try {
        const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${id}`);
        setPokemon(response.data);
        setIsLoading(false);
        logger.debug('Pokemon data fetched:', response.data);
      } catch (err) {
        logger.error(`Error fetching Pokemon with id ${id}:`, err);
        setError('Failed to load Pokémon');
        setIsLoading(false);
      }
    };

    fetchPokemon();
  }, [id]);

  if (isLoading) return <div className="text-center">Loading...</div>;
  if (error) return <div className="text-center text-red-500">{error}</div>;
  if (!pokemon) return null;

  logger.debug(`Rendering Pokemon card for ${pokemon.name}`, { layout: pokemonCardLayout });

  if (pokemonCardLayout === 'detailed') {
    return (
      <div className="bg-white shadow-md rounded-lg p-4 flex flex-col items-center relative">
        <div className="absolute top-2 right-2 text-yellow-400">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
        </div>
        <p className="text-gray-900">Pokemon shiny working! still in development</p>
        {isPokemonSpriteEnabled && (
          <Image
            src={pokemon.sprites.front_default}
            alt={pokemon.name}
            width={128}
            height={128}
            style={{ objectFit: 'contain' }}
          />
        )}
        <h2 className="text-xl text-gray-900 font-semibold mt-2 capitalize">{pokemon.name}</h2>
        <p className="text-sm text-gray-600">
          Type: {pokemon.types.map((type: PokemonData['types'][0]) => type.type.name).join(', ')}
        </p>
        <p className="text-sm text-gray-600">Height: {pokemon.height / 10}m</p>
        <p className="text-sm text-gray-600">Weight: {pokemon.weight / 10}kg</p>
      </div>
    );
  }

  return (
    <div className="bg-white shadow-md rounded-lg p-4 flex flex-col items-center relative">
      <div className="absolute top-2 right-2 text-yellow-400">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      </div>
      <p className="text-gray-900">Pokemon shiny working! still in development</p>
      {isPokemonSpriteEnabled && (
        <Image
          src={pokemon.sprites.front_default}
          alt={pokemon.name}
          width={128}
          height={128}
          style={{ objectFit: 'contain' }}
        />
      )}
      <h2 className="text-xl text-gray-900 font-semibold mt-2 capitalize">{pokemon.name}</h2>
    </div>
  );
};

export default PokemonCardShiny;
