import React from 'react';
import { X, CheckCircle2, HelpCircle, Flame, ShieldAlert, Award } from 'lucide-react';

interface RulesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RulesModal: React.FC<RulesModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-lg rounded-3xl border border-slate-200 shadow-2xl p-6 sm:p-7 relative overflow-hidden animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          id="close-rules-btn"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
          <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-black">
            <HelpCircle className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-black text-slate-800">
              Luật Chơi Kéo Co Tri Thức
            </h2>
            <p className="text-xs text-slate-500">
              Thể lệ thi đấu đối kháng câu hỏi &amp; kéo dây
            </p>
          </div>
        </div>

        {/* Rule Items */}
        <div className="mt-5 space-y-3 text-sm text-slate-700">
          <div className="flex items-start gap-3 p-3 rounded-xl bg-amber-50/80 border border-amber-200">
            <Flame className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <strong className="text-amber-950 font-bold block mb-0.5">
                1. Hai Chế Độ Thi Đấu Linh Hoạt
              </strong>
              <ul className="list-disc list-inside space-y-1 text-slate-600 text-xs mt-1">
                <li>
                  <span className="font-bold text-amber-900">⚡ Chế độ Song Song (Mới):</span> Cả 2 đội cùng nhìn thấy câu hỏi và làm bài độc lập cùng lúc. Bất kỳ đội nào trả lời đúng là dây lập tức giật về phía đội đó ngay. Đua tốc độ cực kỳ kịch tính!
                </li>
                <li>
                  <span className="font-bold text-blue-900">🔄 Chế độ Luân Phiên:</span> Đội 1 trả lời xong đến lượt Đội 2, phù hợp cho lớp học hoặc thi đấu theo thứ tự.
                </li>
              </ul>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 rounded-xl bg-emerald-50/70 border border-emerald-200">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <strong className="text-emerald-950 font-bold block mb-0.5">
                2. 10 Câu Hỏi Bất Kì &amp; Độc Lập Hoàn Toàn
              </strong>
              Mỗi đội nhận đúng 10 câu hỏi ngẫu nhiên từ ngân hàng 60+ câu hỏi đa dạng và 100% không trùng lặp giữa 2 đội.
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 rounded-xl bg-blue-50/70 border border-blue-200">
            <ShieldAlert className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
            <div>
              <strong className="text-blue-950 font-bold block mb-0.5">
                3. Quy Tắc Kéo Dây
              </strong>
              <ul className="list-disc list-inside space-y-1 text-slate-600 text-xs mt-1">
                <li>
                  Khi <span className="font-semibold text-emerald-700">Đội 1 trả lời đúng</span>: Dây kéo co lập tức di chuyển về phía sân Đội 1 (-1 bước).
                </li>
                <li>
                  Khi <span className="font-semibold text-rose-700">Đội 2 trả lời đúng</span>: Dây kéo co lập tức di chuyển về phía sân Đội 2 (+1 bước).
                </li>
                <li>
                  Nếu trả lời sai: <span className="font-semibold text-slate-700">Dây kéo co vẫn đứng yên tại chỗ!</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 rounded-xl bg-purple-50/70 border border-purple-200">
            <Award className="w-5 h-5 text-purple-600 shrink-0 mt-0.5" />
            <div>
              <strong className="text-purple-950 font-bold block mb-0.5">
                4. Điều Kiện Thắng Cuộc
              </strong>
              Sau 10 câu hỏi của cả hai đội, đội nào kéo được dây về phía sân của mình (hoặc có số câu đúng nhiều hơn nếu ở vạch giữa) sẽ giành chiến thắng chung cuộc!
            </div>
          </div>
        </div>

        {/* Dismiss Button */}
        <div className="mt-6">
          <button
            id="understood-rules-btn"
            onClick={onClose}
            className="w-full py-2.5 px-4 rounded-xl font-bold text-white bg-slate-800 hover:bg-slate-900 transition-colors text-sm cursor-pointer"
          >
            Đã hiểu, sẵn sàng chơi!
          </button>
        </div>
      </div>
    </div>
  );
};
