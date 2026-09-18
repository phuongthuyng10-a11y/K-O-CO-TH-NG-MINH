import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Trophy, Award, RotateCcw, Check, Sparkles, Bot, Users } from 'lucide-react';
import { Team, OpponentType } from '../types';
import { soundFX } from '../utils/sound';

interface VictoryModalProps {
  team1: Team;
  team2: Team;
  ropePosition: number;
  onRestart: () => void;
  opponentType?: OpponentType;
}

export const VictoryModal: React.FC<VictoryModalProps> = ({
  team1,
  team2,
  ropePosition,
  onRestart,
  opponentType = 'pvp',
}) => {
  let winner: Team | null = null;
  let isDraw = false;

  if (ropePosition < 0) {
    winner = team1;
  } else if (ropePosition > 0) {
    winner = team2;
  } else {
    // Nếu vị trí dây bằng 0, xét số câu trả lời đúng
    if (team1.correctAnswers > team2.correctAnswers) {
      winner = team1;
    } else if (team2.correctAnswers > team1.correctAnswers) {
      winner = team2;
    } else {
      isDraw = true;
    }
  }

  useEffect(() => {
    soundFX.playVictory();

    // Bắn pháo hoa giấy mừng chiến thắng
    const duration = 3 * 1000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 4,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
      });
      confetti({
        particleCount: 4,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };
    frame();
  }, []);

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-lg rounded-3xl border border-slate-100 shadow-2xl p-6 sm:p-8 text-center relative overflow-hidden animate-in fade-in zoom-in-95 duration-300">
        {/* Confetti / Trophy header */}
        <div className="w-20 h-20 mx-auto rounded-full bg-amber-100 border-4 border-amber-300 flex items-center justify-center shadow-lg relative">
          <Trophy className="w-10 h-10 text-amber-600 animate-bounce" />
          <Sparkles className="w-5 h-5 text-amber-500 absolute -top-1 -right-1" />
        </div>

        {/* Title & Winner Text */}
        <div className="mt-5">
          <span className="text-xs font-black uppercase tracking-widest text-amber-600 bg-amber-50 px-3 py-1 rounded-full border border-amber-200 inline-flex items-center gap-1.5">
            {opponentType === 'ai' ? (
              <>
                <Bot className="w-3.5 h-3.5 text-purple-600" />
                <span>KẾT QUẢ ĐẤU VỚI MÁY (AI)</span>
              </>
            ) : (
              <>
                <Users className="w-3.5 h-3.5 text-blue-600" />
                <span>KẾT QUẢ ĐẤU 2 NGƯỜI (PVP)</span>
              </>
            )}
          </span>

          {isDraw ? (
            <h2 className="text-2xl sm:text-3xl font-black text-slate-800 mt-2">
              TRẬN ĐẤU HÒA NHAU! 🤝
            </h2>
          ) : (
            <h2 className="text-2xl sm:text-3xl font-black text-slate-800 mt-2">
              {opponentType === 'ai' && winner?.id === 'team1'
                ? '🎉 BẠN ĐÃ CHIẾN THẮNG MÁY TÍNH!'
                : opponentType === 'ai' && winner?.id === 'team2'
                ? '🤖 MÁY TÍNH ĐÃ CHIẾN THẮNG!'
                : `🏆 ${winner?.name} CHIẾN THẮNG!`}
            </h2>
          )}

          <p className="text-sm text-slate-600 mt-1 max-w-xs mx-auto">
            {isDraw
              ? opponentType === 'ai'
                ? 'Bạn và Máy tính bất phân thắng bại! Cả 2 bên đều kéo co xuất sắc.'
                : 'Hai đội có cùng kết quả trả lời xuất sắc và dây kéo co giữ vị trí cân bằng!'
              : opponentType === 'ai'
              ? winner?.id === 'team1'
                ? 'Xuất sắc! Trí tuệ của bạn đã đánh bại thuật toán AI của máy tính và kéo trọn dây về đích.'
                : 'Máy tính với thuật toán thông minh đã vượt lên. Hãy rèn luyện và phục thù ngay!'
              : `Sau 10 câu hỏi cam go, dây kéo co đã nghiêng trọn vẹn về phần sân của ${winner?.name}!`}
          </p>
        </div>

        {/* Match Statistics Box */}
        <div className="mt-6 bg-slate-50 border border-slate-200 rounded-2xl p-4 grid grid-cols-2 gap-3 text-left">
          {/* Team 1 stats */}
          <div
            className={`p-3 rounded-xl border ${
              winner?.id === 'team1'
                ? 'bg-emerald-50 border-emerald-300 ring-2 ring-emerald-400'
                : 'bg-white border-slate-200'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="font-extrabold text-sm text-emerald-800">
                {team1.name}
              </span>
              {winner?.id === 'team1' && (
                <Award className="w-4 h-4 text-emerald-600" />
              )}
            </div>
            <div className="text-2xl font-black text-emerald-700 mt-1 font-mono">
              {team1.correctAnswers}/10
            </div>
            <div className="text-[11px] text-slate-500">
              Câu trả lời chính xác ({team1.correctAnswers * 10}%)
            </div>
          </div>

          {/* Team 2 stats */}
          <div
            className={`p-3 rounded-xl border ${
              winner?.id === 'team2'
                ? 'bg-rose-50 border-rose-300 ring-2 ring-rose-400'
                : 'bg-white border-slate-200'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="font-extrabold text-sm text-rose-800">
                {team2.name}
              </span>
              {winner?.id === 'team2' && (
                <Award className="w-4 h-4 text-rose-600" />
              )}
            </div>
            <div className="text-2xl font-black text-rose-700 mt-1 font-mono">
              {team2.correctAnswers}/10
            </div>
            <div className="text-[11px] text-slate-500">
              Câu trả lời chính xác ({team2.correctAnswers * 10}%)
            </div>
          </div>
        </div>

        {/* Rope Advantage Summary */}
        <div className="mt-4 text-xs font-semibold text-slate-600 bg-amber-50/70 border border-amber-200/60 rounded-xl p-2.5">
          {ropePosition === 0 ? (
            <span>Dây kéo co kết thúc tại điểm mốc 0m (chính giữa)</span>
          ) : (
            <span>
              Độ lệch dây kéo co:{' '}
              <strong className="text-slate-800">
                {Math.abs(ropePosition)} bước
              </strong>{' '}
              nghiêng về {ropePosition < 0 ? team1.name : team2.name}
            </span>
          )}
        </div>

        {/* Actions */}
        <div className="mt-6 flex flex-col sm:flex-row gap-3">
          <button
            id="play-again-btn"
            onClick={onRestart}
            className="w-full py-3 px-5 rounded-xl font-black text-white bg-gradient-to-r from-amber-500 to-red-500 hover:from-amber-600 hover:to-red-600 shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer text-sm"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Chơi Lại Ván Mới (Bộ 10 câu mới)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
