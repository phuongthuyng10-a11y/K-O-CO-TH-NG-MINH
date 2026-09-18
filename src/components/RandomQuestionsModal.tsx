import React, { useState, useEffect } from 'react';
import {
  X,
  Shuffle,
  CheckCircle2,
  Copy,
  Check,
  Sparkles,
  BookOpen,
  Plus,
  Pencil,
  Trash2,
  Search,
  Filter,
  RotateCcw,
  AlertCircle,
  FolderKanban,
  Tag,
  CheckSquare,
} from 'lucide-react';
import { Question } from '../types';
import { getRandomUniqueQuestions, QUESTION_BANK } from '../data/questions';
import { QuestionEditorForm } from './QuestionEditorForm';

export type QuestionModalTab = 'manage' | 'team1' | 'team2' | 'preview10';

interface RandomQuestionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  team1Questions: Question[];
  team2Questions: Question[];
  onApplyNewQuestions: (team1: Question[], team2: Question[]) => void;
  customQuestionBank?: Question[];
  onAddQuestion?: (newQ: {
    question: string;
    options: [string, string, string, string];
    correctIndex: number;
    explanation?: string;
    category?: string;
  }) => void;
  onEditQuestion?: (updatedQ: Question) => void;
  onDeleteQuestion?: (id: string) => void;
  onResetQuestions?: () => void;
  initialTab?: QuestionModalTab;
}

