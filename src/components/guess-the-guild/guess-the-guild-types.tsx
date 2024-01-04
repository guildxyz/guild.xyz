import { GuildBase } from "types"

export enum GameMode {
  GuessNameMode,
  AssignLogosMode,
}

export enum GameState {
  Start,
  Game,
  End,
}

export type GameModeProps = {
  guilds: GuildBase[]
  onNext: () => void
  onExit: () => void
  onCorrect: () => void
}

export enum Difficulty {
  Easy,
  Medium,
  Hard,
}
