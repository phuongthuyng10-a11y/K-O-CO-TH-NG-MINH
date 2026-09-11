import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Settings, Play, ArrowRight, RotateCcw, Award, CheckCircle2 } from 'lucide-react';
import { Question, Team, TeamId, GameState, GameMode } from './types';
import { generateQuestionSetsForTeams } from './data/questions';
import { soundFX } from './utils/sound';
import { TugOfWarArena } from './components/TugOfWarArena';
import { QuestionCard } from './components/QuestionCard';
import { ParallelQuestionArena } from './components/ParallelQuestionArena';
import { ScoreBoard } from './components/ScoreBoard';
import { VictoryModal } from './components/VictoryModal';
import { RulesModal } from './components/RulesModal';
import { SettingsModal } from './components/SettingsModal';
import { RandomQuestionsModal } from './components/RandomQuestionsModal';

export default function App() {
  // Game Setup & State
  const [team1, setTeam1] = useState<Team>({
    id: 'team1',
    name: 'Đội 1 (Xanh Lá)',
    shortName: 'Đội 1',
    color: 'emerald',
    accentHex: '#059669',
    borderHex: '#10b981',
    bgHex: '#ecfdf5',
    avatarIcon: 'dragon',
    correctAnswers: 0,
    totalAnswered: 0,
  });

  const [team2, setTeam2] = useState<Team>({
    id: 'team2',
    name: 'Đội 2 (Đỏ Rực)',
    shortName: 'Đội 2',
    color: 'rose',
    accentHex: '#e11d48',
    borderHex: '#f43f5e',
    bgHex: '#fff1f2',
    avatarIcon: 'tiger',
    correctAnswers: 0,
    totalAnswered: 0,
  });

  // Game Mode: 'parallel' (default: 2 đội thi đấu song song cùng lúc) | 'alternating' (luân phiên từng câu)
  const [gameMode, setGameMode] = useState<GameMode>('parallel');

  // Question Banks: 10 individual questions each team
  const [team1Questions, setTeam1Questions] = useState<Question[]>([]);
  const [team2Questions, setTeam2Questions] = useState<Question[]>([]);

  // Current turn management (for alternating mode)
  const [activeTeamId, setActiveTeamId] = useState<TeamId>('team1');
  const [team1CurrentIndex, setTeam1CurrentIndex] = useState<number>(0);
  const [team2CurrentIndex, setTeam2CurrentIndex] = useState<number>(0);

  // Parallel Mode Independent States
  const [team1Answered, setTeam1Answered] = useState<boolean>(false);
  const [team1Selected, setTeam1Selected] = useState<number | null>(null);
  const [team1IsCorrect, setTeam1IsCorrect] = useState<boolean | null>(null);
  const [team1TimeLeft, setTeam1TimeLeft] = useState<number | null>(null);

  const [team2Answered, setTeam2Answered] = useState<boolean>(false);
  const [team2Selected, setTeam2Selected] = useState<number | null>(null);
  const [team2IsCorrect, setTeam2IsCorrect] = useState<boolean | null>(null);
  const [team2TimeLeft, setTeam2TimeLeft] = useState<number | null>(null);

  // Rope state: 0 = center, < 0 = towards Team 1 (left), > 0 = towards Team 2 (right)
  const [ropePosition, setRopePosition] = useState<number>(0);

  // Turn status
  const [gameState, setGameState] = useState<GameState>('playing');
  const [isAnswered, setIsAnswered] = useState<boolean>(false);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isCurrentCorrect, setIsCurrentCorrect] = useState<boolean | null>(null);

  // Visual feedback for last action
  const [lastAction, setLastAction] = useState<{
    teamId: TeamId;
    isCorrect: boolean;
    timestamp: number;
  } | null>(null);

  // Audio & Modals
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [isRulesOpen, setIsRulesOpen] = useState<boolean>(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [isQuestionsModalOpen, setIsQuestionsModalOpen] = useState<boolean>(false);

  // Timer per question (null = unlimited)
  const [timeLimit, setTimeLimit] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);

  // Initialize a new match with 10 fresh questions for each team
  const startNewGame = useCallback(() => {
    const { team1Questions: t1Q, team2Questions: t2Q } = generateQuestionSetsForTeams();
    setTeam1Questions(t1Q);
    setTeam2Questions(t2Q);

    setTeam1((prev) => ({ ...prev, correctAnswers: 0, totalAnswered: 0 }));
    setTeam2((prev) => ({ ...prev, correctAnswers: 0, totalAnswered: 0 }));

    setTeam1CurrentIndex(0);
    setTeam2CurrentIndex(0);
    setActiveTeamId('team1');

    // Reset parallel state
    setTeam1Answered(false);
    setTeam1Selected(null);
    setTeam1IsCorrect(null);
    setTeam1TimeLeft(timeLimit);

    setTeam2Answered(false);
    setTeam2Selected(null);
    setTeam2IsCorrect(null);
    setTeam2TimeLeft(timeLimit);

    setRopePosition(0);
    setGameState('playing');
    setIsAnswered(false);
    setSelectedAnswer(null);
    setIsCurrentCorrect(null);
    setLastAction(null);

    if (timeLimit) {
      setTimeLeft(timeLimit);
    } else {
      setTimeLeft(null);
    }

    soundFX.playWhistle();
  }, [timeLimit]);

  // Áp dụng trực tiếp 2 bộ 10 câu hỏi ngẫu nhiên mới từ modal
  const handleApplyNewQuestions = (t1Q: Question[], t2Q: Question[]) => {
    setTeam1Questions(t1Q);
    setTeam2Questions(t2Q);
    setTeam1((prev) => ({ ...prev, correctAnswers: 0, totalAnswered: 0 }));
    setTeam2((prev) => ({ ...prev, correctAnswers: 0, totalAnswered: 0 }));
    setTeam1CurrentIndex(0);
    setTeam2CurrentIndex(0);
    setActiveTeamId('team1');

    setTeam1Answered(false);
    setTeam1Selected(null);
    setTeam1IsCorrect(null);
    setTeam1TimeLeft(timeLimit);

    setTeam2Answered(false);
    setTeam2Selected(null);
    setTeam2IsCorrect(null);
    setTeam2TimeLeft(timeLimit);

    setRopePosition(0);
    setGameState('playing');
    setIsAnswered(false);
    setSelectedAnswer(null);
    setIsCurrentCorrect(null);
    setLastAction(null);
    if (timeLimit) {
      setTimeLeft(timeLimit);
    } else {
      setTimeLeft(null);
    }
    soundFX.playWhistle();
  };

  // Load game on initial mount
  useEffect(() => {
    startNewGame();
  }, []);

  // Audio toggle sync
  const toggleSound = () => {
    const nextVal = !soundEnabled;
    setSoundEnabled(nextVal);
    soundFX.enabled = nextVal;
  };

  // Change Game Mode
  const handleChangeMode = (newMode: GameMode) => {
    setGameMode(newMode);
    if (newMode === 'parallel') {
      setTeam1TimeLeft(timeLimit);
      setTeam2TimeLeft(timeLimit);
    } else {
      setTimeLeft(timeLimit);
    }
  };

  // Current active question for alternating mode
  const currentTeam = activeTeamId === 'team1' ? team1 : team2;
  const currentQuestions = activeTeamId === 'team1' ? team1Questions : team2Questions;
  const currentQuestionIndex = activeTeamId === 'team1' ? team1CurrentIndex : team2CurrentIndex;
  const currentQuestion = currentQuestions[currentQuestionIndex];

  // Alternating Mode Countdown timer effect
  useEffect(() => {
    if (gameMode !== 'alternating' || timeLimit === null || isAnswered || gameState !== 'playing' || !currentQuestion) {
      return;
    }

    if (timeLeft === null) {
      setTimeLeft(timeLimit);
      return;
    }

    if (timeLeft <= 0) {
      // Hết giờ -> tính như trả lời sai
      handleAnswer(-1); // -1: hết giờ không chọn
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev === null || prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        if (prev <= 4) {
          soundFX.playTick();
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, timeLimit, isAnswered, gameState, currentQuestion, gameMode]);

  // Parallel Mode: Team 1 independent countdown
  useEffect(() => {
    if (gameMode !== 'parallel' || timeLimit === null || team1Answered || gameState !== 'playing' || team1.totalAnswered >= 10) {
      return;
    }

    if (team1TimeLeft === null) {
      setTeam1TimeLeft(timeLimit);
      return;
    }

    if (team1TimeLeft <= 0) {
      handleTeam1Answer(-1);
      return;
    }

    const timer = setInterval(() => {
      setTeam1TimeLeft((prev) => {
        if (prev === null || prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        if (prev <= 4) {
          soundFX.playTick();
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [team1TimeLeft, timeLimit, team1Answered, gameState, gameMode, team1.totalAnswered]);

  // Parallel Mode: Team 2 independent countdown
  useEffect(() => {
    if (gameMode !== 'parallel' || timeLimit === null || team2Answered || gameState !== 'playing' || team2.totalAnswered >= 10) {
      return;
    }

    if (team2TimeLeft === null) {
      setTeam2TimeLeft(timeLimit);
      return;
    }

    if (team2TimeLeft <= 0) {
      handleTeam2Answer(-1);
      return;
    }

    const timer = setInterval(() => {
      setTeam2TimeLeft((prev) => {
        if (prev === null || prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        if (prev <= 4) {
          soundFX.playTick();
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [team2TimeLeft, timeLimit, team2Answered, gameState, gameMode, team2.totalAnswered]);

  // -------------------------------------------------------------
  // PARALLEL MODE HANDLERS
  // -------------------------------------------------------------
  const handleTeam1Answer = (optionIndex: number) => {
    if (team1Answered || team1.totalAnswered >= 10) return;
    const q = team1Questions[team1CurrentIndex];
    if (!q) return;

    const isCorrect = optionIndex === q.correctIndex;
    setTeam1Answered(true);
    setTeam1Selected(optionIndex);
    setTeam1IsCorrect(isCorrect);

    if (isCorrect) {
      soundFX.playCorrect();
      soundFX.playTug();
      // Đội 1 (trái) kéo dây về phía âm (-1)
      setRopePosition((prev) => prev - 1);
      setTeam1((prev) => ({
        ...prev,
        correctAnswers: prev.correctAnswers + 1,
        totalAnswered: prev.totalAnswered + 1,
      }));
    } else {
      soundFX.playIncorrect();
      // Nếu trả lời sai thì dây vẫn đứng yên
      setTeam1((prev) => ({
        ...prev,
        totalAnswered: prev.totalAnswered + 1,
      }));
    }

    setLastAction({
      teamId: 'team1',
      isCorrect,
      timestamp: Date.now(),
    });

    // Nếu cả 2 đội đều đã trả lời đủ 10 câu
    if (team1.totalAnswered + 1 >= 10 && team2.totalAnswered >= 10) {
      setTimeout(() => {
        setGameState('finished');
      }, 1200);
    }
  };

  const handleTeam1Next = () => {
    if (team1CurrentIndex < 9) {
      setTeam1CurrentIndex((prev) => prev + 1);
      setTeam1Answered(false);
      setTeam1Selected(null);
      setTeam1IsCorrect(null);
      setTeam1TimeLeft(timeLimit);
    } else {
      // Đã xong 10 câu
      if (team2.totalAnswered >= 10) {
        setGameState('finished');
      }
    }
  };

  const handleTeam2Answer = (optionIndex: number) => {
    if (team2Answered || team2.totalAnswered >= 10) return;
    const q = team2Questions[team2CurrentIndex];
    if (!q) return;

    const isCorrect = optionIndex === q.correctIndex;
    setTeam2Answered(true);
    setTeam2Selected(optionIndex);
    setTeam2IsCorrect(isCorrect);

    if (isCorrect) {
      soundFX.playCorrect();
      soundFX.playTug();
      // Đội 2 (phải) kéo dây về phía dương (+1)
      setRopePosition((prev) => prev + 1);
      setTeam2((prev) => ({
        ...prev,
        correctAnswers: prev.correctAnswers + 1,
        totalAnswered: prev.totalAnswered + 1,
      }));
    } else {
      soundFX.playIncorrect();
      // Nếu trả lời sai thì dây vẫn đứng yên
      setTeam2((prev) => ({
        ...prev,
        totalAnswered: prev.totalAnswered + 1,
      }));
    }

    setLastAction({
      teamId: 'team2',
      isCorrect,
      timestamp: Date.now(),
    });

    // Nếu cả 2 đội đều đã trả lời đủ 10 câu
    if (team1.totalAnswered >= 10 && team2.totalAnswered + 1 >= 10) {
      setTimeout(() => {
        setGameState('finished');
      }, 1200);
    }
  };

  const handleTeam2Next = () => {
    if (team2CurrentIndex < 9) {
      setTeam2CurrentIndex((prev) => prev + 1);
      setTeam2Answered(false);
      setTeam2Selected(null);
      setTeam2IsCorrect(null);
      setTeam2TimeLeft(timeLimit);
    } else {
      // Đã xong 10 câu
      if (team1.totalAnswered >= 10) {
        setGameState('finished');
      }
    }
  };

  // -------------------------------------------------------------
  // ALTERNATING MODE HANDLERS
  // -------------------------------------------------------------
  const handleAnswer = (optionIndex: number) => {
    if (isAnswered || !currentQuestion) return;

    const isCorrect = optionIndex === currentQuestion.correctIndex;
    setIsAnswered(true);
    setSelectedAnswer(optionIndex);
    setIsCurrentCorrect(isCorrect);

    if (isCorrect) {
      soundFX.playCorrect();
      soundFX.playTug();

      // Khi trả lời đúng: kéo dây về phía đội đó
      if (activeTeamId === 'team1') {
        setRopePosition((prev) => prev - 1);
        setTeam1((prev) => ({
          ...prev,
          correctAnswers: prev.correctAnswers + 1,
          totalAnswered: prev.totalAnswered + 1,
        }));
      } else {
        setRopePosition((prev) => prev + 1);
        setTeam2((prev) => ({
          ...prev,
          correctAnswers: prev.correctAnswers + 1,
          totalAnswered: prev.totalAnswered + 1,
        }));
      }
    } else {
      soundFX.playIncorrect();
      // Yêu cầu prompt: "nếu trả lời sai thì dây vẫn đứng yên"
      if (activeTeamId === 'team1') {
        setTeam1((prev) => ({
          ...prev,
          totalAnswered: prev.totalAnswered + 1,
        }));
      } else {
        setTeam2((prev) => ({
          ...prev,
          totalAnswered: prev.totalAnswered + 1,
        }));
      }
    }

    setLastAction({
      teamId: activeTeamId,
      isCorrect,
      timestamp: Date.now(),
    });
  };

  // Move to next turn in alternating mode
  const handleNextTurn = () => {
    setIsAnswered(false);
    setSelectedAnswer(null);
    setIsCurrentCorrect(null);

    // Kiểm tra xem cả 2 đội đã hoàn thành 10 câu hỏi chưa
    const nextT1Total = activeTeamId === 'team1' ? team1.totalAnswered : team1.totalAnswered;
    const nextT2Total = activeTeamId === 'team2' ? team2.totalAnswered : team2.totalAnswered;

    if (nextT1Total >= 10 && nextT2Total >= 10) {
      setGameState('finished');
      return;
    }

    // Luân phiên chuyển lượt thi đấu giữa 2 đội
    if (activeTeamId === 'team1') {
      if (team2.totalAnswered < 10) {
        setActiveTeamId('team2');
      } else {
        setTeam1CurrentIndex((prev) => prev + 1);
      }
    } else {
      if (team1.totalAnswered < 10) {
        setTeam1CurrentIndex((prev) => prev + 1);
        setActiveTeamId('team1');
      } else {
        setTeam2CurrentIndex((prev) => prev + 1);
      }
    }

    // Reset thời gian
    if (timeLimit) {
      setTimeLeft(timeLimit);
    }
  };

  // Cập nhật cài đặt tên đội, thời gian & chế độ
  const handleSaveSettings = (settings: {
    team1Name: string;
    team2Name: string;
    timeLimit: number | null;
    gameMode: GameMode;
  }) => {
    setTeam1((prev) => ({ ...prev, name: settings.team1Name }));
    setTeam2((prev) => ({ ...prev, name: settings.team2Name }));
    setTimeLimit(settings.timeLimit);
    setGameMode(settings.gameMode);

    if (settings.timeLimit) {
      setTimeLeft(settings.timeLimit);
      setTeam1TimeLeft(settings.timeLimit);
      setTeam2TimeLeft(settings.timeLimit);
    } else {
      setTimeLeft(null);
      setTeam1TimeLeft(null);
      setTeam2TimeLeft(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50/40 via-white to-slate-50 text-slate-900 flex flex-col justify-between p-3 sm:p-5 md:p-6 select-none font-sans">
      {/* Top Header & Scoreboard */}
      <ScoreBoard
        team1={team1}
        team2={team2}
        activeTeamId={activeTeamId}
        ropePosition={ropePosition}
        soundEnabled={soundEnabled}
        gameMode={gameMode}
        onChangeMode={handleChangeMode}
        onToggleSound={toggleSound}
        onRestart={startNewGame}
        onOpenRules={() => setIsRulesOpen(true)}
        onOpenQuestionsModal={() => setIsQuestionsModalOpen(true)}
      />

      {/* Main Game Stage */}
      <main className="w-full max-w-7xl mx-auto my-3 sm:my-4 flex-1 flex flex-col justify-center">
        {gameState === 'playing' ? (
          gameMode === 'parallel' ? (
            /* Parallel Mode: Đội 1 (Trái) - Sân Kéo Co (Giữa) - Đội 2 (Phải) nằm ngang bằng nhau */
            <ParallelQuestionArena
              team1={team1}
              team2={team2}
              team1Question={team1Questions[team1CurrentIndex]}
              team2Question={team2Questions[team2CurrentIndex]}
              team1Index={team1CurrentIndex}
              team2Index={team2CurrentIndex}
              team1Answered={team1Answered}
              team2Answered={team2Answered}
              team1Selected={team1Selected}
              team2Selected={team2Selected}
              team1IsCorrect={team1IsCorrect}
              team2IsCorrect={team2IsCorrect}
              team1TimeLeft={team1TimeLeft}
              team2TimeLeft={team2TimeLeft}
              onTeam1Answer={handleTeam1Answer}
              onTeam2Answer={handleTeam2Answer}
              onTeam1Next={handleTeam1Next}
              onTeam2Next={handleTeam2Next}
              ropePosition={ropePosition}
              activeTeamId={activeTeamId}
              lastAction={lastAction}
            />
          ) : (
            /* Alternating Mode: Sân Kéo Co và Thẻ Câu Hỏi nằm ngang bằng nhau trên cùng 1 hàng */
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
              <div className="lg:col-span-6 flex flex-col justify-center">
                <TugOfWarArena
                  ropePosition={ropePosition}
                  team1={team1}
                  team2={team2}
                  activeTeamId={activeTeamId}
                  lastAction={lastAction}
                  gameMode={gameMode}
                  compact={true}
                />
              </div>

              <div className="lg:col-span-6 flex flex-col justify-between">
                {currentQuestion && (
                  <QuestionCard
                    question={currentQuestion}
                    questionNumber={currentQuestionIndex + 1}
                    team={currentTeam}
                    activeTeamId={activeTeamId}
                    onAnswer={handleAnswer}
                    onNext={handleNextTurn}
                    isAnswered={isAnswered}
                    selectedAnswer={selectedAnswer}
                    isCorrect={isCurrentCorrect}
                    timeLeft={timeLeft}
                  />
                )}
              </div>
            </div>
          )
        ) : (
          /* When not in playing state (e.g. game finished), show arena */
          <div className="max-w-4xl mx-auto w-full">
            <TugOfWarArena
              ropePosition={ropePosition}
              team1={team1}
              team2={team2}
              activeTeamId={activeTeamId}
              lastAction={lastAction}
              gameMode={gameMode}
            />
          </div>
        )}
      </main>

      {/* Bottom Bar Settings & Info */}
      <footer className="w-full max-w-7xl mx-auto flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-200/80">
        <button
          id="footer-open-questions-btn"
          onClick={() => setIsQuestionsModalOpen(true)}
          className="flex items-center gap-1.5 font-medium hover:text-emerald-700 transition-colors cursor-pointer text-left"
          title="Xem hoặc đổi 10 câu hỏi bất kì không trùng lặp"
        >
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
          <span>10 câu hỏi ngẫu nhiên &amp; không trùng lặp (Nhấn xem/đổi bộ mới)</span>
        </button>

        <button
          id="open-settings-btn"
          onClick={() => setIsSettingsOpen(true)}
          className="hover:text-slate-800 flex items-center gap-1 cursor-pointer transition-colors p-1 shrink-0 ml-2 font-medium"
        >
          <Settings className="w-3.5 h-3.5" />
          <span>Cài đặt &amp; Chế độ</span>
        </button>
      </footer>

      {/* Modals */}
      {gameState === 'finished' && (
        <VictoryModal
          team1={team1}
          team2={team2}
          ropePosition={ropePosition}
          onRestart={startNewGame}
        />
      )}

      <RulesModal
        isOpen={isRulesOpen}
        onClose={() => setIsRulesOpen(false)}
      />

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        team1Name={team1.name}
        team2Name={team2.name}
        timeLimit={timeLimit}
        gameMode={gameMode}
        onSave={handleSaveSettings}
      />

      <RandomQuestionsModal
        isOpen={isQuestionsModalOpen}
        onClose={() => setIsQuestionsModalOpen(false)}
        team1Questions={team1Questions}
        team2Questions={team2Questions}
        onApplyNewQuestions={handleApplyNewQuestions}
      />
    </div>
  );
}
