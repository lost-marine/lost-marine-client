export type GameOverResponse = {
  playerId: number;
  playerNickname: string;
  attackerNickname: string;
  attackerSpeciesId: number;
  message: string;
  planktonCount: number;
  microplasticCount: number;
  playerCount: number;
  totalExp: number;
};
