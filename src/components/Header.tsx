import React from 'react';
import { BookOpen, Sparkles, RotateCcw } from 'lucide-react';

interface HeaderProps {
  onResetAll?: () => void;
  hasActiveQuiz?: boolean;
}

export const Header: React.FC<HeaderProps> = ({ onResetAll, hasActiveQuiz }) => {
  return (
    <header className="border-b border-stone-200 bg-white/95 backdrop-blur-xs sticky top-0 z-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-sm shadow-indigo-200">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-stone-900 leading-tight flex items-center gap-2">
              StudyQuiz
              <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100 flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> AI Powered
              </span>
            </h1>
            <p className="text-xs text-stone-500">
              Interactive 3-Question Quiz & Instant Grader
            </p>
          </div>
        </div>

        {hasActiveQuiz && onResetAll && (
          <button
            onClick={onResetAll}
            type="button"
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-lg transition-colors border border-stone-200"
            title="Start fresh with new notes"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Start Fresh</span>
          </button>
        )}
      </div>
    </header>
  );
};
