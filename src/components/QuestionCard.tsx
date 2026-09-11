import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, XCircle, ArrowRight, Sparkles, HelpCircle, Clock } from 'lucide-react';
import { Question, Team, TeamId } from '../types';

interface QuestionCardProps {
  question: Question;
  questionNumber: number; // 1 to 10
  team: Team;
  activeTeamId: TeamId;
  onAnswer: (optionIndex: number) => void;
  onNext: () => void;
  isAnswered: boolean;
  selectedAnswer: number | null;
  isCorrect: boolean | null;
  timeLeft?: number | null;
}

export const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  questionNumber,
  team,
  onAnswer,
  onNext,
  isAnswered,
  selectedAnswer,
  isCorrect,
  timeLeft,
}) => {
  const isEmerald = team.color === 'emerald';
  const optionLabels = ['A', 'B', 'C', 'D'];

  return (
    <div className="w-full h-full bg-white rounded-2xl border border-slate-200/90 shadow-md p-4 sm:p-6 flex flex-col justify-between relative overflow-hidden">
      {/* Decorative top accent colored by team */}
      <div
        className={`absolute top-0 inset-x-0 h-1.5 ${
          isEmerald ? 'bg-emerald-600' : 'bg-rose-600'
        }`}
      />

      {/* Header Info */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <div
            className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-2xs ${
              isEmerald
                ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                : 'bg-rose-100 text-rose-800 border border-rose-300'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-current" />
            LƯỢT CỦA: {team.name}
          </div>

          {question.category && (
            <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full flex items-center gap-1">
              <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
              {question.category}
            </span>
          )}
        </div>

        <div className="flex items-center gap-3">
          {timeLeft !== null && timeLeft !== undefined && (
            <div
              className={`flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-mono font-bold ${
                timeLeft <= 5
                  ? 'bg-red-100 text-red-700 animate-pulse'
                  : 'bg-slate-100 text-slate-700'
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>{timeLeft}s</span>
            </div>
          )}

          <div className="text-xs font-bold text-slate-600 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-full">
            Câu hỏi: <span className="text-amber-700 font-extrabold text-sm">{questionNumber}</span> / 10
          </div>
        </div>
      </div>

      {/* Question Text */}
      <div className="my-5">
        <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-slate-800 leading-snug tracking-tight">
          {question.question}
        </h2>
      </div>

      {/* 4 Multiple Choice Options */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-3.5">
        {question.options.map((option, index) => {
          const isSelected = selectedAnswer === index;
          const isThisCorrect = index === question.correctIndex;

          let btnStyles =
            'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100 hover:border-slate-300 hover:shadow-xs';

          if (isAnswered) {
            if (isThisCorrect) {
              btnStyles =
                'bg-emerald-50 border-emerald-500 text-emerald-900 ring-2 ring-emerald-400 shadow-xs font-bold';
            } else if (isSelected && !isThisCorrect) {
              btnStyles =
                'bg-rose-50 border-rose-400 text-rose-900 line-through opacity-85';
            } else {
              btnStyles = 'bg-slate-50/60 border-slate-200 text-slate-400 opacity-60';
            }
          }

          return (
            <motion.button
              key={index}
              id={`option-${question.id}-${index}`}
              disabled={isAnswered}
              onClick={() => onAnswer(index)}
              whileHover={!isAnswered ? { scale: 1.01 } : {}}
              whileTap={!isAnswered ? { scale: 0.99 } : {}}
              className={`w-full text-left p-3.5 sm:p-4 rounded-xl border-2 transition-all flex items-start gap-3 relative ${btnStyles}`}
            >
              <div
                className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 transition-colors ${
                  isAnswered && isThisCorrect
                    ? 'bg-emerald-600 text-white'
                    : isAnswered && isSelected && !isThisCorrect
                    ? 'bg-rose-600 text-white'
                    : 'bg-white border border-slate-300 text-slate-700 shadow-2xs'
                }`}
              >
                {optionLabels[index]}
              </div>

              <div className="text-sm sm:text-base font-medium flex-1 pt-0.5 leading-snug">
                {option}
              </div>

              {isAnswered && isThisCorrect && (
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5 animate-bounce" />
              )}
              {isAnswered && isSelected && !isThisCorrect && (
                <XCircle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
              )}
            </motion.button>
          );
        })}
      </div>

      {/* Immediate Result & Explanation Banner */}
      <AnimatePresence>
        {isAnswered && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`mt-5 p-4 rounded-xl border-2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
              isCorrect
                ? 'bg-emerald-50/90 border-emerald-300 text-emerald-900'
                : 'bg-amber-50/90 border-amber-300 text-amber-900'
            }`}
          >
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                {isCorrect ? (
                  <>
                    <Sparkles className="w-5 h-5 text-emerald-600" />
                    <span className="font-extrabold text-base text-emerald-800">
                      CHÍNH XÁC! Dây kéo co đã di chuyển về phía {team.name}!
                    </span>
                  </>
                ) : (
                  <>
                    <XCircle className="w-5 h-5 text-amber-700" />
                    <span className="font-extrabold text-base text-amber-800">
                      CHƯA CHÍNH XÁC! Dây kéo co vẫn đứng yên tại chỗ.
                    </span>
                  </>
                )}
              </div>

              {question.explanation && (
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed pl-7">
                  💡 <span className="font-semibold">Giải thích:</span> {question.explanation}
                </p>
              )}
            </div>

            <button
              id="next-question-btn"
              onClick={onNext}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl font-bold text-white text-sm bg-slate-800 hover:bg-slate-900 shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 shrink-0 cursor-pointer"
            >
              <span>{questionNumber < 10 ? 'Câu tiếp theo' : 'Xem kết quả'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