export const RandomQuestionsModal: React.FC<RandomQuestionsModalProps> = ({
  isOpen,
  onClose,
  team1Questions,
  team2Questions,
  onApplyNewQuestions,
  customQuestionBank = QUESTION_BANK,
  onAddQuestion,
  onEditQuestion,
  onDeleteQuestion,
  onResetQuestions,
  initialTab = 'manage',
}) => {
  const [activeTab, setActiveTab] = useState<QuestionModalTab>(initialTab);
  const [preview10, setPreview10] = useState<Question[]>(() =>
    getRandomUniqueQuestions(10, [], customQuestionBank)
  );
  const [copied, setCopied] = useState(false);

  // Management tab states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setActiveTab(initialTab);
      setIsAddingNew(false);
      setEditingQuestion(null);
      setDeleteConfirmId(null);
    }
  }, [isOpen, initialTab]);

  const showToast = (msg: string) => {
    setSuccessToast(msg);
    setTimeout(() => {
      setSuccessToast(null);
    }, 2500);
  };

  if (!isOpen) return null;

  const handleGenerateNew10Preview = () => {
    const new10 = getRandomUniqueQuestions(10, [], customQuestionBank);
    setPreview10(new10);
    setActiveTab('preview10');
  };

  const handleApplyNow = () => {
    // Lấy 20 câu hoàn toàn độc lập từ ngân hàng câu hỏi hiện tại
    const t1 = getRandomUniqueQuestions(10, [], customQuestionBank);
    const excludeIds = t1.map((q) => q.id);
    const t2 = getRandomUniqueQuestions(10, excludeIds, customQuestionBank);
    onApplyNewQuestions(t1, t2);
    onClose();
  };

  // Categories list
  const allCategories = Array.from(
    new Set(customQuestionBank.map((q) => q.category || 'Chung'))
  );

  // Filtered list for management tab
  const filteredBank = customQuestionBank.filter((q) => {
    const matchesSearch =
      searchQuery.trim() === '' ||
      q.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.options.some((opt) => opt.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (q.category && q.category.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory =
      selectedCategory === 'all' || q.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const currentList =
    activeTab === 'team1'
      ? team1Questions
      : activeTab === 'team2'
      ? team2Questions
      : activeTab === 'preview10'
      ? preview10
      : filteredBank;

  const handleCopyQuestions = () => {
    const text = currentList
      .map((q, idx) => {
        const optionsText = q.options
          .map(
            (opt, oIdx) =>
              `   ${String.fromCharCode(65 + oIdx)}. ${opt}${
                oIdx === q.correctIndex ? ' (Đúng)' : ''
              }`
          )
          .join('\n');
        return `Câu ${idx + 1} [${q.category || 'Tổng hợp'}]: ${q.question}\n${optionsText}\n   -> Giải thích: ${
          q.explanation || ''
        }\n`;
      })
      .join('\n');

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSaveQuestion = (questionData: {
    id?: string;
    question: string;
    options: [string, string, string, string];
    correctIndex: number;
    explanation?: string;
    category?: string;
  }) => {
    if (questionData.id) {
      // Editing existing question
      if (onEditQuestion) {
        onEditQuestion({
          id: questionData.id,
          question: questionData.question,
          options: questionData.options,
          correctIndex: questionData.correctIndex,
          explanation: questionData.explanation,
          category: questionData.category,
        });
      }
      showToast('Đã cập nhật câu hỏi thành công!');
      setEditingQuestion(null);
    } else {
      // Adding new question
      if (onAddQuestion) {
        onAddQuestion({
          question: questionData.question,
          options: questionData.options,
          correctIndex: questionData.correctIndex,
          explanation: questionData.explanation,
          category: questionData.category,
        });
      }
      showToast('Đã thêm câu hỏi mới vào ngân hàng thành công!');
      setIsAddingNew(false);
    }
  };

  const handleDeleteClick = (id: string) => {
    if (onDeleteQuestion) {
      onDeleteQuestion(id);
      showToast('Đã xóa câu hỏi khỏi ngân hàng!');
      setDeleteConfirmId(null);
    }
  };

  const handleResetConfirm = () => {
    if (
      window.confirm(
        'Bạn có chắc chắn muốn khôi phục lại ngân hàng 50 câu hỏi mặc định? Các câu hỏi tự tạo hoặc chỉnh sửa sẽ được đặt lại.'
      )
    ) {
      if (onResetQuestions) {
        onResetQuestions();
        showToast('Đã khôi phục ngân hàng 50 câu hỏi gốc!');
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-4xl rounded-3xl border border-slate-200 shadow-2xl flex flex-col max-h-[92vh] overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-amber-50/80 via-orange-50/50 to-emerald-50/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-500 text-white flex items-center justify-center shadow-md shrink-0">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-xl font-black text-slate-800 flex items-center gap-2">
                <span>Quản Lý &amp; Ngân Hàng Câu Hỏi</span>
                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300">
                  {customQuestionBank.length} câu
                </span>
              </h2>
              <p className="text-xs text-slate-500 hidden sm:block">
                Thêm, sửa, xóa câu hỏi linh hoạt • Cam kết 100% không trùng lặp giữa 2 đội
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

        {/* Success Toast */}
        {successToast && (
          <div className="bg-emerald-600 text-white px-4 py-2 text-xs font-bold flex items-center justify-between shadow-xs animate-in slide-in-from-top duration-150">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>{successToast}</span>
            </div>
            <button
              onClick={() => setSuccessToast(null)}
              className="text-emerald-100 hover:text-white cursor-pointer"
            >
              ✕
            </button>
          </div>
        )}

        {/* Tabs Bar */}
        <div className="px-3 sm:px-5 py-2.5 border-b border-slate-200/80 bg-slate-50 flex flex-wrap items-center justify-between gap-2">
          {/* Main Tabs */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-200/80 rounded-xl text-xs font-bold overflow-x-auto max-w-full">
            <button
              id="tab-manage-questions"
              onClick={() => {
                setActiveTab('manage');
                setIsAddingNew(false);
                setEditingQuestion(null);
              }}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ${
                activeTab === 'manage'
                  ? 'bg-amber-500 text-white shadow-xs font-black'
                  : 'text-slate-700 hover:text-slate-900 hover:bg-slate-300/50'
              }`}
            >
              <FolderKanban className="w-3.5 h-3.5" />
              <span>Quản lý câu hỏi ({customQuestionBank.length})</span>
            </button>

            <button
              id="tab-team1-questions"
              onClick={() => {
                setActiveTab('team1');
                setIsAddingNew(false);
                setEditingQuestion(null);
              }}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ${
                activeTab === 'team1'
                  ? 'bg-emerald-600 text-white shadow-xs font-black'
                  : 'text-slate-700 hover:text-slate-900 hover:bg-slate-300/50'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-emerald-300" />
              <span>10 câu Đội 1</span>
            </button>

            <button
              id="tab-team2-questions"
              onClick={() => {
                setActiveTab('team2');
                setIsAddingNew(false);
                setEditingQuestion(null);
              }}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ${
                activeTab === 'team2'
                  ? 'bg-rose-600 text-white shadow-xs font-black'
                  : 'text-slate-700 hover:text-slate-900 hover:bg-slate-300/50'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-rose-300" />
              <span>10 câu Đội 2</span>
            </button>

            <button
              id="tab-preview10-questions"
              onClick={() => {
                setActiveTab('preview10');
                setIsAddingNew(false);
                setEditingQuestion(null);
              }}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ${
                activeTab === 'preview10'
                  ? 'bg-blue-600 text-white shadow-xs font-black'
                  : 'text-slate-700 hover:text-slate-900 hover:bg-slate-300/50'
              }`}
            >
              <Shuffle className="w-3.5 h-3.5" />
              <span>Xáo 10 câu mới</span>
            </button>
          </div>

          {/* Quick Actions for Current Tab */}
          <div className="flex items-center gap-2">
            {activeTab === 'manage' ? (
              <button
                id="btn-open-add-question"
                onClick={() => {
                  setEditingQuestion(null);
                  setIsAddingNew((prev) => !prev);
                }}
                className="px-3 py-1.5 text-xs font-black rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-xs flex items-center gap-1.5 cursor-pointer transition-all"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{isAddingNew ? 'Đóng Biểu Mẫu' : 'Thêm Câu Hỏi Mới'}</span>
              </button>
            ) : (
              <button
                id="copy-questions-btn"
                onClick={handleCopyQuestions}
                className="px-2.5 py-1.5 text-xs font-semibold rounded-lg border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 flex items-center gap-1 cursor-pointer transition-colors shadow-2xs"
                title="Sao chép danh sách câu hỏi"
              >
                {copied ? (
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                ) : (
                  <Copy className="w-3.5 h-3.5 text-slate-500" />
                )}
                <span>{copied ? 'Đã sao chép' : 'Sao chép'}</span>
              </button>
            )}

            {activeTab === 'preview10' && (
              <button
                id="re-shuffle-10-btn"
                onClick={handleGenerateNew10Preview}
                className="px-2.5 py-1.5 text-xs font-semibold rounded-lg border border-amber-300 bg-amber-50 text-amber-800 hover:bg-amber-100 flex items-center gap-1 cursor-pointer transition-colors shadow-2xs"
              >
                <Shuffle className="w-3.5 h-3.5 text-amber-600" />
                <span>Xáo lại 10 câu</span>
              </button>
            )}
          </div>
        </div>

        {/* Modal Body Container */}
        <div className="p-3 sm:p-5 overflow-y-auto flex-1 space-y-3">
          {/* TAB 1: QUẢN LÝ CÂU HỎI (THÊM, SỬA, XÓA) */}
          {activeTab === 'manage' && (
            <div className="space-y-4">
              {/* Add/Edit Form when active */}
              {(isAddingNew || editingQuestion) && (
                <QuestionEditorForm
                  initialQuestion={editingQuestion}
                  onSave={handleSaveQuestion}
                  onCancel={() => {
                    setIsAddingNew(false);
                    setEditingQuestion(null);
                  }}
                />
              )}

              {/* Filter and Search Bar */}
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 flex flex-col sm:flex-row items-center justify-between gap-2.5">
                {/* Search */}
                <div className="relative w-full sm:w-72">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Tìm theo nội dung, đáp án..."
                    className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-300 bg-white focus:outline-hidden focus:ring-2 focus:ring-amber-500 text-slate-800"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs"
                    >
                      ✕
                    </button>
                  )}
                </div>

                {/* Category select and reset */}
                <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
                  <div className="flex items-center gap-1 text-xs">
                    <Filter className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                    <select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="px-2.5 py-1.5 text-xs rounded-xl border border-slate-300 bg-white focus:outline-hidden text-slate-700"
                    >
                      <option value="all">Tất cả chủ đề ({customQuestionBank.length})</option>
                      {allCategories.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat} ({customQuestionBank.filter((q) => q.category === cat).length})
                        </option>
                      ))}
                    </select>
                  </div>

                  {onResetQuestions && (
                    <button
                      onClick={handleResetConfirm}
                      title="Khôi phục lại 50 câu hỏi mặc định của hệ thống"
                      className="px-2.5 py-1.5 text-[11px] font-semibold text-slate-600 hover:text-slate-900 border border-slate-300 rounded-xl hover:bg-slate-100 flex items-center gap-1 cursor-pointer transition-colors"
                    >
                      <RotateCcw className="w-3 h-3 text-slate-500" />
                      <span className="hidden sm:inline">Khôi phục gốc</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Status counter */}
              <div className="flex items-center justify-between text-xs text-slate-500 px-1">
                <span>
                  Đang hiển thị{' '}
                  <strong className="text-slate-800">{filteredBank.length}</strong> /{' '}
                  {customQuestionBank.length} câu hỏi
                </span>
                <span className="text-[11px] text-slate-400 italic">
                  💡 Nhấn nút "Sửa" hoặc "Xóa" trên từng câu để điều chỉnh ngân hàng
                </span>
              </div>

              {/* Questions List for Management */}
              {filteredBank.length === 0 ? (
                <div className="text-center py-10 border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50">
                  <p className="text-sm font-bold text-slate-600 mb-1">
                    Không tìm thấy câu hỏi nào phù hợp
                  </p>
                  <p className="text-xs text-slate-400 mb-3">
                    Thử đổi từ khóa tìm kiếm hoặc nhấn nút thêm câu hỏi mới bên trên.
                  </p>
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedCategory('all');
                      setIsAddingNew(true);
                    }}
                    className="px-3 py-1.5 text-xs font-bold rounded-xl bg-amber-500 text-white hover:bg-amber-600 cursor-pointer transition-colors"
                  >
                    + Thêm Câu Hỏi Mới
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredBank.map((q, idx) => (
                    <div
                      key={q.id}
                      className="p-3.5 sm:p-4 rounded-2xl border border-slate-200 bg-white hover:border-slate-300 transition-all shadow-2xs flex flex-col gap-2.5"
                    >
                      {/* Card Top: Number, Category, Actions */}
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="w-6 h-6 rounded-full bg-slate-800 text-white text-xs font-black flex items-center justify-center shrink-0">
                            {idx + 1}
                          </span>
                          {q.category && (
                            <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-amber-50 border border-amber-200 text-amber-900">
                              {q.category}
                            </span>
                          )}
                          <span className="text-[10px] text-slate-400 font-mono">
                            ID: {q.id}
                          </span>
                        </div>

                        {/* Action buttons: Edit & Delete */}
                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            id={`edit-question-${q.id}`}
                            onClick={() => {
                              setIsAddingNew(false);
                              setEditingQuestion(q);
                            }}
                            className="p-1.5 rounded-lg border border-slate-200 hover:border-amber-400 bg-white hover:bg-amber-50 text-slate-600 hover:text-amber-800 text-xs font-semibold flex items-center gap-1 cursor-pointer transition-colors shadow-2xs"
                            title="Sửa câu hỏi này"
                          >
                            <Pencil className="w-3.5 h-3.5 text-amber-600" />
                            <span className="hidden sm:inline">Sửa</span>
                          </button>

                          {deleteConfirmId === q.id ? (
                            <div className="flex items-center gap-1 bg-rose-50 p-1 rounded-lg border border-rose-300">
                              <span className="text-[10px] font-bold text-rose-800 px-1">
                                Xóa?
                              </span>
                              <button
                                onClick={() => handleDeleteClick(q.id)}
                                className="px-2 py-0.5 bg-rose-600 text-white rounded text-[11px] font-bold hover:bg-rose-700 cursor-pointer"
                              >
                                Có
                              </button>
                              <button
                                onClick={() => setDeleteConfirmId(null)}
                                className="px-1.5 py-0.5 bg-slate-200 text-slate-700 rounded text-[11px] hover:bg-slate-300 cursor-pointer"
                              >
                                Hủy
                              </button>
                            </div>
                          ) : (
                            <button
                              id={`delete-question-${q.id}`}
                              onClick={() => setDeleteConfirmId(q.id)}
                              className="p-1.5 rounded-lg border border-slate-200 hover:border-rose-400 bg-white hover:bg-rose-50 text-slate-600 hover:text-rose-700 text-xs font-semibold flex items-center gap-1 cursor-pointer transition-colors shadow-2xs"
                              title="Xóa câu hỏi khỏi ngân hàng"
                            >
                              <Trash2 className="w-3.5 h-3.5 text-rose-500" />
                              <span className="hidden sm:inline">Xóa</span>
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Question Content */}
                      <h3 className="text-sm sm:text-base font-bold text-slate-900 leading-snug">
                        {q.question}
                      </h3>

                      {/* 4 Options */}
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
                                <span
                                  className={`w-4 h-4 rounded text-[10px] font-black flex items-center justify-center ${
                                    isCorrect
                                      ? 'bg-emerald-600 text-white'
                                      : 'bg-slate-300 text-slate-700'
                                  }`}
                                >
                                  {String.fromCharCode(65 + oIdx)}
                                </span>
                                <span>{opt}</span>
                              </span>
                              {isCorrect && (
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                              )}
                            </div>
                          );
                        })}
                      </div>

                      {/* Explanation */}
                      {q.explanation && (
                        <p className="text-xs text-slate-500 italic bg-amber-50/60 p-2 rounded-lg border border-amber-100">
                          💡 <span className="font-semibold text-slate-700">Giải thích:</span>{' '}
                          {q.explanation}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 2, 3, 4: VIEW QUESTIONS FOR TEAMS OR PREVIEW */}
          {activeTab !== 'manage' && (
            <div className="space-y-3">
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
                            <span
                              className={`w-4 h-4 rounded text-[10px] font-black flex items-center justify-center ${
                                isCorrect
                                  ? 'bg-emerald-600 text-white'
                                  : 'bg-slate-300 text-slate-700'
                              }`}
                            >
                              {String.fromCharCode(65 + oIdx)}
                            </span>
                            <span>{opt}</span>
                          </span>
                          {isCorrect && (
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {q.explanation && (
                    <p className="mt-2 text-xs text-slate-500 italic bg-amber-50/60 p-2 rounded-lg border border-amber-100">
                      💡 <span className="font-semibold text-slate-700">Giải thích:</span>{' '}
                      {q.explanation}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 sm:p-4 border-t border-slate-100 bg-slate-50 flex flex-wrap items-center justify-between gap-3">
          <div className="text-xs text-slate-500 hidden sm:block">
            {activeTab === 'manage' ? (
              <span>
                Ngân hàng hiện có <strong>{customQuestionBank.length}</strong> câu. Mọi thay đổi được tự động lưu!
              </span>
            ) : (
              <span>
                Nhấn <strong className="text-slate-700">"Áp dụng vào trận đấu"</strong> để bắt đầu chơi ngay với 2 bộ 10 câu mới!
              </span>
            )}
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
              <span>Áp dụng câu hỏi &amp; Bắt đầu trận mới</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
