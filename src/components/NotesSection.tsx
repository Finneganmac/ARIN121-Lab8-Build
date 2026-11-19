import React from 'react';
import { Sparkles, Trash2, BookMarked, Lightbulb } from 'lucide-react';
import { SAMPLE_NOTES, SampleTopic } from '../sampleNotes';

interface NotesSectionProps {
  notes: string;
  onNotesChange: (notes: string) => void;
  onGenerateQuiz: () => void;
  isLoading: boolean;
  hasQuiz: boolean;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

export const NotesSection: React.FC<NotesSectionProps> = ({
  notes,
  onNotesChange,
  onGenerateQuiz,
  isLoading,
  hasQuiz,
  isCollapsed,
  onToggleCollapse,
}) => {
  const wordCount = notes.trim() ? notes.trim().split(/\s+/).length : 0;
  const charCount = notes.length;

  const handleSelectSample = (topic: SampleTopic) => {
    onNotesChange(topic.content);
  };

  const handleClear = () => {
    if (notes && !confirm('Are you sure you want to clear the notes?')) {
      return;
    }
    onNotesChange('');
  };

  return (
    <div className="bg-white rounded-2xl border border-stone-200 shadow-xs overflow-hidden transition-all">
      <div className="px-5 py-4 border-b border-stone-100 flex flex-wrap items-center justify-between gap-2 bg-stone-50/70">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center font-semibold text-xs">
            1
          </div>
          <div>
            <h2 className="text-sm font-semibold text-stone-900">Study Notes Material</h2>
            <p className="text-xs text-stone-500">
              Paste lectures, textbook excerpts, or choose an example below
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {hasQuiz && onToggleCollapse && (
            <button
              onClick={onToggleCollapse}
              type="button"
              className="text-xs font-medium text-stone-600 hover:text-stone-900 px-2.5 py-1 rounded-md hover:bg-stone-200/60 transition-colors"
            >
              {isCollapsed ? 'Show Notes' : 'Hide Notes'}
            </button>
          )}
          {notes && !isCollapsed && (
            <button
              onClick={handleClear}
              type="button"
              className="flex items-center gap-1 text-xs text-stone-500 hover:text-rose-600 px-2 py-1 rounded-md hover:bg-rose-50 transition-colors"
              title="Clear notes"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear</span>
            </button>
          )}
        </div>
      </div>

      {!isCollapsed && (
        <div className="p-5 space-y-4">
          {/* Quick sample topics */}
          <div>
            <div className="flex items-center gap-1.5 text-xs font-medium text-stone-500 mb-2">
              <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
              <span>Try a sample topic:</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {SAMPLE_NOTES.map((sample) => (
                <button
                  key={sample.title}
                  type="button"
                  onClick={() => handleSelectSample(sample)}
                  className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border border-stone-200 bg-white hover:bg-stone-50 text-stone-700 hover:text-indigo-600 hover:border-indigo-200 transition-colors"
                >
                  <BookMarked className="w-3 h-3 text-indigo-500" />
                  <span>{sample.title}</span>
                  <span className="text-[10px] text-stone-400 bg-stone-100 px-1.5 py-0.5 rounded">
                    {sample.tag}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Textarea */}
          <div className="relative">
            <label htmlFor="study-notes-input" className="sr-only">
              Study notes text box
            </label>
            <textarea
              id="study-notes-input"
              value={notes}
              onChange={(e) => onNotesChange(e.target.value)}
              placeholder="Paste or write your study notes here... (e.g., key concepts, definitions, historical dates, scientific facts)"
              rows={8}
              className="w-full p-4 rounded-xl border border-stone-200 bg-stone-50/30 text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 text-sm leading-relaxed resize-y font-mono sm:font-sans transition-colors"
            />
            <div className="flex items-center justify-between mt-1.5 px-1 text-xs text-stone-500">
              <span>
                {wordCount} {wordCount === 1 ? 'word' : 'words'} · {charCount} characters
              </span>
              <span>Needs sufficient detail for 3 quality questions</span>
            </div>
          </div>

          {/* Action Button */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-1">
            <p className="text-xs text-stone-500 order-2 sm:order-1">
              AI will generate 3 numbered multiple-choice questions (A, B, C, D) with hidden answers.
            </p>

            <button
              onClick={onGenerateQuiz}
              disabled={isLoading || notes.trim().length === 0}
              type="button"
              className={`w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl font-medium text-sm text-white shadow-sm transition-all order-1 sm:order-2 ${
                isLoading || notes.trim().length === 0
                  ? 'bg-stone-300 cursor-not-allowed text-stone-500'
                  : 'bg-indigo-600 hover:bg-indigo-700 active:scale-[0.99] shadow-indigo-200 hover:shadow-indigo-300'
              }`}
            >
              {isLoading ? (
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
                  <span>Generating 3 Questions...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>{hasQuiz ? 'Regenerate Quiz' : 'Generate Quiz'}</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
