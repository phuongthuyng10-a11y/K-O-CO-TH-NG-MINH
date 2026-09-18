import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Settings, Play, ArrowRight, RotateCcw, Award, CheckCircle2 } from 'lucide-react';
import { Question, Team, TeamId, GameState, GameMode, OpponentType, AiDifficulty } from './types';
import { generateQuestionSetsForTeams, QUESTION_BANK } from './data/questions';
import { soundFX } from './utils/sound';
import { TugOfWarArena } from './components/TugOfWarArena';
import { QuestionCard } from './components/QuestionCard';
import { ParallelQuestionArena } from './components/ParallelQuestionArena';
import { ScoreBoard } from './components/ScoreBoard';
import { VictoryModal } from './components/VictoryModal';
import { RulesModal } from './components/RulesModal';
import { SettingsModal } from './components/SettingsModal';
import { RandomQuestionsModal, QuestionModalTab } from './components/RandomQuestionsModal';

export default function App() {
  // Custom Question Bank with localStorage persistence
  const [customQuestionBank, setCustomQuestionBank] = useState<Question[]>(() => {
    try {
      const saved = localStorage.getItem('keoco_question_bank');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.error('Failed to load questions from localStorage', e);
    }
    return QUESTION_BANK;
  });

  useEffect(() => {
    try {
      localStorage.setItem('keoco_question_bank', JSON.stringify(customQuestionBank));
    } catch (e) {
      console.error('Failed to save questions to localStorage', e);
    }
  }, [customQuestionBank]);

  // Opponent Mode: 'pvp' (2 người chơi) | 'ai' (chơi với máy)
  const [opponentType, setOpponentType] = useState<OpponentType>('pvp');
  const [aiDifficulty, setAiDifficulty] = useState<AiDifficulty>('medium');

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

  // Game Mode: 'alternating' (luân phiên từng câu, chuyển lượt khi hết giờ/sai) | 'parallel' (song song)
  const [gameMode, setGameMode] = useState<GameMode>('alternating');

  // Question Banks: 10 individual questions each team
  const [team1Questions, setTeam1Questions] = useState<Question[]>([]);
  const [team2Questions, setTeam2Questions] = useState<Question[]>([]);

  // Current turn management (for alternating mode)
  const [turnOwnerTeamId, setTurnOwnerTeamId] = useState<TeamId>('team1'); // Team whose question is being asked
  const [activeTeamId, setActiveTeamId] = useState<TeamId>('team1'); // Team currently answering
  const [team1CurrentIndex, setTeam1CurrentIndex] = useState<number>(0);
  const [team2CurrentIndex, setTeam2CurrentIndex] = useState<number>(0);

  // Turn transfer state (chuyển lượt cho đối phương khi không trả lời được)
  const [isTurnTransferred, setIsTurnTransferred] = useState<boolean>(false);
  const [transferredReason, setTransferredReason] = useState<'timeout' | 'wrong' | null>(null);
  const [failedPrimaryOption, setFailedPrimaryOption] = useState<number | null>(null);

  // Parallel Mode Independent States
  const [team1Answered, setTeam1Answered] = useState<boolean>(false);
  const [team1Selected, setTeam1Selected] = useState<number | null>(null);
  const [team1IsCorrect, setTeam1IsCorrect] = useState<boolean | null>(null);
  const [team1TimeLeft, setTeam1TimeLeft] = useState<number | null>(10);

  const [team2Answered, setTeam2Answered] = useState<boolean>(false);
  const [team2Selected, setTeam2Selected] = useState<number | null>(null);
  const [team2IsCorrect, setTeam2IsCorrect] = useState<boolean | null>(null);
  const [team2TimeLeft, setTeam2TimeLeft] = useState<number | null>(10);

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
  const [questionsModalTab, setQuestionsModalTab] = useState<QuestionModalTab>('manage');

  // Timer per question (mặc định 10 giây theo yêu cầu)
  const [timeLimit, setTimeLimit] = useState<number | null>(10);
  const [timeLeft, setTimeLeft] = useState<number | null>(10);

  // Helper for computing AI Answer choice based on difficulty
  const computeAiChoice = (
    correctIndex: number,
    excludedIndex: number | null = null,
    difficulty: AiDifficulty = 'medium'
  ): number => {
    const roll = Math.random();
    let correctProbability = 0.75;
    if (difficulty === 'easy') correctProbability = 0.50;
    else if (difficulty === 'hard') correctProbability = 0.90;

    if (roll < correctProbability) {
      return correctIndex;
    }

    // Pick an incorrect option, avoiding excludedIndex if provided
    const wrongOptions = [0, 1, 2, 3].filter(
      (idx) => idx !== correctIndex && idx !== excludedIndex
    );
    if (wrongOptions.length === 0) return (correctIndex + 1) % 4;
    return wrongOptions[Math.floor(Math.random() * wrongOptions.length)];
  };

  // Initialize a new match with 10 fresh questions for each team
  const startNewGame = useCallback(() => {
    const { team1Questions: t1Q, team2Questions: t2Q } = generateQuestionSetsForTeams(customQuestionBank);
    setTeam1Questions(t1Q);
    setTeam2Questions(t2Q);

    setTeam1((prev) => ({ ...prev, correctAnswers: 0, totalAnswered: 0 }));
    setTeam2((prev) => ({
      ...prev,
      correctAnswers: 0,
      totalAnswered: 0,
      name: opponentType === 'ai' ? 'Máy Tính (AI)' : (prev.name.includes('Máy') ? 'Đội 2 (Đỏ Rực)' : prev.name),
      shortName: opponentType === 'ai' ? 'Máy (AI)' : (prev.shortName.includes('Máy') ? 'Đội 2' : prev.shortName),
      avatarIcon: opponentType === 'ai' ? 'bot' : 'tiger',
    }));

    setTeam1CurrentIndex(0);
    setTeam2CurrentIndex(0);
    setTurnOwnerTeamId('team1');
    setActiveTeamId('team1');
    setIsTurnTransferred(false);
    setTransferredReason(null);
    setFailedPrimaryOption(null);

    // Reset parallel state
    setTeam1Answered(false);
    setTeam1Selected(null);
    setTeam1IsCorrect(null);
    setTeam1TimeLeft(timeLimit ?? 10);

    setTeam2Answered(false);
    setTeam2Selected(null);
    setTeam2IsCorrect(null);
    setTeam2TimeLeft(timeLimit ?? 10);

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
  }, [timeLimit, customQuestionBank, opponentType]);

  // Open Questions Modal directly to specified tab
  const handleOpenQuestionsModal = (tab: QuestionModalTab = 'manage') => {
    setQuestionsModalTab(tab);
    setIsQuestionsModalOpen(true);
  };

  // Question CRUD handlers
  const handleAddQuestion = (newQData: {
    question: string;
    options: [string, string, string, string];
    correctIndex: number;
    explanation?: string;
    category?: string;
  }) => {
    const newQuestion: Question = {
      id: `custom-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      question: newQData.question,
      options: newQData.options,
      correctIndex: newQData.correctIndex,
      explanation: newQData.explanation,
      category: newQData.category || 'Tùy chỉnh',
    };
    setCustomQuestionBank((prev) => [newQuestion, ...prev]);
  };

  const handleEditQuestion = (updatedQ: Question) => {
    setCustomQuestionBank((prev) =>
      prev.map((q) => (q.id === updatedQ.id ? updatedQ : q))
    );
    setTeam1Questions((prev) =>
      prev.map((q) => (q.id === updatedQ.id ? { ...q, ...updatedQ } : q))
    );
    setTeam2Questions((prev) =>
      prev.map((q) => (q.id === updatedQ.id ? { ...q, ...updatedQ } : q))
    );
  };

  const handleDeleteQuestion = (id: string) => {
    setCustomQuestionBank((prev) => prev.filter((q) => q.id !== id));
  };

  const handleResetQuestions = () => {
    setCustomQuestionBank(QUESTION_BANK);
    try {
      localStorage.removeItem('keoco_question_bank');
    } catch (e) {
      console.error('Failed to clear custom questions', e);
    }
  };

  // Áp dụng trực tiếp 2 bộ 10 câu hỏi ngẫu nhiên mới từ modal
  const handleApplyNewQuestions = (t1Q: Question[], t2Q: Question[]) => {
    setTeam1Questions(t1Q);
    setTeam2Questions(t2Q);
    setTeam1((prev) => ({ ...prev, correctAnswers: 0, totalAnswered: 0 }));
    setTeam2((prev) => ({ ...prev, correctAnswers: 0, totalAnswered: 0 }));
    setTeam1CurrentIndex(0);
    setTeam2CurrentIndex(0);
    setTurnOwnerTeamId('team1');
    setActiveTeamId('team1');
    setIsTurnTransferred(false);
    setTransferredReason(null);
    setFailedPrimaryOption(null);

    setTeam1Answered(false);
    setTeam1Selected(null);
    setTeam1IsCorrect(null);
    setTeam1TimeLeft(timeLimit ?? 10);

    setTeam2Answered(false);
    setTeam2Selected(null);
    setTeam2IsCorrect(null);
    setTeam2TimeLeft(timeLimit ?? 10);

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
      setTeam1TimeLeft(timeLimit ?? 10);
      setTeam2TimeLeft(timeLimit ?? 10);
    } else {
      setTimeLeft(timeLimit ?? 10);
    }
  };

  // Change Opponent Type (2 Người vs Chơi với máy)
  const handleChangeOpponentType = (type: OpponentType) => {
    setOpponentType(type);
    if (type === 'ai') {
      setTeam2((prev) => ({
        ...prev,
        name: 'Máy Tính (AI)',
        shortName: 'Máy (AI)',
        avatarIcon: 'bot',
      }));
    } else {
      setTeam2((prev) => ({
        ...prev,
        name: 'Đội 2 (Đỏ Rực)',
        shortName: 'Đội 2',
        avatarIcon: 'tiger',
      }));
    }
  };

  const handleChangeAiDifficulty = (diff: AiDifficulty) => {
    setAiDifficulty(diff);
  };

  // Current active question for alternating mode
  // The current team answering (either turn owner or opponent who stole the turn)
  const currentTeam = activeTeamId === 'team1' ? team1 : team2;
  // Question always belongs to the turn owner
  const currentQuestions = turnOwnerTeamId === 'team1' ? team1Questions : team2Questions;
  const currentQuestionIndex = turnOwnerTeamId === 'team1' ? team1CurrentIndex : team2CurrentIndex;
  const currentQuestion = currentQuestions[currentQuestionIndex];

  // Alternating Mode: AI Bot automated answering when it's Team 2's turn
  useEffect(() => {
    if (
      gameMode !== 'alternating' ||
      opponentType !== 'ai' ||
      activeTeamId !== 'team2' ||
      isAnswered ||
      gameState !== 'playing' ||
      !currentQuestion
    ) {
      return;
    }

    // Realistic thinking time between 1.6s and 2.4s (well within the 10s timer)
    const thinkDelay = 1600 + Math.random() * 800;
    const timer = setTimeout(() => {
      // Choose answer based on difficulty and avoid previously failed option if turn was transferred
      const choice = computeAiChoice(
        currentQuestion.correctIndex,
        isTurnTransferred ? failedPrimaryOption : null,
        aiDifficulty
      );
      handleAnswer(choice);
    }, thinkDelay);

    return () => clearTimeout(timer);
  }, [
    gameMode,
    opponentType,
    activeTeamId,
    isAnswered,
    gameState,
    currentQuestion,
    isTurnTransferred,
    failedPrimaryOption,
    aiDifficulty,
  ]);

  // Alternating Mode: Auto-advance to next question after AI finishes answering
  useEffect(() => {
    if (
      gameMode !== 'alternating' ||
      opponentType !== 'ai' ||
      activeTeamId !== 'team2' ||
      !isAnswered ||
      gameState !== 'playing'
    ) {
      return;
    }

    const timer = setTimeout(() => {
      handleNextTurn();
    }, 2800);

    return () => clearTimeout(timer);
  }, [gameMode, opponentType, activeTeamId, isAnswered, gameState]);

  // Parallel Mode: AI Bot automated answering for Team 2
  useEffect(() => {
    if (
      gameMode !== 'parallel' ||
      opponentType !== 'ai' ||
      team2Answered ||
      team2.totalAnswered >= 10 ||
      gameState !== 'playing'
    ) {
      return;
    }

    const currentQ = team2Questions[team2CurrentIndex];
    if (!currentQ) return;

    // AI thinking delay between 1.8s and 3.0s
    const thinkDelay = 1800 + Math.random() * 1200;
    const timer = setTimeout(() => {
      const choice = computeAiChoice(currentQ.correctIndex, null, aiDifficulty);
      handleTeam2Answer(choice);
    }, thinkDelay);

    return () => clearTimeout(timer);
  }, [
    gameMode,
    opponentType,
    team2Answered,
    team2CurrentIndex,
    team2Questions,
    team2.totalAnswered,
    gameState,
    aiDifficulty,
  ]);

  // Parallel Mode: Auto advance AI to next question after answering
  useEffect(() => {
    if (
      gameMode !== 'parallel' ||
      opponentType !== 'ai' ||
      !team2Answered ||
      team2.totalAnswered >= 10 ||
      gameState !== 'playing'
    ) {
      return;
    }

    const timer = setTimeout(() => {
      handleTeam2Next();
    }, 1700);

    return () => clearTimeout(timer);
  }, [gameMode, opponentType, team2Answered, team2.totalAnswered, gameState]);

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
      // Hết 10 giây: nếu đội chính chưa trả lời, chuyển lượt qua cho đối phương!
      if (!isTurnTransferred) {
        soundFX.playIncorrect();
        soundFX.playWhistle();
        setIsTurnTransferred(true);
        setTransferredReason('timeout');
        setFailedPrimaryOption(null);
        // Chuyển lượt trả lời qua cho đối phương với 10s mới
        const opponentId: TeamId = turnOwnerTeamId === 'team1' ? 'team2' : 'team1';
        setActiveTeamId(opponentId);
        setTimeLeft(timeLimit ?? 10);
      } else {
        // Đối phương cũng hết 10 giây: kết thúc câu hỏi, cả 2 không ghi điểm, dây đứng yên
        soundFX.playIncorrect();
        setIsAnswered(true);
        setSelectedAnswer(-1);
        setIsCurrentCorrect(false);
        if (turnOwnerTeamId === 'team1') {
          setTeam1((prev) => ({ ...prev, totalAnswered: prev.totalAnswered + 1 }));
        } else {
          setTeam2((prev) => ({ ...prev, totalAnswered: prev.totalAnswered + 1 }));
        }
      }
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
  }, [timeLeft, timeLimit, isAnswered, gameState, currentQuestion, gameMode, isTurnTransferred, turnOwnerTeamId]);

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

    if (!isTurnTransferred) {
      // Đội chính đang trả lời câu hỏi của mình
      if (isCorrect) {
        // Trả lời ĐÚNG ngay từ đầu: kéo dây về phía đội mình và ghi điểm
        soundFX.playCorrect();
        soundFX.playTug();
        setIsAnswered(true);
        setSelectedAnswer(optionIndex);
        setIsCurrentCorrect(true);

        if (turnOwnerTeamId === 'team1') {
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
        // Trả lời SAI: "không trả lời được thì lượt trả lời sẽ chuyển qua cho đối phương"
        soundFX.playIncorrect();
        soundFX.playWhistle();
        setIsTurnTransferred(true);
        setTransferredReason('wrong');
        setFailedPrimaryOption(optionIndex);
        // Chuyển lượt trả lời qua cho đối phương với 10s mới
        const opponentId: TeamId = turnOwnerTeamId === 'team1' ? 'team2' : 'team1';
        setActiveTeamId(opponentId);
        setTimeLeft(timeLimit ?? 10);
      }
    } else {
      // Đội đối phương đang trả lời câu hỏi chuyển lượt
      setIsAnswered(true);
      setSelectedAnswer(optionIndex);
      setIsCurrentCorrect(isCorrect);

      // Đánh dấu câu hỏi của đội chính đã kết thúc
      if (turnOwnerTeamId === 'team1') {
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

      if (isCorrect) {
        // Đối phương cướp lượt trả lời ĐÚNG: được điểm và kéo dây về phía mình!
        soundFX.playCorrect();
        soundFX.playTug();
        if (activeTeamId === 'team1') {
          setRopePosition((prev) => prev - 1);
          setTeam1((prev) => ({
            ...prev,
            correctAnswers: prev.correctAnswers + 1,
          }));
        } else {
          setRopePosition((prev) => prev + 1);
          setTeam2((prev) => ({
            ...prev,
            correctAnswers: prev.correctAnswers + 1,
          }));
        }
      } else {
        // Đối phương cũng trả lời sai: không đội nào ghi điểm, dây đứng yên
        soundFX.playIncorrect();
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
    setIsTurnTransferred(false);
    setTransferredReason(null);
    setFailedPrimaryOption(null);

    // Tăng chỉ số câu hỏi cho đội sở hữu câu vừa xong
    if (turnOwnerTeamId === 'team1') {
      setTeam1CurrentIndex((prev) => prev + 1);
    } else {
      setTeam2CurrentIndex((prev) => prev + 1);
    }

    // Kiểm tra xem cả 2 đội đã hoàn thành 10 câu hỏi chưa
    const t1Done = team1.totalAnswered >= 10;
    const t2Done = team2.totalAnswered >= 10;

    if (t1Done && t2Done) {
      setGameState('finished');
      return;
    }

    // Luân phiên chuyển lượt sở hữu câu hỏi giữa 2 đội
    let nextOwner: TeamId;
    if (turnOwnerTeamId === 'team1') {
      if (team2.totalAnswered < 10) {
        nextOwner = 'team2';
      } else {
        nextOwner = 'team1';
      }
    } else {
      if (team1.totalAnswered < 10) {
        nextOwner = 'team1';
      } else {
        nextOwner = 'team2';
      }
    }

    setTurnOwnerTeamId(nextOwner);
    setActiveTeamId(nextOwner);

    // Reset thời gian 10s cho lượt tiếp theo
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
    opponentType: OpponentType;
    aiDifficulty: AiDifficulty;
  }) => {
    setTeam1((prev) => ({ ...prev, name: settings.team1Name }));
    setTeam2((prev) => ({
      ...prev,
      name: settings.team2Name,
      shortName: settings.opponentType === 'ai' ? 'Máy (AI)' : 'Đội 2',
      avatarIcon: settings.opponentType === 'ai' ? 'bot' : 'tiger',
    }));
    setTimeLimit(settings.timeLimit);
    setGameMode(settings.gameMode);
    setOpponentType(settings.opponentType);
    setAiDifficulty(settings.aiDifficulty);

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
        opponentType={opponentType}
        aiDifficulty={aiDifficulty}
        onChangeMode={handleChangeMode}
        onChangeOpponentType={handleChangeOpponentType}
        onChangeAiDifficulty={handleChangeAiDifficulty}
        onToggleSound={toggleSound}
        onRestart={startNewGame}
        onOpenRules={() => setIsRulesOpen(true)}
        onOpenQuestionsModal={handleOpenQuestionsModal}
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
              isBotTeam2={opponentType === 'ai'}
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
                    questionNumber={(turnOwnerTeamId === 'team1' ? team1CurrentIndex : team2CurrentIndex) + 1}
                    team={currentTeam}
                    activeTeamId={activeTeamId}
                    onAnswer={handleAnswer}
                    onNext={handleNextTurn}
                    isAnswered={isAnswered}
                    selectedAnswer={selectedAnswer}
                    isCorrect={isCurrentCorrect}
                    timeLeft={timeLeft}
                    isTurnTransferred={isTurnTransferred}
                    transferredReason={transferredReason}
                    originalTeam={turnOwnerTeamId === 'team1' ? team1 : team2}
                    failedPrimaryOption={failedPrimaryOption}
                    isBotTurn={opponentType === 'ai' && activeTeamId === 'team2'}
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
          onClick={() => handleOpenQuestionsModal('manage')}
          className="flex items-center gap-1.5 font-medium hover:text-emerald-700 transition-colors cursor-pointer text-left"
          title="Mở tab Quản lý câu hỏi (Thêm, sửa, xóa)"
        >
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
          <span>Quản lý câu hỏi ({customQuestionBank.length} câu) • Thêm, sửa, xóa &amp; xáo ngẫu nhiên</span>
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
          opponentType={opponentType}
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
        opponentType={opponentType}
        aiDifficulty={aiDifficulty}
        onSave={handleSaveSettings}
      />

      <RandomQuestionsModal
        isOpen={isQuestionsModalOpen}
        onClose={() => setIsQuestionsModalOpen(false)}
        team1Questions={team1Questions}
        team2Questions={team2Questions}
        onApplyNewQuestions={handleApplyNewQuestions}
        customQuestionBank={customQuestionBank}
        onAddQuestion={handleAddQuestion}
        onEditQuestion={handleEditQuestion}
        onDeleteQuestion={handleDeleteQuestion}
        onResetQuestions={handleResetQuestions}
        initialTab={questionsModalTab}
      />
    </div>
  );
}
