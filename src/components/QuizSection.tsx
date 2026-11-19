import React from 'react';
import { QuizQuestion } from '../types';
import { HelpCircle, Send, Check, AlertCircle } from 'lucide-react';

interface QuizSectionProps {
  questions: QuizQuestion[];
  instructionsPrompt?: string;
  selectedAnswers: Record<number, string>;
  onSelectAnswer: (questionId: number, optionLabel: string) => void;
  onSubmit: (submissionCode: string) => void;
  isGrading: boolean;
  onClearAnswers: () => void;
}

export const QuizSection: React.FC<QuizSectionProps> = ({
  questions,
  instructionsPrompt,
  selectedAnswers,
  onSelectAnswer,
  onSubmit,
  isGrading,
  onClearAnswers,
}) => {
  // Build standard formatted string, e.g. "1B, 2D, 3A"
  const formattedAnswers = questions
    .map((q) => {
      const ans = selectedAnswers[q.id];
      return ans ? `${q.id}${ans}` : null;
    })
    .filter(Boolean)
    .join(', ');

  const answeredCount = Object.keys(selectedAnswers).filter((k) => selectedAnswers[Number(k)]).length;
  const isComplete = answeredCount === questions.length;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formattedAnswers);
  };

  return (
    <div className="bg-white rounded-2xl border border-stone-200 shadow-xs overflow-hidden">
      {/* Header bar */}
      <div className="px-5 py-4 border-b border-stone-100 bg-stone-50/70 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-semibold text-xs shadow-xs shadow-indigo-200">
            2
          </div>
          <div>
            <h2 className="text-sm font-semibold text-stone-900">Quiz: 3 Questions</h2>
            <p className="text-xs text-stone-500">
              Select one option for each question below
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-medium px-2.5 py-1 rounded-md bg-stone-100 text-stone-700">
            {answeredCount} of {questions.length} answered
          </span>
          {answeredCount > 0 && (
            <button
              onClick={onClearAnswers}
              type="button"
              className="text-xs text-stone-500 hover:text-stone-800 hover:underline px-2 py-1"
            >
              Reset selections
            </button>
          )}
        </div>
      </div>

      <div className="p-5 sm:p-6 space-y-6">
        {/* Instruction Banner as required by AI prompt */}
        <div className="p-4 rounded-xl bg-amber-50/80 border border-amber-200 text-amber-900 flex items-start gap-3">
          <HelpCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="text-xs sm:text-sm space-y-1">
            <p className="font-semibold text-amber-950">Instructions for Submission</p>
            <p className="text-amber-800 leading-relaxed">
              {instructionsPrompt ||
                'Please submit your answers using question numbers and option labels, such as 1B, 2D, 3A. Select an option for each question or use the submission format below.'}
            </p>
          </div>
        </div>

        {/* 3 Questions */}
        <div className="space-y-6">
          {questions.map((question) => {
            const currentSelection = selectedAnswers[question.id];

            return (
              <div
                key={question.id}
                className="p-5 rounded-xl border border-stone-200/90 bg-stone-50/20 hover:border-stone-300 transition-colors"
              >
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-start gap-2.5">
                    <span className="inline-flex items-center justify-center w-6 h-6 rounded-md bg-stone-800 text-white text-xs font-bold shrink-0 mt-0.5">
                      {question.id}
                    </span>
                    <h3 className="text-base font-semibold text-stone-900 leading-snug">
                      {question.question}
                    </h3>
                  </div>
                  {currentSelection && (
                    <span className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 shrink-0">
                      <Check className="w-3 h-3" /> Selected {currentSelection}
                    </span>
                  )}
                </div>

                {/* 4 Options: A, B, C, D */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mt-4">
                  {question.options.map((option) => {
                    const isSelected = currentSelection === option.label;

                    return (
                      <button
                        key={option.label}
                        type="button"
                        onClick={() => onSelectAnswer(question.id, option.label)}
                        className={`text-left p-3.5 rounded-xl border transition-all flex items-start gap-3 text-sm group ${
                          isSelected
                            ? 'border-indigo-600 bg-indigo-50/70 text-indigo-950 ring-2 ring-indigo-500/20 font-medium'
                            : 'border-stone-200 bg-white hover:border-stone-300 hover:bg-stone-50 text-stone-800'
                        }`}
                      >
                        <span
                          className={`w-6 h-6 rounded-lg text-xs font-bold flex items-center justify-center shrink-0 transition-colors ${
                            isSelected
                              ? 'bg-indigo-600 text-white'
                              : 'bg-stone-100 text-stone-600 group-hover:bg-stone-200'
                          }`}
                        >
                          {option.label}
                        </span>
                        <span className="leading-relaxed text-stone-800">{option.text}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Current Submission String preview & Submission Controls */}
        <div className="pt-4 border-t border-stone-100 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-xl bg-stone-100/70 border border-stone-200">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-stone-500 block">
                Submission Format
              </span>
              <div className="text-sm font-mono font-medium text-stone-900 mt-0.5">
                {formattedAnswers || (
                  <span className="text-stone-400 italic">None selected yet (e.g. 1B, 2D, 3A)</span>
                )}
              </div>
            </div>

            <div className="text-xs text-stone-500 sm:text-right">
              {isComplete ? (
                <span className="text-emerald-600 font-medium flex items-center gap-1 sm:justify-end">
                  <Check className="w-3.5 h-3.5" /> All 3 questions answered
                </span>
              ) : (
                <span className="text-amber-600 font-medium flex items-center gap-1 sm:justify-end">
                  <AlertCircle className="w-3.5 h-3.5" /> {questions.length - answeredCount} unanswered
                </span>
              )}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-center justify-end gap-3">
            <button
              type="submit"
              disabled={isGrading}
              className={`w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3 rounded-xl font-medium text-sm text-white shadow-sm transition-all ${
                isGrading
                  ? 'bg-stone-300 cursor-not-allowed text-stone-500'
                  : 'bg-emerald-600 hover:bg-emerald-700 active:scale-[0.99] shadow-emerald-200 hover:shadow-emerald-300'
              }`}
            >
              {isGrading ? (
                <>
                  <svg
                    className="animate-spin h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  <span>Grading Answers Against Notes...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Submit Answers</span>
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
