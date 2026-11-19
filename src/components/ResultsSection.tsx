import React from 'react';
import { GradeResponse, QuizQuestion } from '../types';
import {
  CheckCircle2,
  XCircle,
  HelpCircle,
  RotateCcw,
  Sparkles,
  Trophy,
  ArrowUpRight,
  BookOpen,
} from 'lucide-react';

interface ResultsSectionProps {
  gradeResponse: GradeResponse;
  questions: QuizQuestion[];
  onRetakeQuiz: () => void;
  onRequestNewQuiz: () => void;
  onEditNotes: () => void;
}

export const ResultsSection: React.FC<ResultsSectionProps> = ({
  gradeResponse,
  questions,
  onRetakeQuiz,
  onRequestNewQuiz,
  onEditNotes,
}) => {
  const { score, total, summary, needsClarification, clarificationMessage, results } =
    gradeResponse;

  const percentage = Math.round((score / total) * 100);

  // Score badge details
  const getScoreBadge = () => {
    if (score === 3) {
      return {
        label: 'Perfect Score!',
        color: 'bg-emerald-100 text-emerald-800 border-emerald-300',
        textColor: 'text-emerald-700',
        sub: 'Mastery achieved on this material.',
      };
    }
    if (score === 2) {
      return {
        label: 'Great Effort!',
        color: 'bg-indigo-100 text-indigo-800 border-indigo-300',
        textColor: 'text-indigo-700',
        sub: 'Solid understanding with minor review needed.',
      };
    }
    if (score === 1) {
      return {
        label: 'Keep Reviewing',
        color: 'bg-amber-100 text-amber-800 border-amber-300',
        textColor: 'text-amber-700',
        sub: 'Review the explanations below and try again.',
      };
    }
    return {
      label: 'Needs Review',
      color: 'bg-rose-100 text-rose-800 border-rose-300',
      textColor: 'text-rose-700',
      sub: 'Review the study notes and retake the quiz.',
    };
  };

  const badge = getScoreBadge();

  return (
    <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
      {/* Top Banner with Score */}
      <div className="p-6 sm:p-8 bg-stone-50 border-b border-stone-200">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-stone-500">
                Quiz Assessment Results
              </span>
              <span
                className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${badge.color}`}
              >
                {badge.label}
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
              Score: {score} / {total}{' '}
              <span className="text-stone-400 font-normal text-lg sm:text-xl">
                ({percentage}%)
              </span>
            </h2>
            <p className="text-sm text-stone-600 max-w-xl leading-relaxed">
              {summary || badge.sub}
            </p>
          </div>

          <div className="flex items-center justify-center">
            <div className="w-24 h-24 rounded-2xl bg-white border-2 border-stone-200 flex flex-col items-center justify-center shadow-xs">
              <Trophy className={`w-8 h-8 mb-1 ${badge.textColor}`} />
              <span className="text-xs font-bold text-stone-800">
                {score} of {total} Correct
              </span>
            </div>
          </div>
        </div>

        {/* Clarification prompt if any answer was missing or unclear */}
        {needsClarification && clarificationMessage && (
          <div className="mt-5 p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 flex items-start gap-3">
            <HelpCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div className="text-xs sm:text-sm">
              <p className="font-semibold text-amber-950">Clarification Needed</p>
              <p className="text-amber-800 mt-0.5 leading-relaxed">
                {clarificationMessage}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Question by question feedback */}
      <div className="p-5 sm:p-8 space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-stone-900">
            Question Explanations & Corrections
          </h3>
          <span className="text-xs text-stone-500">
            {results.filter((r) => r.isCorrect).length} Correct ·{' '}
            {results.filter((r) => !r.isCorrect).length} Incorrect
          </span>
        </div>

        <div className="space-y-6">
          {questions.map((question) => {
            const resultItem = results.find((r) => r.questionId === question.id);
            const isCorrect = resultItem?.isCorrect ?? false;
            const studentAns = resultItem?.studentAnswer || 'None';
            const correctOpt = resultItem?.correctOption || '';
            const explanation = resultItem?.explanation || '';

            // Find option text for student answer and correct answer
            const studentOptionObj = question.options.find((o) => o.label === studentAns);
            const correctOptionObj = question.options.find((o) => o.label === correctOpt);

            return (
              <div
                key={question.id}
                className={`p-5 rounded-xl border transition-all ${
                  isCorrect
                    ? 'border-emerald-200 bg-emerald-50/20'
                    : 'border-rose-200 bg-rose-50/20'
                }`}
              >
                {/* Question title and correct/incorrect status */}
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-start gap-2.5">
                    <span
                      className={`inline-flex items-center justify-center w-6 h-6 rounded-md text-xs font-bold text-white shrink-0 mt-0.5 ${
                        isCorrect ? 'bg-emerald-600' : 'bg-rose-600'
                      }`}
                    >
                      {question.id}
                    </span>
                    <h4 className="text-sm sm:text-base font-semibold text-stone-900">
                      {question.question}
                    </h4>
                  </div>

                  <span
                    className={`inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full shrink-0 ${
                      isCorrect
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-rose-100 text-rose-800'
                    }`}
                  >
                    {isCorrect ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Correct</span>
                      </>
                    ) : (
                      <>
                        <XCircle className="w-3.5 h-3.5 text-rose-600" />
                        <span>Incorrect</span>
                      </>
                    )}
                  </span>
                </div>

                {/* Answer Summary Card */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4 text-xs sm:text-sm">
                  {/* Student Answer */}
                  <div
                    className={`p-3 rounded-lg border ${
                      isCorrect
                        ? 'bg-emerald-50/70 border-emerald-200 text-emerald-950'
                        : 'bg-rose-50/70 border-rose-200 text-rose-950'
                    }`}
                  >
                    <span className="text-[11px] font-semibold uppercase tracking-wider block opacity-75">
                      Your Answer:
                    </span>
                    <div className="font-semibold mt-0.5">
                      Option {studentAns}
                      {studentOptionObj ? `: ${studentOptionObj.text}` : ''}
                    </div>
                  </div>

                  {/* Correct Answer */}
                  <div
                    className={`p-3 rounded-lg border ${
                      isCorrect
                        ? 'bg-emerald-50/70 border-emerald-200 text-emerald-950'
                        : 'bg-emerald-100/70 border-emerald-300 text-emerald-950 font-medium'
                    }`}
                  >
                    <span className="text-[11px] font-semibold uppercase tracking-wider block text-emerald-800">
                      Correct Option:
                    </span>
                    <div className="font-semibold mt-0.5 text-emerald-900">
                      Option {correctOpt}
                      {correctOptionObj ? `: ${correctOptionObj.text}` : ''}
                    </div>
                  </div>
                </div>

                {/* Explanation */}
                {explanation && (
                  <div className="mt-4 p-3.5 rounded-lg bg-white border border-stone-200/80 text-stone-700 text-xs sm:text-sm leading-relaxed">
                    <span className="font-semibold text-stone-900 block mb-1">
                      {isCorrect ? 'Why this is correct:' : 'Explanation & Correction:'}
                    </span>
                    <p>{explanation}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Action Controls (Avoid generating another quiz unless student requests one) */}
        <div className="pt-6 border-t border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            onClick={onEditNotes}
            type="button"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl border border-stone-200 text-stone-700 hover:text-stone-900 hover:bg-stone-50 text-xs sm:text-sm font-medium transition-colors"
          >
            <BookOpen className="w-4 h-4 text-stone-500" />
            <span>Edit Notes</span>
          </button>

          <div className="flex flex-col sm:flex-row items-center gap-2.5 w-full sm:w-auto">
            <button
              onClick={onRetakeQuiz}
              type="button"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl border border-stone-300 bg-white hover:bg-stone-50 text-stone-800 text-xs sm:text-sm font-semibold transition-all shadow-xs"
            >
              <RotateCcw className="w-4 h-4 text-stone-500" />
              <span>Retake This Quiz</span>
            </button>

            <button
              onClick={onRequestNewQuiz}
              type="button"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-semibold transition-all shadow-sm shadow-indigo-200"
            >
              <Sparkles className="w-4 h-4" />
              <span>Generate New Quiz</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
