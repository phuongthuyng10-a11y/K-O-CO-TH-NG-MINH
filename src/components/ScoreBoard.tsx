import React from 'react';
import { Volume2, VolumeX, RotateCcw, HelpCircle, Trophy, Sparkles, Zap, Repeat, BookOpen, Users, Bot } from 'lucide-react';
import { Team, TeamId, GameMode, OpponentType, AiDifficulty } from '../types';
import { QuestionModalTab } from './RandomQuestionsModal';

interface ScoreBoardProps {
  team1: Team;
  team2: Team;
  activeTeamId: TeamId;
  ropePosition: number;
  soundEnabled: boolean;
  gameMode: GameMode;
  opponentType: OpponentType;
  aiDifficulty: AiDifficulty;
  onChangeMode: (mode: GameMode) => void;
  onChangeOpponentType: (type: OpponentType) => void;
  onChangeAiDifficulty: (diff: AiDifficulty) => void;
  onToggleSound: () => void;
  onRestart: () => void;
  onOpenRules: () => void;
  onOpenQuestionsModal: (tab?: QuestionModalTab) => void;
}

export const ScoreBoard: React.FC<ScoreBoardProps> = ({
  team1,
  team2,
  activeTeamId,
  ropePosition,
  soundEnabled,
  gameMode,
  opponentType,
  aiDifficulty,
  onChangeMode,
  onChangeOpponentType,
  onChangeAiDifficulty,
  onToggleSound,
  onRestart,
  onOpenRules,
  onOpenQuestionsModal,
}) => {
  const isAi = opponentType === 'ai';

  return (
    <header className="w-full max-w-7xl mx-auto flex flex-col gap-3">
      {/* Top Navbar */}
      <div className="flex flex-wrap items-center justify-between gap-2.5 px-2 sm:px-0">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-red-500 flex items-center justify-center text-white shadow-md">
            <Trophy className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-800 leading-tight flex items-center gap-2">
              <span>KÉO CO TRI THỨC</span>
            </h1>
            <p className="text-xs text-slate-500 hidden sm:block">
              {isAi ? 'Đấu trí trực tiếp với Trí Tuệ Nhân Tạo (AI Bot)' : 'Thi đấu đối kháng 2 người trực tiếp'} • 10 câu hỏi ngẫu nhiên
            </p>
          </div>
        </div>

        {/* Mode Switchers Bar */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Opponent Mode Selector (2 Người vs Chơi Với Máy) */}
          <div className="flex items-center bg-slate-100/90 p-1 rounded-xl border border-slate-200 shadow-2xs">
            <button
              id="opponent-pvp-btn"
              onClick={() => onChangeOpponentType('pvp')}
              className={`px-3 py-1.5 rounded-lg text-xs font-black flex items-center gap-1.5 transition-all cursor-pointer ${
                opponentType === 'pvp'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
              title="Chơi 2 người (Người vs Người)"
            >
              <Users className="w-3.5 h-3.5" />
              <span>Chơi 2 Người</span>
            </button>

            <button
              id="opponent-ai-btn"
              onClick={() => onChangeOpponentType('ai')}
              className={`px-3 py-1.5 rounded-lg text-xs font-black flex items-center gap-1.5 transition-all cursor-pointer ${
                opponentType === 'ai'
                  ? 'bg-purple-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
              title="Chơi với máy (Đấu với AI bot tự động)"
            >
              <Bot className="w-3.5 h-3.5" />
              <span>Chơi Với Máy</span>
            </button>
          </div>

          {/* AI Difficulty Selector (Only visible in AI mode) */}
          {isAi && (
            <div className="flex items-center bg-purple-50/90 p-1 rounded-xl border border-purple-200 shadow-2xs animate-in fade-in duration-200">
              <span className="text-[11px] font-bold text-purple-900 px-2 hidden sm:inline">
                Độ khó:
              </span>
              <button
                id="ai-diff-easy"
                onClick={() => onChangeAiDifficulty('easy')}
                className={`px-2 py-1 rounded-md text-[11px] font-black transition-all cursor-pointer ${
                  aiDifficulty === 'easy'
                    ? 'bg-emerald-500 text-white shadow-2xs'
                    : 'text-slate-600 hover:text-purple-900'
                }`}
                title="Dễ: Máy trả lời đúng khoảng 50%"
              >
                Dễ
              </button>
              <button
                id="ai-diff-medium"
                onClick={() => onChangeAiDifficulty('medium')}
                className={`px-2 py-1 rounded-md text-[11px] font-black transition-all cursor-pointer ${
                  aiDifficulty === 'medium'
                    ? 'bg-amber-500 text-white shadow-2xs'
                    : 'text-slate-600 hover:text-purple-900'
                }`}
                title="Vừa: Máy trả lời đúng khoảng 75%"
              >
                Vừa
              </button>
              <button
                id="ai-diff-hard"
                onClick={() => onChangeAiDifficulty('hard')}
                className={`px-2 py-1 rounded-md text-[11px] font-black transition-all cursor-pointer ${
                  aiDifficulty === 'hard'
                    ? 'bg-rose-600 text-white shadow-2xs'
                    : 'text-slate-600 hover:text-purple-900'
                }`}
                title="Khó: Máy trả lời đúng khoảng 90%"
              >
                Khó
              </button>
            </div>
          )}

          {/* Format Mode Switcher (Song Song vs Luân Phiên) */}
          <div className="flex items-center bg-slate-100/90 p-1 rounded-xl border border-slate-200 shadow-2xs">
            <button
              id="mode-parallel-btn"
              onClick={() => onChangeMode('parallel')}
              className={`px-2.5 py-1.5 sm:px-3 sm:py-1.5 rounded-lg text-xs font-black flex items-center gap-1.5 transition-all cursor-pointer ${
                gameMode === 'parallel'
                  ? 'bg-amber-500 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
              title="Chế độ thi đấu song song: Hai bên cùng trả lời cùng lúc"
            >
              <Zap className="w-3.5 h-3.5 fill-current" />
              <span className="hidden sm:inline">Đấu</span> Song Song
            </button>

            <button
              id="mode-alternating-btn"
              onClick={() => onChangeMode('alternating')}
              className={`px-2.5 py-1.5 sm:px-3 sm:py-1.5 rounded-lg text-xs font-black flex items-center gap-1.5 transition-all cursor-pointer ${
                gameMode === 'alternating'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
              title="Chế độ luân phiên: Mỗi bên lần lượt trả lời từng câu"
            >
              <Repeat className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Đấu</span> Luân Phiên
            </button>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          <button
            id="manage-questions-btn"
            onClick={() => onOpenQuestionsModal('manage')}
            title="Quản lý ngân hàng câu hỏi (Thêm, Sửa, Xóa)"
            className="px-2.5 py-1.5 sm:px-3 sm:py-1.5 rounded-lg border border-amber-300 bg-amber-50 text-amber-900 hover:bg-amber-100 text-xs font-black flex items-center gap-1.5 shadow-2xs cursor-pointer transition-colors"
          >
            <BookOpen className="w-4 h-4 text-amber-600 shrink-0" />
            <span>Quản lý câu hỏi</span>
          </button>

          <button
            id="rules-toggle-btn"
            onClick={onOpenRules}
            title="Luật chơi"
            className="p-2 sm:px-3 sm:py-1.5 rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 text-xs font-semibold flex items-center gap-1.5 shadow-2xs cursor-pointer transition-colors"
          >
            <HelpCircle className="w-4 h-4 text-amber-600" />
            <span className="hidden sm:inline">Luật chơi</span>
          </button>

          <button
            id="sound-toggle-btn"
            onClick={onToggleSound}
            title={soundEnabled ? 'Tắt âm thanh' : 'Bật âm thanh'}
            className="p-2 sm:px-3 sm:py-1.5 rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 text-xs font-semibold flex items-center gap-1.5 shadow-2xs cursor-pointer transition-colors"
          >
            {soundEnabled ? (
              <>
                <Volume2 className="w-4 h-4 text-emerald-600" />
                <span className="hidden sm:inline">Âm thanh</span>
              </>
            ) : (
              <>
                <VolumeX className="w-4 h-4 text-slate-400" />
                <span className="hidden sm:inline text-slate-400">Tắt tiếng</span>
              </>
            )}
          </button>

          <button
            id="restart-game-btn"
            onClick={onRestart}
            title="Chơi ván mới (Lấy 10 câu hỏi ngẫu nhiên mới)"
            className="p-2 sm:px-3 sm:py-1.5 rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 text-xs font-semibold flex items-center gap-1.5 shadow-2xs cursor-pointer transition-colors"
          >
            <RotateCcw className="w-4 h-4 text-blue-600" />
            <span className="hidden sm:inline">Ván mới</span>
          </button>
        </div>
      </div>

      {/* Two Teams Score Card Banners */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4">
        {/* TEAM 1 CARD */}
        <div
          className={`relative rounded-2xl border-2 transition-all p-3.5 sm:p-4 shadow-sm flex flex-col justify-between ${
            gameMode === 'parallel'
              ? 'bg-emerald-50/80 border-emerald-400 shadow-sm'
              : activeTeamId === 'team1'
              ? 'bg-emerald-50/90 border-emerald-500 shadow-md ring-2 ring-emerald-400/50'
              : 'bg-white border-slate-200 opacity-90'
          }`}
        >
          {gameMode === 'parallel' ? (
            <span className="absolute -top-2.5 left-4 px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-600 text-white shadow-2xs flex items-center gap-1">
              <Zap className="w-2.5 h-2.5 fill-current" /> Đang đấu
            </span>
          ) : activeTeamId === 'team1' ? (
            <span className="absolute -top-2.5 left-4 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-600 text-white shadow-2xs">
              Đang trả lời
            </span>
          ) : null}

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-black text-sm sm:text-base shadow-sm">
                1
              </div>
              <div>
                <h3 className="font-extrabold text-sm sm:text-base text-slate-800 flex items-center gap-1.5">
                  <span>{team1.name}</span>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-200">
                    Người chơi
                  </span>
                </h3>
                <span className="text-[11px] font-medium text-emerald-700">
                  Đã làm: {team1.totalAnswered}/10 câu
                </span>
              </div>
            </div>

            <div className="text-right">
              <div className="text-2xl sm:text-3xl font-black text-emerald-700 font-mono">
                {team1.correctAnswers}
              </div>
              <div className="text-[10px] uppercase font-bold text-slate-400">
                Câu đúng
              </div>
            </div>
          </div>

          {/* Progress dots for 10 questions */}
          <div className="mt-3 flex items-center gap-1">
            {Array.from({ length: 10 }).map((_, i) => {
              const isPassed = i < team1.totalAnswered;
              return (
                <div
                  key={i}
                  className={`h-1.5 flex-1 rounded-full ${
                    isPassed
                      ? i < team1.correctAnswers
                        ? 'bg-emerald-500'
                        : 'bg-slate-300'
                      : 'bg-slate-200'
                  }`}
                  title={`Câu ${i + 1}`}
                />
              );
            })}
          </div>
        </div>

        {/* TEAM 2 CARD (Human or AI) */}
        <div
          className={`relative rounded-2xl border-2 transition-all p-3.5 sm:p-4 shadow-sm flex flex-col justify-between ${
            isAi
              ? activeTeamId === 'team2'
                ? 'bg-purple-50/90 border-purple-500 shadow-md ring-2 ring-purple-400/50'
                : 'bg-purple-50/40 border-purple-200 opacity-90'
              : gameMode === 'parallel'
              ? 'bg-rose-50/80 border-rose-400 shadow-sm'
              : activeTeamId === 'team2'
              ? 'bg-rose-50/90 border-rose-500 shadow-md ring-2 ring-rose-400/50'
              : 'bg-white border-slate-200 opacity-90'
          }`}
        >
          {gameMode === 'parallel' ? (
            <span className={`absolute -top-2.5 right-4 px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider text-white shadow-2xs flex items-center gap-1 ${
              isAi ? 'bg-purple-600' : 'bg-rose-600'
            }`}>
              {isAi ? <Bot className="w-2.5 h-2.5" /> : <Zap className="w-2.5 h-2.5 fill-current" />}
              {isAi ? 'AI Đang đấu' : 'Đang đấu'}
            </span>
          ) : activeTeamId === 'team2' ? (
            <span className={`absolute -top-2.5 right-4 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider text-white shadow-2xs flex items-center gap-1 ${
              isAi ? 'bg-purple-600' : 'bg-rose-600'
            }`}>
              {isAi ? <Bot className="w-2.5 h-2.5" /> : null}
              {isAi ? 'Máy đang trả lời' : 'Đang trả lời'}
            </span>
          ) : null}

          <div className="flex items-center justify-between">
            <div className="text-left">
              <div className={`text-2xl sm:text-3xl font-black font-mono ${
                isAi ? 'text-purple-700' : 'text-rose-700'
              }`}>
                {team2.correctAnswers}
              </div>
              <div className="text-[10px] uppercase font-bold text-slate-400">
                Câu đúng
              </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-3 text-right">
              <div>
                <h3 className="font-extrabold text-sm sm:text-base text-slate-800 flex items-center justify-end gap-1.5">
                  {isAi ? (
                    <span className="text-[10px] font-black px-1.5 py-0.5 rounded bg-purple-100 text-purple-800 border border-purple-200">
                      🤖 BOT AI ({aiDifficulty === 'easy' ? 'Dễ' : aiDifficulty === 'medium' ? 'Vừa' : 'Khó'})
                    </span>
                  ) : (
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-rose-100 text-rose-800 border border-rose-200">
                      Người chơi 2
                    </span>
                  )}
                  <span>{team2.name}</span>
                </h3>
                <span className={`text-[11px] font-medium ${isAi ? 'text-purple-700' : 'text-rose-700'}`}>
                  Đã làm: {team2.totalAnswered}/10 câu
                </span>
              </div>
              <div className={`w-9 h-9 sm:w-11 sm:h-11 rounded-xl text-white flex items-center justify-center font-black text-sm sm:text-base shadow-sm ${
                isAi ? 'bg-purple-600' : 'bg-rose-600'
              }`}>
                {isAi ? '🤖' : '2'}
              </div>
            </div>
          </div>

          {/* Progress dots for 10 questions */}
          <div className="mt-3 flex items-center gap-1">
            {Array.from({ length: 10 }).map((_, i) => {
              const isPassed = i < team2.totalAnswered;
              return (
                <div
                  key={i}
                  className={`h-1.5 flex-1 rounded-full ${
                    isPassed
                      ? i < team2.correctAnswers
                        ? isAi ? 'bg-purple-500' : 'bg-rose-500'
                        : 'bg-slate-300'
                      : 'bg-slate-200'
                  }`}
                  title={`Câu ${i + 1}`}
                />
              );
            })}
          </div>
        </div>
      </div>
    </header>
  );
};
