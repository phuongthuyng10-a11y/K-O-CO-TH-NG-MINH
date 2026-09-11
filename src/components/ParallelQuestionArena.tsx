import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, XCircle, ArrowRight, Sparkles, HelpCircle, Clock, Zap, Check } from 'lucide-react';
import { Question, Team, TeamId } from '../types';
import { TugOfWarArena } from './TugOfWarArena';

interface ParallelTeamCardProps {
  team: Team;
  question: Question | undefined;
  questionIndex: number;
  isAnswered: boolean;
  selectedAnswer: number | null;
  isCorrect: boolean | null;
  timeLeft: number | null;
  onAnswer: (index: number) => void;
  onNext: () => void;
  keyboardKeys: [string, string, string, string];
  teamSide: 'left' | 'right';
}

const ParallelTeamCard: React.FC<ParallelTeamCardProps> = ({
  team,
  question,
  questionIndex,
  isAnswered,
  selectedAnswer,
  isCorrect,
  timeLeft,
  onAnswer,
  onNext,
  keyboardKeys,
  teamSide,
}) => {
  const isTeam1 = teamSide === 'left';
  const optionLabels = ['A', 'B', 'C', 'D'];
  const isFinished = team.totalAnswered >= 10 || !question;

  return (
    <div
      className={`relative w-full rounded-2xl border-2 shadow-md bg-white p-4 sm:p-5 flex flex-col justify-between overflow-hidden transition-all ${
        isTeam1
          ? 'border-emerald-200 hover:border-emerald-300'
          : 'border-rose-200 hover:border-rose-300'
      }`}
    >
      {/* Top accent bar */}
      <div
        className={`absolute top-0 inset-x-0 h-1.5 ${
          isTeam1 ? 'bg-emerald-500' : 'bg-rose-500'
        }`}
      />

      <div>
        {/* Team Header */}
        <div className="flex items-center justify-between gap-2 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <span
              className={`w-3 h-3 rounded-full ${
                isTeam1 ? 'bg-emerald-500' : 'bg-rose-500'
              } animate-pulse`}
            />
            <h3
              className={`text-base sm:text-lg font-black tracking-tight ${
                isTeam1 ? 'text-emerald-800' : 'text-rose-800'
              }`}
            >
              {team.name}
            </h3>
          </div>

          <div className="flex items-center gap-2">
            {timeLeft !== null && !isFinished && (
              <span
                className={`text-xs font-mono font-bold px-2 py-0.5 rounded-full flex items-center gap-1 ${
                  timeLeft <= 4
                    ? 'bg-red-100 text-red-700 animate-pulse'
                    : 'bg-slate-100 text-slate-700'
                }`}
              >
                <Clock className="w-3 h-3" />
                {timeLeft}s
              </span>
            )}
            <span
              className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                isTeam1
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                  : 'bg-rose-50 text-rose-800 border border-rose-200'
              }`}
            >
              Câu {Math.min(10, questionIndex + 1)} / 10
            </span>
          </div>
        </div>

        {/* Progress bar (10 segments) */}
        <div className="flex gap-1 my-3">
          {Array.from({ length: 10 }).map((_, i) => {
            const isPast = i < team.totalAnswered;
            const isCurrent = i === questionIndex && !isFinished;
            return (
              <div
                key={i}
                className={`h-1.5 flex-1 rounded-full transition-all ${
                  isPast
                    ? isTeam1
                      ? 'bg-emerald-500'
                      : 'bg-rose-500'
                    : isCurrent
                    ? isTeam1
                      ? 'bg-emerald-300 animate-pulse'
                      : 'bg-rose-300 animate-pulse'
                    : 'bg-slate-200'
                }`}
              />
            );
          })}
        </div>

        {/* Finished state */}
        {isFinished ? (
          <div className="py-10 text-center flex flex-col items-center justify-center">
            <div
              className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-3 shadow-md ${
                isTeam1 ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
              }`}
            >
              <Check className="w-8 h-8 font-black" />
            </div>
            <h4 className="text-lg font-black text-slate-800">
              {team.name} Đã Hoàn Thành!
            </h4>
            <p className="text-xs text-slate-500 mt-1 max-w-xs">
              Đạt {team.correctAnswers}/10 câu đúng. Đang đợi đội bạn hoàn thành 10 câu...
            </p>
          </div>
        ) : question ? (
          <>
            {/* Category tag */}
            {question.category && (
              <div className="mb-2">
                <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md inline-flex items-center gap-1">
                  <HelpCircle className="w-3 h-3 text-slate-400" />
                  {question.category}
                </span>
              </div>
            )}

            {/* Question Text */}
            <h4 className="text-sm sm:text-base font-bold text-slate-800 leading-snug min-h-[44px] mb-3">
              {question.question}
            </h4>

            {/* 4 Options */}
            <div className="space-y-2">
              {question.options.map((opt, optIdx) => {
                const isSelected = selectedAnswer === optIdx;
                const isThisCorrect = optIdx === question.correctIndex;

                let optClass =
                  'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100 hover:border-slate-300';

                if (isAnswered) {
                  if (isThisCorrect) {
                    optClass =
                      'bg-emerald-50 border-emerald-500 text-emerald-950 font-bold ring-1 ring-emerald-400';
                  } else if (isSelected && !isThisCorrect) {
                    optClass =
                      'bg-rose-50 border-rose-400 text-rose-900 line-through opacity-85';
                  } else {
                    optClass = 'bg-slate-50/50 border-slate-200 text-slate-400 opacity-60';
                  }
                }

                return (
                  <motion.button
                    key={optIdx}
                    id={`parallel-${team.id}-option-${optIdx}`}
                    disabled={isAnswered}
                    onClick={() => onAnswer(optIdx)}
                    whileHover={!isAnswered ? { scale: 1.01 } : {}}
                    whileTap={!isAnswered ? { scale: 0.99 } : {}}
                    className={`w-full text-left px-3 py-2.5 rounded-xl border transition-all flex items-center justify-between gap-2.5 cursor-pointer disabled:cursor-default ${optClass}`}
                  >
                    <div className="flex items-center gap-2.5 flex-1 min-w-0">
                      <span
                        className={`w-6 h-6 rounded-lg text-xs font-black flex items-center justify-center shrink-0 shadow-2xs ${
                          isAnswered && isThisCorrect
                            ? 'bg-emerald-600 text-white'
                            : isAnswered && isSelected && !isThisCorrect
                            ? 'bg-rose-600 text-white'
                            : 'bg-white border border-slate-300 text-slate-700'
                        }`}
                      >
                        {optionLabels[optIdx]}
                      </span>

                      <span className="text-xs sm:text-sm font-medium leading-tight truncate-2-lines">
                        {opt}
                      </span>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      {!isAnswered && (
                        <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-mono font-bold text-slate-400 bg-white border border-slate-200 rounded shadow-2xs">
                          {keyboardKeys[optIdx]}
                        </kbd>
                      )}

                      {isAnswered && isThisCorrect && (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      )}
                      {isAnswered && isSelected && !isThisCorrect && (
                        <XCircle className="w-4 h-4 text-rose-600 shrink-0" />
                      )}
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </>
        ) : null}
      </div>

      {/* Answer feedback & Next button */}
      {!isFinished && (
        <div className="mt-3 pt-3 border-t border-slate-100 min-h-[64px] flex items-center justify-between gap-2">
          {isAnswered ? (
            <>
              <div className="flex-1 min-w-0 pr-2">
                <div className="flex items-center gap-1.5">
                  {isCorrect ? (
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                      <Sparkles className="w-3.5 h-3.5" /> Đúng! Dây di chuyển
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-md border border-rose-200">
                      <XCircle className="w-3.5 h-3.5" /> Sai! Dây đứng yên
                    </span>
                  )}
                </div>
                {question?.explanation && (
                  <p className="text-[11px] text-slate-500 truncate mt-1 italic">
                    {question.explanation}
                  </p>
                )}
              </div>

              <button
                id={`parallel-next-${team.id}-btn`}
                onClick={onNext}
                className={`px-3.5 py-2 rounded-xl text-xs font-black text-white shadow-sm flex items-center gap-1 cursor-pointer transition-all shrink-0 ${
                  isTeam1
                    ? 'bg-emerald-600 hover:bg-emerald-700 active:scale-95'
                    : 'bg-rose-600 hover:bg-rose-700 active:scale-95'
                }`}
              >
                <span>{questionIndex < 9 ? 'Câu kế tiếp' : 'Xong'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </>
          ) : (
            <div className="w-full flex items-center justify-between text-xs text-slate-400">
              <span className="flex items-center gap-1">
                <Zap className="w-3.5 h-3.5 text-amber-500" />
                Chọn đáp án để kéo dây ngay lập tức!
              </span>
              <span className="hidden sm:inline font-mono text-[11px]">
                Phím: [{keyboardKeys.join(', ')}]
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

interface ParallelQuestionArenaProps {
  team1: Team;
  team2: Team;
  team1Question: Question | undefined;
  team2Question: Question | undefined;
  team1Index: number;
  team2Index: number;
  team1Answered: boolean;
  team2Answered: boolean;
  team1Selected: number | null;
  team2Selected: number | null;
  team1IsCorrect: boolean | null;
  team2IsCorrect: boolean | null;
  team1TimeLeft: number | null;
  team2TimeLeft: number | null;
  onTeam1Answer: (index: number) => void;
  onTeam2Answer: (index: number) => void;
  onTeam1Next: () => void;
  onTeam2Next: () => void;
  ropePosition: number;
  activeTeamId: TeamId;
  lastAction?: {
    teamId: TeamId;
    isCorrect: boolean;
    timestamp: number;
  } | null;
}

export const ParallelQuestionArena: React.FC<ParallelQuestionArenaProps> = ({
  team1,
  team2,
  team1Question,
  team2Question,
  team1Index,
  team2Index,
  team1Answered,
  team2Answered,
  team1Selected,
  team2Selected,
  team1IsCorrect,
  team2IsCorrect,
  team1TimeLeft,
  team2TimeLeft,
  onTeam1Answer,
  onTeam2Answer,
  onTeam1Next,
  onTeam2Next,
  ropePosition,
  activeTeamId,
  lastAction,
}) => {
  // Keyboard listener for simultaneous 2-player keyboard input
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Avoid firing if user is typing in an input
      if (['INPUT', 'TEXTAREA'].includes((document.activeElement as HTMLElement)?.tagName)) {
        return;
      }

      const key = e.key.toLowerCase();

      // Team 1 controls: A, S, D, F (or 1, 2, 3, 4)
      if (!team1Answered && team1Question && team1.totalAnswered < 10) {
        if (key === 'a' || key === '1') {
          e.preventDefault();
          onTeam1Answer(0);
        } else if (key === 's' || key === '2') {
          e.preventDefault();
          onTeam1Answer(1);
        } else if (key === 'd' || key === '3') {
          e.preventDefault();
          onTeam1Answer(2);
        } else if (key === 'f' || key === '4') {
          e.preventDefault();
          onTeam1Answer(3);
        }
      } else if (team1Answered && (key === ' ' || key === 'e')) {
        // Space or E for Team 1 Next
        e.preventDefault();
        onTeam1Next();
      }

      // Team 2 controls: J, K, L, ; (or 7, 8, 9, 0)
      if (!team2Answered && team2Question && team2.totalAnswered < 10) {
        if (key === 'j' || key === '7') {
          e.preventDefault();
          onTeam2Answer(0);
        } else if (key === 'k' || key === '8') {
          e.preventDefault();
          onTeam2Answer(1);
        } else if (key === 'l' || key === '9') {
          e.preventDefault();
          onTeam2Answer(2);
        } else if (key === ';' || key === '0' || key === 'enter') {
          e.preventDefault();
          onTeam2Answer(3);
        }
      } else if (team2Answered && (key === 'enter' || key === 'u')) {
        // Enter or U for Team 2 Next
        e.preventDefault();
        onTeam2Next();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    team1Answered,
    team2Answered,
    team1Question,
    team2Question,
    team1.totalAnswered,
    team2.totalAnswered,
    onTeam1Answer,
    onTeam2Answer,
    onTeam1Next,
    onTeam2Next,
  ]);

  return (
    <div className="w-full mx-auto">
      {/* Subheader banner for parallel mode */}
      <div className="flex flex-wrap items-center justify-between mb-2.5 px-2 gap-2">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300 text-xs font-black flex items-center gap-1 shadow-2xs">
            <Zap className="w-3.5 h-3.5 text-amber-600 fill-amber-500" />
            CHẾ ĐỘ SONG SONG
          </span>
          <span className="text-xs text-slate-500 hidden sm:inline">
            Hai đội thi đấu cùng lúc • Câu hỏi đặt ngang hàng với sân kéo co
          </span>
        </div>

        <div className="text-[11px] text-slate-500 font-medium hidden md:block">
          💡 Phím tắt: Đội 1 <span className="font-bold text-emerald-700">[A, S, D, F]</span> • Đội 2 <span className="font-bold text-rose-700">[J, K, L, ;]</span>
        </div>
      </div>

      {/* 3 columns horizontally side-by-side on desktop (lg+), stacked on mobile */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 sm:gap-4 items-stretch">
        {/* CỘT 1: ĐỘI 1 (TRÁI) */}
        <div className="lg:col-span-4 flex flex-col justify-between">
          <ParallelTeamCard
            team={team1}
            question={team1Question}
            questionIndex={team1Index}
            isAnswered={team1Answered}
            selectedAnswer={team1Selected}
            isCorrect={team1IsCorrect}
            timeLeft={team1TimeLeft}
            onAnswer={onTeam1Answer}
            onNext={onTeam1Next}
            keyboardKeys={['A', 'S', 'D', 'F']}
            teamSide="left"
          />
        </div>

        {/* CỘT 2: SÂN ĐẤU KÉO CO (GIỮA) - NGANG BẰNG VỚI 2 KHUNG CÂU HỎI */}
        <div className="lg:col-span-4 flex flex-col justify-center">
          <TugOfWarArena
            ropePosition={ropePosition}
            team1={team1}
            team2={team2}
            activeTeamId={activeTeamId}
            lastAction={lastAction}
            gameMode="parallel"
            compact={true}
          />
        </div>

        {/* CỘT 3: ĐỘI 2 (PHẢI) */}
        <div className="lg:col-span-4 flex flex-col justify-between">
          <ParallelTeamCard
            team={team2}
            question={team2Question}
            questionIndex={team2Index}
            isAnswered={team2Answered}
            selectedAnswer={team2Selected}
            isCorrect={team2IsCorrect}
            timeLeft={team2TimeLeft}
            onAnswer={onTeam2Answer}
            onNext={onTeam2Next}
            keyboardKeys={['J', 'K', 'L', ';']}
            teamSide="right"
          />
        </div>
      </div>
    </div>
  );
};
