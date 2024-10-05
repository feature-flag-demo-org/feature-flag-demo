const MAX_POKEMON_ID = 493;

export const getRandomPokemonIds = (count: number): number[] => {
  const ids = new Set<number>();

  while (ids.size < count) {
    ids.add(Math.floor(Math.random() * MAX_POKEMON_ID) + 1);
  }

  return Array.from(ids);
};
