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
  isTurnTransferred?: boolean;
  transferredReason?: 'timeout' | 'wrong' | null;
  originalTeam?: Team | null;
  failedPrimaryOption?: number | null;
  isBotTurn?: boolean;
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
  isTurnTransferred = false,
  transferredReason = null,
  originalTeam = null,
  failedPrimaryOption = null,
  isBotTurn = false,
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
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <div
            className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-2xs transition-all ${
              isTurnTransferred
                ? isEmerald
                  ? 'bg-emerald-600 text-white animate-pulse ring-2 ring-emerald-300'
                  : 'bg-rose-600 text-white animate-pulse ring-2 ring-rose-300'
                : isEmerald
                ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                : 'bg-rose-100 text-rose-800 border border-rose-300'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-current" />
            {isTurnTransferred ? `⚡ CƯỚP LƯỢT: ${team.name}` : `LƯỢT CỦA: ${team.name}`}
          </div>

          {question.category && (
            <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full flex items-center gap-1">
              <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
              {question.category}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2.5">
          {timeLeft !== null && timeLeft !== undefined && (
            <div
              className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-black shadow-2xs transition-colors ${
                timeLeft <= 3
                  ? 'bg-red-600 text-white animate-bounce'
                  : timeLeft <= 5
                  ? 'bg-red-100 text-red-700 animate-pulse border border-red-300'
                  : 'bg-amber-100 text-amber-900 border border-amber-300'
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

      {/* Turn Transferred Notification Banner */}
      {isTurnTransferred && !isAnswered && (
        <div className="my-2.5 p-3 rounded-xl bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-400 shadow-sm text-amber-950 flex items-start gap-2.5 animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="w-7 h-7 rounded-lg bg-amber-500 text-white font-black flex items-center justify-center text-xs shrink-0 shadow-xs mt-0.5">
            ⚡
          </div>
          <div className="text-xs leading-relaxed">
            <p className="font-extrabold text-amber-900 text-sm">
              {transferredReason === 'timeout'
                ? `⏰ ${originalTeam?.name || 'Đối phương'} hết 10 giây không trả lời được!`
                : `❌ ${originalTeam?.name || 'Đối phương'} đã trả lời chưa chính xác!`}
            </p>
            <p className="text-slate-700 mt-0.5">
              Lượt trả lời câu này được <strong className="text-amber-900">chuyển qua cho {team.name}</strong> ({timeLeft}s)! Hãy chọn đáp án đúng để cướp điểm và kéo dây về sân mình!
            </p>
          </div>
        </div>
      )}

      {/* Bot Thinking Banner */}
      {isBotTurn && !isAnswered && (
        <div className="my-2.5 p-3 rounded-xl bg-gradient-to-r from-purple-50 to-indigo-50 border-2 border-purple-300 shadow-sm text-purple-950 flex items-center gap-3 animate-in fade-in duration-300">
          <div className="w-8 h-8 rounded-xl bg-purple-600 text-white flex items-center justify-center text-base shrink-0 shadow-xs animate-pulse">
            🤖
          </div>
          <div className="text-xs flex-1">
            <div className="flex items-center gap-1.5 font-black text-purple-950 text-sm">
              <span>{team.name} đang suy nghĩ...</span>
              <span className="flex gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-purple-600 animate-bounce" />
                <span className="w-1.5 h-1.5 rounded-full bg-purple-600 animate-bounce [animation-delay:0.2s]" />
                <span className="w-1.5 h-1.5 rounded-full bg-purple-600 animate-bounce [animation-delay:0.4s]" />
              </span>
            </div>
            <p className="text-purple-700 mt-0.5">
              Trí tuệ nhân tạo đang phân tích các phương án và sắp chọn đáp án!
            </p>
          </div>
        </div>
      )}

      {/* Question Text */}
      <div className="my-3.5 sm:my-4">
        <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-slate-800 leading-snug tracking-tight">
          {question.question}
        </h2>
      </div>

      {/* 4 Multiple Choice Options */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-3.5">
        {question.options.map((option, index) => {
          const isSelected = selectedAnswer === index;
          const isThisCorrect = index === question.correctIndex;
          const isFailedPrimary = isTurnTransferred && failedPrimaryOption === index;

          let btnStyles =
            'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100 hover:border-slate-300 hover:shadow-xs';

          if (isFailedPrimary && !isAnswered) {
            btnStyles = 'bg-rose-50/70 border-rose-200 text-rose-400 line-through opacity-60 cursor-not-allowed';
          } else if (isAnswered) {
            if (isThisCorrect) {
              btnStyles =
                'bg-emerald-50 border-emerald-500 text-emerald-900 ring-2 ring-emerald-400 shadow-xs font-bold';
            } else if (isSelected && !isThisCorrect) {
              btnStyles =
                'bg-rose-50 border-rose-400 text-rose-900 line-through opacity-85';
            } else if (isFailedPrimary) {
              btnStyles = 'bg-rose-50/50 border-rose-200 text-rose-300 line-through opacity-50';
            } else {
              btnStyles = 'bg-slate-50/60 border-slate-200 text-slate-400 opacity-60';
            }
          }

          const isDisabled = isAnswered || isFailedPrimary || isBotTurn;

          return (
            <motion.button
              key={index}
              id={`option-${question.id}-${index}`}
              disabled={isDisabled}
              onClick={() => onAnswer(index)}
              whileHover={!isDisabled ? { scale: 1.01 } : {}}
              whileTap={!isDisabled ? { scale: 0.99 } : {}}
              className={`w-full text-left p-3.5 sm:p-4 rounded-xl border-2 transition-all flex items-start gap-3 relative ${btnStyles}`}
            >
              <div
                className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 transition-colors ${
                  isAnswered && isThisCorrect
                    ? 'bg-emerald-600 text-white'
                    : isAnswered && isSelected && !isThisCorrect
                    ? 'bg-rose-600 text-white'
                    : isFailedPrimary
                    ? 'bg-rose-100 text-rose-600 border border-rose-300'
                    : 'bg-white border border-slate-300 text-slate-700 shadow-2xs'
                }`}
              >
                {optionLabels[index]}
              </div>

              <div className="text-sm sm:text-base font-medium flex-1 pt-0.5 leading-snug">
                {option}
                {isFailedPrimary && !isAnswered && (
                  <span className="block text-[11px] font-semibold text-rose-600 mt-0.5 not-italic">
                    (Đối phương đã chọn sai)
                  </span>
                )}
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
            className={`mt-4 p-4 rounded-xl border-2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
              isCorrect
                ? 'bg-emerald-50/90 border-emerald-300 text-emerald-900'
                : 'bg-amber-50/90 border-amber-300 text-amber-900'
            }`}
          >
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                {isCorrect ? (
                  <>
                    <Sparkles className="w-5 h-5 text-emerald-600 shrink-0" />
                    <span className="font-extrabold text-base text-emerald-800">
                      {isTurnTransferred
                        ? `XUẤT SẮC! ${team.name} cướp lượt thành công và kéo dây về phía mình!`
                        : `CHÍNH XÁC! Dây kéo co đã di chuyển về phía ${team.name}!`}
                    </span>
                  </>
                ) : (
                  <>
                    <XCircle className="w-5 h-5 text-amber-700 shrink-0" />
                    <span className="font-extrabold text-base text-amber-800">
                      {isTurnTransferred
                        ? `CHƯA CHÍNH XÁC! Cả hai đội đều không ghi được điểm. Dây kéo co vẫn đứng yên.`
                        : `CHƯA CHÍNH XÁC! Dây kéo co vẫn đứng yên tại chỗ.`}
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
