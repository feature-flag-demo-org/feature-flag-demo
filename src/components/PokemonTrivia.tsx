import React, { useEffect, useState } from 'react';

const PokemonTrivia: React.FC = () => {
  const [trivia, setTrivia] = useState<string>('');

  useEffect(() => {
    const fetchTrivia = async () => {
      // In a real app, you'd fetch this from an API
      const triviaList = [
        'Pikachu was originally going to be a second evolution of Raichu.',
        'Clefairy was originally going to be the mascot of Pokémon instead of Pikachu.',
        "Pokémon is short for 'Pocket Monsters'.",
        'The first Pokémon ever created was Rhydon.',
      ];
      setTrivia(triviaList[Math.floor(Math.random() * triviaList.length)]);
    };

    fetchTrivia();
  }, []);

  return (
    <div className="bg-blue-100 text-gray-900 p-4 rounded-lg shadow-md mb-4">
      <h2 className="text-2xl font-bold mb-2">Pokémon Trivia (Beta)</h2>
      <p>{trivia}</p>
      <p className="text-sm text-gray-600 mt-2">
        You&apos;re seeing this feature because you&apos;re in the Beta group.
      </p>
    </div>
  );
};

export default PokemonTrivia;
