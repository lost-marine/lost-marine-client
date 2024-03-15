export type ChatMessage = {
  playerId: number;
  speciesname: string;
  nickname: string;
  msg: string;
  timeStamp: number;
};

export type NewChatMessage = {
  playerId: number;
  msg: string;
};
