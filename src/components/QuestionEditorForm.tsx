import React, { useState, useEffect } from 'react';
import { Check, X, Sparkles, HelpCircle, AlertCircle, Save, Tag } from 'lucide-react';
import { Question } from '../types';

interface QuestionEditorFormProps {
  initialQuestion?: Question | null;
  onSave: (questionData: {
    id?: string;
    question: string;
    options: [string, string, string, string];
    correctIndex: number;
    explanation?: string;
    category?: string;
  }) => void;
  onCancel: () => void;
}

const COMMON_CATEGORIES = [
  'Khoa học & Tự nhiên',
  'Thế giới động vật',
  'Khoa học & Vũ trụ',
  'Lịch sử & Địa lý',
  'Sinh học',
  'Vật lý & Hóa học',
  'Toán học & Logic',
  'Văn hóa & Đời sống',
];

export const QuestionEditorForm: React.FC<QuestionEditorFormProps> = ({
  initialQuestion,
  onSave,
  onCancel,
}) => {
  const isEditing = !!initialQuestion;

  const [questionText, setQuestionText] = useState(initialQuestion?.question || '');
  const [optionA, setOptionA] = useState(initialQuestion?.options[0] || '');
  const [optionB, setOptionB] = useState(initialQuestion?.options[1] || '');
  const [optionC, setOptionC] = useState(initialQuestion?.options[2] || '');
  const [optionD, setOptionD] = useState(initialQuestion?.options[3] || '');
  const [correctIndex, setCorrectIndex] = useState<number>(initialQuestion?.correctIndex ?? 0);
  const [category, setCategory] = useState(initialQuestion?.category || 'Khoa học & Tự nhiên');
  const [explanation, setExplanation] = useState(initialQuestion?.explanation || '');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (initialQuestion) {
      setQuestionText(initialQuestion.question);
      setOptionA(initialQuestion.options[0]);
      setOptionB(initialQuestion.options[1]);
      setOptionC(initialQuestion.options[2]);
      setOptionD(initialQuestion.options[3]);
      setCorrectIndex(initialQuestion.correctIndex);
      setCategory(initialQuestion.category || 'Khoa học & Tự nhiên');
      setExplanation(initialQuestion.explanation || '');
    } else {
      setQuestionText('');
      setOptionA('');
      setOptionB('');
      setOptionC('');
      setOptionD('');
      setCorrectIndex(0);
      setCategory('Khoa học & Tự nhiên');
      setExplanation('');
    }
    setErrorMessage(null);
  }, [initialQuestion]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedQuestion = questionText.trim();
    const optA = optionA.trim();
    const optB = optionB.trim();
    const optC = optionC.trim();
    const optD = optionD.trim();

    if (!trimmedQuestion) {
      setErrorMessage('Vui lòng nhập nội dung câu hỏi.');
      return;
    }

    if (!optA || !optB || !optC || !optD) {
      setErrorMessage('Vui lòng nhập đầy đủ cả 4 phương án A, B, C, D.');
      return;
    }

    if (correctIndex < 0 || correctIndex > 3) {
      setErrorMessage('Vui lòng chọn 1 đáp án đúng (A, B, C hoặc D).');
      return;
    }

    onSave({
      id: initialQuestion?.id,
      question: trimmedQuestion,
      options: [optA, optB, optC, optD],
      correctIndex,
      category: category.trim() || 'Tổng hợp',
      explanation: explanation.trim() || undefined,
    });
  };

  const optionLabels = ['A', 'B', 'C', 'D'];
  const optionValues = [optionA, optionB, optionC, optionD];
  const setOptionHandlers = [setOptionA, setOptionB, setOptionC, setOptionD];

  return (
    <div className="bg-amber-50/70 border border-amber-300 rounded-2xl p-4 sm:p-5 shadow-inner">
      <div className="flex items-center justify-between pb-3 border-b border-amber-200 mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-amber-500 text-white flex items-center justify-center font-bold text-sm shadow-xs">
            {isEditing ? '✏️' : '➕'}
          </div>
          <div>
            <h3 className="text-base font-black text-slate-800">
              {isEditing ? 'Chỉnh Sửa Câu Hỏi' : 'Thêm Câu Hỏi Mới'}
            </h3>
            <p className="text-[11px] text-slate-500">
              {isEditing
                ? `Cập nhật câu hỏi ID: ${initialQuestion.id}`
                : 'Thêm câu hỏi mới vào ngân hàng thi đấu kéo co'}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onCancel}
          className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-amber-100 cursor-pointer transition-colors"
          title="Đóng biểu mẫu"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {errorMessage && (
        <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-300 text-rose-800 text-xs flex items-center gap-2 font-medium">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
          <span>{errorMessage}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Nội dung câu hỏi */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            Nội dung câu hỏi <span className="text-rose-600">*</span>
          </label>
          <textarea
            value={questionText}
            onChange={(e) => setQuestionText(e.target.value)}
            rows={3}
            placeholder="Ví dụ: Loài động vật nào chạy nhanh nhất trên cạn?"
            className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 bg-white focus:outline-hidden focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-slate-800 placeholder:text-slate-400"
            required
          />
        </div>

        {/* Thể loại / Chủ đề */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
            <Tag className="w-3.5 h-3.5 text-amber-600" />
            <span>Chủ đề / Môn học</span>
          </label>
          <div className="flex flex-wrap gap-1.5 mb-2">
            {COMMON_CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setCategory(cat)}
                className={`px-2 py-0.5 rounded-md text-[11px] font-medium transition-colors cursor-pointer ${
                  category === cat
                    ? 'bg-amber-600 text-white font-bold'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-amber-100/70'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
          <input
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            placeholder="Nhập chủ đề tùy ý (hoặc chọn bên trên)"
            className="w-full px-3 py-1.5 text-xs rounded-xl border border-slate-300 bg-white focus:outline-hidden focus:ring-2 focus:ring-amber-500 text-slate-800"
          />
        </div>

        {/* 4 Phương án A, B, C, D */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            4 Phương án trả lời &amp; Chọn đáp án đúng <span className="text-rose-600">*</span>
          </label>
          <p className="text-[11px] text-slate-500 mb-2">
            Nhấn vào chữ cái <strong className="text-emerald-700">[A, B, C, D]</strong> hoặc nút tick bên cạnh để đánh dấu đáp án đúng.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {optionLabels.map((label, idx) => {
              const isSelected = correctIndex === idx;
              return (
                <div
                  key={label}
                  className={`p-2.5 rounded-xl border transition-all ${
                    isSelected
                      ? 'border-emerald-500 bg-emerald-50/80 shadow-xs ring-1 ring-emerald-400'
                      : 'border-slate-300 bg-white hover:border-slate-400'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <button
                      type="button"
                      onClick={() => setCorrectIndex(idx)}
                      className={`px-2 py-0.5 rounded-md text-xs font-black flex items-center gap-1 cursor-pointer transition-colors ${
                        isSelected
                          ? 'bg-emerald-600 text-white'
                          : 'bg-slate-200 text-slate-700 hover:bg-emerald-100'
                      }`}
                    >
                      <span>{label}</span>
                      {isSelected && <span>✓ ĐÚNG</span>}
                    </button>

                    <button
                      type="button"
                      onClick={() => setCorrectIndex(idx)}
                      className={`text-[11px] font-semibold flex items-center gap-1 cursor-pointer ${
                        isSelected ? 'text-emerald-700 font-bold' : 'text-slate-400 hover:text-slate-600'
                      }`}
                    >
                      {isSelected ? 'Đáp án chính xác' : 'Chọn làm đáp án đúng'}
                    </button>
                  </div>

                  <input
                    type="text"
                    value={optionValues[idx]}
                    onChange={(e) => setOptionHandlers[idx](e.target.value)}
                    placeholder={`Nhập nội dung phương án ${label}...`}
                    className={`w-full px-2.5 py-1.5 text-xs rounded-lg border focus:outline-hidden ${
                      isSelected
                        ? 'border-emerald-400 bg-white font-semibold text-emerald-950 focus:ring-1 focus:ring-emerald-500'
                        : 'border-slate-200 bg-slate-50/60 text-slate-800 focus:bg-white focus:ring-1 focus:ring-amber-500'
                    }`}
                    required
                  />
                </div>
              );
            })}
          </div>
        </div>

        {/* Giải thích đáp án (tùy chọn) */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
            <HelpCircle className="w-3.5 h-3.5 text-amber-600" />
            <span>Giải thích đáp án (Tùy chọn)</span>
          </label>
          <input
            type="text"
            value={explanation}
            onChange={(e) => setExplanation(e.target.value)}
            placeholder="Ví dụ: Báo săn (Cheetah) có thể đạt tốc độ tối đa lên tới 100-120 km/h."
            className="w-full px-3 py-1.5 text-xs rounded-xl border border-slate-300 bg-white focus:outline-hidden focus:ring-2 focus:ring-amber-500 text-slate-800"
          />
        </div>

        {/* Nút hành động */}
        <div className="flex items-center justify-end gap-2 pt-2 border-t border-amber-200">
          <button
            type="button"
            onClick={onCancel}
            className="px-3.5 py-2 text-xs font-bold rounded-xl border border-slate-300 bg-white text-slate-600 hover:bg-slate-100 cursor-pointer transition-colors"
          >
            Hủy bỏ
          </button>
          <button
            type="submit"
            className="px-4 py-2 text-xs font-black rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-sm flex items-center gap-1.5 cursor-pointer transition-all"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{isEditing ? 'Lưu Thay Đổi' : 'Thêm Vào Ngân Hàng'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
