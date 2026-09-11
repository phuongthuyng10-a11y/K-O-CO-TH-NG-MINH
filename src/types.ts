export interface Question {
  id: string;
  question: string;
  options: [string, string, string, string];
  correctIndex: number; // 0, 1, 2, 3
  explanation?: string;
  category?: string;
}

export type TeamId = 'team1' | 'team2';

export interface Team {
  id: TeamId;
  name: string;
  shortName: string;
  color: 'emerald' | 'amber' | 'blue' | 'rose' | 'purple' | 'orange';
  accentHex: string;
  borderHex: string;
  bgHex: string;
  avatarIcon: string;
  correctAnswers: number;
  totalAnswered: number;
}

export type GameMode = 'parallel' | 'alternating'; // 'parallel': cả 2 đội chơi song song cùng lúc | 'alternating': luân phiên từng câu

export type TurnMode = 'alternating' | 'independent'; // 'alternating': luân phiên từng câu | 'independent': mỗi đội chơi lần lượt cả 10 câu

export type GameState = 'setup' | 'playing' | 'round_result' | 'finished';

export interface TurnResult {
  teamId: TeamId;
  questionNumber: number;
  question: Question;
  selectedOptionIndex: number;
  isCorrect: boolean;
  ropePositionBefore: number;
  ropePositionAfter: number;
}
