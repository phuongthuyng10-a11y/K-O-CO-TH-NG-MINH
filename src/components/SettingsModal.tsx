import React, { useState } from 'react';
import { X, Settings, Users, Clock, Check, Zap, Repeat, Bot, Sparkles } from 'lucide-react';
import { GameMode, OpponentType, AiDifficulty } from '../types';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  team1Name: string;
  team2Name: string;
  timeLimit: number | null; // null = unlimited, otherwise seconds
  gameMode: GameMode;
  opponentType: OpponentType;
  aiDifficulty: AiDifficulty;
  onSave: (settings: {
    team1Name: string;
    team2Name: string;
    timeLimit: number | null;
    gameMode: GameMode;
    opponentType: OpponentType;
    aiDifficulty: AiDifficulty;
  }) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  team1Name,
  team2Name,
  timeLimit,
  gameMode,
  opponentType,
  aiDifficulty,
  onSave,
}) => {
  const [t1Name, setT1Name] = useState(team1Name);
  const [t2Name, setT2Name] = useState(team2Name);
  const [selectedTimer, setSelectedTimer] = useState<number | null>(timeLimit);
  const [selectedMode, setSelectedMode] = useState<GameMode>(gameMode);
  const [selectedOpponent, setSelectedOpponent] = useState<OpponentType>(opponentType);
  const [selectedDifficulty, setSelectedDifficulty] = useState<AiDifficulty>(aiDifficulty);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      team1Name: t1Name.trim() || 'Đội 1',
      team2Name: t2Name.trim() || (selectedOpponent === 'ai' ? 'Máy Tính (AI)' : 'Đội 2'),
      timeLimit: selectedTimer,
      gameMode: selectedMode,
      opponentType: selectedOpponent,
      aiDifficulty: selectedDifficulty,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-3xl border border-slate-200 shadow-2xl p-6 relative overflow-hidden animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
        <button
          id="close-settings-btn"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
          <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-black">
            <Settings className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-black text-slate-800">Cài Đặt Trận Đấu</h2>
            <p className="text-xs text-slate-500">Tùy chỉnh đối thủ, tên đội và thời gian làm bài</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          {/* Opponent Mode (2 Người vs Chơi với máy) */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5 mb-2">
              <Users className="w-4 h-4 text-purple-600" />
              Chế Độ Người Chơi
            </label>
            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                id="settings-opponent-pvp"
                onClick={() => {
                  setSelectedOpponent('pvp');
                  if (t2Name === 'Máy Tính (AI)') setT2Name('Đội 2 (Đỏ Rực)');
                }}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col gap-1 ${
                  selectedOpponent === 'pvp'
                    ? 'bg-emerald-50/90 border-emerald-400 ring-2 ring-emerald-300 text-emerald-950'
                    : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center gap-1.5 font-black text-xs">
                  <Users className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Chơi 2 Người (PvP)</span>
                </div>
                <span className="text-[11px] text-slate-500 leading-tight">
                  2 người chơi cùng trả lời trên 1 máy tính.
                </span>
              </button>

              <button
                type="button"
                id="settings-opponent-ai"
                onClick={() => {
                  setSelectedOpponent('ai');
                  if (t2Name.includes('Đội 2')) setT2Name('Máy Tính (AI)');
                }}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col gap-1 ${
                  selectedOpponent === 'ai'
                    ? 'bg-purple-50/90 border-purple-400 ring-2 ring-purple-300 text-purple-950'
                    : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center gap-1.5 font-black text-xs">
                  <Bot className="w-3.5 h-3.5 text-purple-600" />
                  <span>Chơi Với Máy (AI)</span>
                </div>
                <span className="text-[11px] text-slate-500 leading-tight">
                  Đấu trí với máy tính thông minh tự động trả lời.
                </span>
              </button>
            </div>
          </div>

          {/* AI Difficulty (Only if AI is selected) */}
          {selectedOpponent === 'ai' && (
            <div className="p-3 rounded-2xl bg-purple-50/70 border border-purple-200 animate-in fade-in duration-200">
              <label className="text-xs font-bold uppercase tracking-wider text-purple-900 flex items-center gap-1.5 mb-2">
                <Sparkles className="w-4 h-4 text-purple-600" />
                Độ Khó Của Máy Tính
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'easy', label: 'Dễ (50%)', desc: 'Máy thỉnh thoảng trả lời đúng', color: 'emerald' },
                  { id: 'medium', label: 'Vừa (75%)', desc: 'Máy trả lời khá chính xác', color: 'amber' },
                  { id: 'hard', label: 'Khó (90%)', desc: 'Máy cực kỳ thông minh', color: 'rose' },
                ].map((diff) => (
                  <button
                    key={diff.id}
                    type="button"
                    onClick={() => setSelectedDifficulty(diff.id as AiDifficulty)}
                    className={`py-2 px-1.5 text-center rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                      selectedDifficulty === diff.id
                        ? 'bg-purple-600 text-white border-purple-600 shadow-xs'
                        : 'bg-white text-slate-700 border-purple-200 hover:bg-purple-100/50'
                    }`}
                  >
                    {diff.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Team Names */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5 mb-2">
              <Users className="w-4 h-4 text-emerald-600" />
              Tên Hiển Thị
            </label>
            <div className="space-y-2.5">
              <div>
                <span className="text-xs font-medium text-slate-600 block mb-1">
                  Người chơi 1 (Màu Xanh):
                </span>
                <input
                  type="text"
                  value={t1Name}
                  onChange={(e) => setT1Name(e.target.value)}
                  maxLength={24}
                  placeholder="Nhập tên Người chơi 1..."
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm font-semibold"
                />
              </div>

              <div>
                <span className="text-xs font-medium text-slate-600 block mb-1">
                  {selectedOpponent === 'ai' ? 'Tên Máy tính (AI):' : 'Người chơi 2 (Màu Đỏ):'}
                </span>
                <input
                  type="text"
                  value={t2Name}
                  onChange={(e) => setT2Name(e.target.value)}
                  maxLength={24}
                  placeholder={selectedOpponent === 'ai' ? 'Máy Tính (AI)' : 'Nhập tên Người chơi 2...'}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-rose-500 text-sm font-semibold"
                />
              </div>
            </div>
          </div>

          {/* Game Mode */}
          <div className="pt-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5 mb-2">
              <Zap className="w-4 h-4 text-amber-600" />
              Chế Độ Thi Đấu
            </label>
            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => setSelectedMode('parallel')}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col gap-1 ${
                  selectedMode === 'parallel'
                    ? 'bg-amber-50/90 border-amber-400 ring-2 ring-amber-300'
                    : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center gap-1.5 font-black text-xs text-amber-900">
                  <Zap className="w-3.5 h-3.5 fill-amber-500 text-amber-600" />
                  <span>Đấu Song Song</span>
                </div>
                <span className="text-[11px] text-slate-500 leading-tight">
                  Hai bên cùng làm câu hỏi cùng lúc trên màn hình.
                </span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedMode('alternating')}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col gap-1 ${
                  selectedMode === 'alternating'
                    ? 'bg-blue-50/90 border-blue-400 ring-2 ring-blue-300'
                    : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center gap-1.5 font-black text-xs text-blue-900">
                  <Repeat className="w-3.5 h-3.5 text-blue-600" />
                  <span>Đấu Luân Phiên</span>
                </div>
                <span className="text-[11px] text-slate-500 leading-tight">
                  Lần lượt trả lời từng câu. Hết 10s chuyển lượt đối phương.
                </span>
              </button>
            </div>
          </div>

          {/* Time Limit per question */}
          <div className="pt-2">
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-amber-600" />
                Thời Gian Trả Lời Mỗi Lượt
              </label>
              <span className="text-[11px] text-amber-700 font-semibold">
                Hết giờ chuyển lượt đối phương
              </span>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {[
                { label: '10s (Chuẩn)', value: 10 },
                { label: '15s', value: 15 },
                { label: '25s', value: 25 },
                { label: 'Không giới hạn', value: null },
              ].map((opt, i) => (
                <button
                  type="button"
                  key={i}
                  onClick={() => setSelectedTimer(opt.value)}
                  className={`py-2 px-1 text-center rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                    selectedTimer === opt.value
                      ? 'bg-amber-600 text-white border-amber-600 shadow-xs'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
            <p className="text-[11px] text-slate-500 mt-1.5 leading-tight">
              ⏱️ Trong chế độ Luân Phiên: Nếu hết 10 giây mà đội không trả lời được, quyền trả lời câu hỏi sẽ lập tức chuyển qua cho đối phương để cướp điểm!
            </p>
          </div>

          {/* Save Button */}
          <div className="pt-4">
            <button
              type="submit"
              className="w-full py-2.5 px-4 rounded-xl font-bold text-white bg-slate-800 hover:bg-slate-900 transition-colors text-sm flex items-center justify-center gap-2 cursor-pointer"
            >
              <Check className="w-4 h-4" />
              Lưu Cài Đặt
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
