import axios from 'axios';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';

interface PokemonData {
  name: string;
  sprites: {
    front_default: string;
  };
}

interface PokemonCardProps {
  id: number;
}

const PokemonCard: React.FC<PokemonCardProps> = ({ id }) => {
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

  return (
    <div className="bg-white shadow-md rounded-lg p-4 flex flex-col items-center">
      <Image
        src={pokemon.sprites.front_default}
        alt={pokemon.name}
        width={128}
        height={128}
        style={{ objectFit: 'contain' }}
      />
      <h2 className="text-xl text-gray-900 font-semibold mt-2 capitalize">{pokemon.name}</h2>
    </div>
  );
};

export default PokemonCard;
