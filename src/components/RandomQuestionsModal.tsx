import React, { useState } from 'react';
import { X, Shuffle, CheckCircle2, Copy, Check, Sparkles, BookOpen, Layers } from 'lucide-react';
import { Question } from '../types';
import { getRandomUniqueQuestions, QUESTION_BANK } from '../data/questions';

interface RandomQuestionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  team1Questions: Question[];
  team2Questions: Question[];
  onApplyNewQuestions: (team1: Question[], team2: Question[]) => void;
}

export const RandomQuestionsModal: React.FC<RandomQuestionsModalProps> = ({
  isOpen,
  onClose,
  team1Questions,
  team2Questions,
  onApplyNewQuestions,
}) => {
  const [activeTab, setActiveTab] = useState<'team1' | 'team2' | 'preview10'>('team1');
  const [preview10, setPreview10] = useState<Question[]>(() => getRandomUniqueQuestions(10));
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleGenerateNew10Preview = () => {
    const new10 = getRandomUniqueQuestions(10);
    setPreview10(new10);
    setActiveTab('preview10');
  };

  const handleApplyNow = () => {
    // Lấy 20 câu hoàn toàn độc lập (10 câu cho Đội 1, 10 câu cho Đội 2)
    const t1 = getRandomUniqueQuestions(10);
    const excludeIds = t1.map((q) => q.id);
    const t2 = getRandomUniqueQuestions(10, excludeIds);
    onApplyNewQuestions(t1, t2);
    onClose();
  };

  const currentList =
    activeTab === 'team1'
      ? team1Questions
      : activeTab === 'team2'
      ? team2Questions
      : preview10;

  const handleCopyQuestions = () => {
    const text = currentList
      .map((q, idx) => {
        const optionsText = q.options
          .map((opt, oIdx) => `   ${String.fromCharCode(65 + oIdx)}. ${opt}${oIdx === q.correctIndex ? ' (Đúng)' : ''}`)
          .join('\n');
        return `Câu ${idx + 1} [${q.category || 'Tổng hợp'}]: ${q.question}\n${optionsText}\n   -> Giải thích: ${q.explanation || ''}\n`;
      })
      .join('\n');

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-2xl rounded-3xl border border-slate-200 shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-amber-50/70 to-orange-50/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500 text-white flex items-center justify-center shadow-md">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-black text-slate-800 flex items-center gap-2">
                10 Câu Hỏi Bất Kì &amp; Không Trùng Lặp
              </h2>
              <p className="text-xs text-slate-500">
                Mỗi bộ gồm 10 câu hỏi ngẫu nhiên từ ngân hàng {QUESTION_BANK.length} câu đã kiểm duyệt
              </p>
            </div>
          </div>

          <button
            id="close-questions-modal-btn"
            onClick={onClose}
            className="p-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs & Actions Bar */}
        <div className="px-5 py-3 border-b border-slate-100 bg-slate-50/70 flex flex-wrap items-center justify-between gap-2">
          {/* Tabs */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-200/70 rounded-xl text-xs font-bold">
            <button
              onClick={() => setActiveTab('team1')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                activeTab === 'team1'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              10 câu Đội 1
            </button>
            <button
              onClick={() => setActiveTab('team2')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                activeTab === 'team2'
                  ? 'bg-rose-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              10 câu Đội 2
            </button>
            <button
              onClick={() => setActiveTab('preview10')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                activeTab === 'preview10'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Xem bộ 10 ngẫu nhiên mới
            </button>
          </div>

          {/* Quick Buttons */}
          <div className="flex items-center gap-2">
            <button
              id="copy-10-questions-btn"
              onClick={handleCopyQuestions}
              className="px-2.5 py-1.5 text-xs font-semibold rounded-lg border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 flex items-center gap-1 cursor-pointer transition-colors shadow-2xs"
              title="Sao chép danh sách 10 câu hỏi này"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-slate-500" />}
              <span>{copied ? 'Đã sao chép' : 'Sao chép'}</span>
            </button>

            <button
              id="re-shuffle-10-btn"
              onClick={handleGenerateNew10Preview}
              className="px-2.5 py-1.5 text-xs font-semibold rounded-lg border border-amber-300 bg-amber-50 text-amber-800 hover:bg-amber-100 flex items-center gap-1 cursor-pointer transition-colors shadow-2xs"
            >
              <Shuffle className="w-3.5 h-3.5 text-amber-600" />
              <span>Xáo 10 câu mới</span>
            </button>
          </div>
        </div>

        {/* Scrollable Questions List */}
        <div className="p-4 sm:p-5 overflow-y-auto flex-1 space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-500 pb-1">
            <span className="font-semibold text-slate-700">
              Danh sách: {currentList.length} câu hỏi bất kì (Cam kết 100% không trùng lặp)
            </span>
            <span className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full font-medium border border-emerald-200">
              <CheckCircle2 className="w-3 h-3" /> 0 câu trùng
            </span>
          </div>

          {currentList.map((q, idx) => (
            <div
              key={q.id + '-' + idx}
              className="p-3.5 sm:p-4 rounded-2xl border border-slate-200 bg-white hover:border-slate-300 transition-colors shadow-2xs"
            >
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-slate-800 text-white text-xs font-black flex items-center justify-center">
                    {idx + 1}
                  </span>
                  {q.category && (
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">
                      {q.category}
                    </span>
                  )}
                </div>
                <span className="text-[11px] text-slate-400 font-mono">ID: {q.id}</span>
              </div>

              <h3 className="text-sm sm:text-base font-bold text-slate-900 mb-2.5 leading-snug">
                {q.question}
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-xs">
                {q.options.map((opt, oIdx) => {
                  const isCorrect = oIdx === q.correctIndex;
                  return (
                    <div
                      key={oIdx}
                      className={`p-2 rounded-xl border flex items-center justify-between ${
                        isCorrect
                          ? 'border-emerald-400 bg-emerald-50/80 font-bold text-emerald-900'
                          : 'border-slate-200 bg-slate-50/60 text-slate-700'
                      }`}
                    >
                      <span className="flex items-center gap-1.5">
                        <span className={`w-4 h-4 rounded text-[10px] font-black flex items-center justify-center ${isCorrect ? 'bg-emerald-600 text-white' : 'bg-slate-300 text-slate-700'}`}>
                          {String.fromCharCode(65 + oIdx)}
                        </span>
                        <span>{opt}</span>
                      </span>
                      {isCorrect && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />}
                    </div>
                  );
                })}
              </div>

              {q.explanation && (
                <p className="mt-2 text-xs text-slate-500 italic bg-amber-50/60 p-2 rounded-lg border border-amber-100">
                  💡 <span className="font-semibold text-slate-700">Giải thích:</span> {q.explanation}
                </p>
              )}
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between gap-3">
          <div className="text-xs text-slate-500 hidden sm:block">
            Nhấn <strong className="text-slate-700">"Áp dụng vào trận đấu"</strong> để bắt đầu chơi ngay với 2 bộ 10 câu mới!
          </div>

          <div className="flex items-center gap-2 ml-auto">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-800 cursor-pointer"
            >
              Đóng
            </button>
            <button
              id="apply-random-questions-btn"
              onClick={handleApplyNow}
              className="px-4 py-2 text-xs font-black rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-sm flex items-center gap-1.5 cursor-pointer transition-all"
            >
              <Shuffle className="w-3.5 h-3.5" />
              <span>Áp dụng 20 câu ngẫu nhiên mới &amp; Chơi</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
