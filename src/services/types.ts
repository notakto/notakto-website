//TODO: recheck all types and interfaces for any possible improvements/strictness
//TODO: abstract common fields into base interfaces and inheriting with Omit/Pick as needed

export type BoardState = Array<string>;
export type GameMode = 'vsComputer' | 'vsPlayer' | 'liveMatch' | null;
export type DifficultyLevel = 1 | 2 | 3 | 4 | 5;
export type BoardSize = 2 | 3 | 4 | 5;
export type BoardNumber = 1 | 2 | 3 | 4 | 5;
export type MenuProps = {
  startGame: (mode: 'vsPlayer' | 'vsComputer'| 'liveMatch') => void;
  showTutorial: () => void;
  signed: boolean;
  signIn: () => void;
  signOut: () => void;
  toggleMute: ()=> void;
  isMuted: boolean;
};
export type LiveProps = {
  onClose: () => void;
};
export type GameBoardProps = {
  boards: Array<Array<string>>;
  makeMove: (boardIndex: number, cellIndex: number) => void;
  isBoardDead: (board: Array<string>) => boolean;
  boardSize: number;
};
export type GameProps = {
  currentPlayer: string;
  boards: string[][];
  makeMove: (boardIndex: number, cellIndex: number) => void;
  isBoardDead: (board: string[]) => boolean;
  undoMove: () => void;
  resetGame: () => void;
  exitToMenu: () => void;
  gameMode: 'vsComputer' | 'vsPlayer' | 'liveMatch' | null;
  numberOfBoards: number;
  onBoardConfigPress: () => void;
  difficulty?: number;
  onDifficultyPress?: () => void;
  boardSize: number;
  onResetNames: () => void;
  onUndo: () => void;
  onSkip: () => void;
  coins: number;
  experience: number;
  canUndo: boolean;
  canSkip: boolean;
  gameHistoryLength: number;
  toggleMute: ()=> void;
  isMuted: boolean;
  onAddCoins?: (amount: number) => void;
};
export type CellProps = {
  boardIndex: number;
  cellIndex: number;
  value: string;
  onPress: (boardIndex: number, cellIndex: number) => void;
  disabled: boolean;
  boardSize: number;
};
export type BoardProps = {
  boardIndex: number;
  boardState: BoardState;
  makeMove: (boardIndex: number, cellIndex: number) => void;
  isDead: boolean;
  boardSize: number;
};
export type WinnerModalProps = {
  visible: boolean;
  winner: string;
  onPlayAgain: () => void;
  onMenu: () => void;
};
export type TutorialModalProps = {
  visible: boolean;
  onClose: () => void;
};
export type PlayerNamesModalProps = {
  visible: boolean;
  onSubmit: (p1: string, p2: string) => void;
  initialNames?: [string, string];
};
export type DifficultyModalProps = {
  visible: boolean;
  onSelect: (level: DifficultyLevel) => void;
  onClose: () => void;
};
export type BoardConfigModalProps = {
  visible: boolean;
  currentBoards: number;
  currentSize: BoardSize;
  onConfirm: (num: BoardNumber, size: BoardSize) => void;
  onCancel: () => void;
};
export interface GameState {
  boards: BoardState[];
  currentPlayer: 1 | 2;
  winner: string;
  boardSize: BoardSize;
  numberOfBoards: BoardNumber;
  difficulty: DifficultyLevel;
  gameHistory: BoardState[][];
  sessionId: string;
  gameOver?: boolean;
}

export interface newGame{
  sessionId: string;
  gameState: GameState;
  success: boolean;
}

export interface makeMoveResponse {
  gameState: GameState;
  gameOver: boolean;
  success: boolean;
}

export interface resetGameResponse {
  gameState: GameState;
  success: boolean;
}
export interface updateConfigResponse {
  sessionId: string;
  gameState: GameState;
  success: boolean;
}

export interface undoMoveResponse {
  sessionId: string;
  gameState: GameState;
  success: boolean;
}
export interface skipMoveResponse {
  sessionId: string;
  gameState: GameState;
  gameOver?: boolean;
  success: boolean;
}

export interface errorResponse {
  success: false;
  error: string;
}