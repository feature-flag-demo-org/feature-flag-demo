import { useFeatureFlags } from '@/context/FeatureFlagContext';
import axios from 'axios';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';

interface PokemonData {
  name: string;
  sprites: {
    front_default: string;
    front_shiny: string;
  };
}

interface PokemonCardProps {
  id: number;
}

const PokemonCard: React.FC<PokemonCardProps> = ({ id }) => {
  const {
    flags: { isShinyPokemonEnabled },
  } = useFeatureFlags();
  const [pokemon, setPokemon] = useState<PokemonData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPokemon = async () => {
      try {
        const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${id}`);
        setPokemon(response.data);
        setIsLoading(false);
      } catch (err) {
        console.error('Error fetching Pokemon:', err);
        setError('Failed to load Pokémon');
        setIsLoading(false);
      }
    };

    fetchPokemon();
  }, [id]);

  if (isLoading) return <div className="text-center">Loading...</div>;
  if (error) return <div className="text-center text-red-500">{error}</div>;
  if (!pokemon) return null;
  const imageUrl = isShinyPokemonEnabled ? pokemon.sprites.front_shiny : pokemon.sprites.front_default;

  return (
    <div className="bg-white rounded-lg shadow-md p-4 flex flex-col items-center relative">
      {isShinyPokemonEnabled && (
        <div className="absolute top-2 right-2 text-yellow-400">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
        </div>
      )}
      <Image src={imageUrl} alt={pokemon.name} width={200} height={200} />
      <h2 className="text-xl text-gray-900 font-bold mt-2 capitalize">{pokemon.name}</h2>
      {isShinyPokemonEnabled && <span className="text-sm text-yellow-500 font-semibold mt-1">✨ Shiny</span>}
    </div>
  );
};

export default PokemonCard;
