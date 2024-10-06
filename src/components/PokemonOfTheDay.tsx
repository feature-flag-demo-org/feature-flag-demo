import { PokemonData } from '@/types';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';

const PokemonOfTheDay: React.FC = () => {
  const [pokemon, setPokemon] = useState<PokemonData | null>(null);
  const [feedback, setFeedback] = useState<string>('');

  useEffect(() => {
    const fetchPokemonOfTheDay = async () => {
      const randomId = Math.floor(Math.random() * 898) + 1;
      const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${randomId}`);
      const data = await res.json();
      setPokemon(data);
    };

    fetchPokemonOfTheDay();
  }, []);

  const handleFeedback = (isPositive: boolean) => {
    console.log(`User ${isPositive ? 'liked' : 'disliked'} the Pokémon of the Day feature`);
    setFeedback(isPositive ? 'Thanks for your feedback!' : 'We will try to improve!');
  };

  if (!pokemon) return null;

  return (
    <div className="bg-yellow-100 p-4 rounded-lg shadow-md mb-4">
      <h2 className="text-2xl text-gray-900 font-bold mb-2">Pokémon of the Day (Beta)</h2>
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
      <div className="mt-4">
        <p className="text-gray-900">How do you like this feature?</p>
        <button onClick={() => handleFeedback(true)} className="bg-green-500 text-white px-2 py-1 rounded mr-2">
          👍 Like
        </button>
        <button onClick={() => handleFeedback(false)} className="bg-red-500 text-white px-2 py-1 rounded">
          👎 Dislike
        </button>
      </div>
      {feedback && <p className="mt-2">{feedback}</p>}
    </div>
  );
};

export default PokemonOfTheDay;
