import React, { useState, useRef } from 'react';
import { Header } from './components/Header';
import { NotesSection } from './components/NotesSection';
import { QuizSection } from './components/QuizSection';
import { ResultsSection } from './components/ResultsSection';
import { QuizData, GradeResponse } from './types';
import { SAMPLE_NOTES } from './sampleNotes';
import { AlertTriangle, X } from 'lucide-react';

export default function App() {
  // Initialize with the first sample note so user can immediately click Generate Quiz
  const [notes, setNotes] = useState<string>(SAMPLE_NOTES[0].content);
  const [quizData, setQuizData] = useState<QuizData | null>(null);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({});
  const [gradeResponse, setGradeResponse] = useState<GradeResponse | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isGrading, setIsGrading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isNotesCollapsed, setIsNotesCollapsed] = useState(false);

  const quizRef = useRef<HTMLDivElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);
  const notesRef = useRef<HTMLDivElement>(null);

  // Handle generating the quiz
  const handleGenerateQuiz = async () => {
    if (!notes.trim()) {
      setErrorMessage('Please enter or paste your study notes before generating a quiz.');
      return;
    }

    setIsGenerating(true);
    setErrorMessage(null);

    try {
      const response = await fetch('/api/quiz/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notes }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate quiz.');
      }

      setQuizData(data);
      // Reset any previous answers and grading
      setSelectedAnswers({});
      setGradeResponse(null);
      // Collapse notes slightly to give prominence to quiz
      setIsNotesCollapsed(true);

      // Scroll to quiz
      setTimeout(() => {
        quizRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } catch (err: any) {
      console.error(err);
      setErrorMessage(
        err.message || 'An error occurred while generating the quiz. Please try again.'
      );
    } finally {
      setIsGenerating(false);
    }
  };

  // Select an option for a question
  const handleSelectAnswer = (questionId: number, optionLabel: string) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: optionLabel,
    }));
  };

  // Reset selected answers
  const handleClearAnswers = () => {
    setSelectedAnswers({});
  };

  // Submit answers for grading
  const handleSubmitAnswers = async (submissionCode: string) => {
    if (!quizData) return;

    setIsGrading(true);
    setErrorMessage(null);

    try {
      const response = await fetch('/api/quiz/grade', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          notes,
          questions: quizData.questions,
          studentAnswers: selectedAnswers,
          submissionString: submissionCode,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to grade answers.');
      }

      setGradeResponse(data);

      // Scroll to results
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } catch (err: any) {
      console.error(err);
      setErrorMessage(
        err.message || 'An error occurred while grading your answers. Please try again.'
      );
    } finally {
      setIsGrading(false);
    }
  };

  // Retake current quiz
  const handleRetakeQuiz = () => {
    setSelectedAnswers({});
    setGradeResponse(null);
    setTimeout(() => {
      quizRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  // Edit notes
  const handleEditNotes = () => {
    setIsNotesCollapsed(false);
    setTimeout(() => {
      notesRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  // Reset all
  const handleResetAll = () => {
    setQuizData(null);
    setSelectedAnswers({});
    setGradeResponse(null);
    setIsNotesCollapsed(false);
    setErrorMessage(null);
  };

  return (
    <div className="min-h-screen bg-stone-100/70 text-stone-900 flex flex-col font-sans">
      <Header onResetAll={handleResetAll} hasActiveQuiz={Boolean(quizData)} />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 py-8 space-y-8">
        {/* Error notification */}
        {errorMessage && (
          <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-900 flex items-start justify-between gap-3 shadow-xs">
            <div className="flex items-start gap-2.5">
              <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              <div className="text-sm">
                <span className="font-semibold block">Notice</span>
                <span>{errorMessage}</span>
              </div>
            </div>
            <button
              onClick={() => setErrorMessage(null)}
              type="button"
              className="text-rose-500 hover:text-rose-800 p-1 rounded-md"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* 1. Study Notes Section */}
        <div ref={notesRef}>
          <NotesSection
            notes={notes}
            onNotesChange={setNotes}
            onGenerateQuiz={handleGenerateQuiz}
            isLoading={isGenerating}
            hasQuiz={Boolean(quizData)}
            isCollapsed={isNotesCollapsed}
            onToggleCollapse={() => setIsNotesCollapsed(!isNotesCollapsed)}
          />
        </div>

        {/* 2. Quiz Section (Shown when questions have been generated) */}
        {quizData && (
          <div ref={quizRef}>
            <QuizSection
              questions={quizData.questions}
              instructionsPrompt={quizData.instructionsPrompt}
              selectedAnswers={selectedAnswers}
              onSelectAnswer={handleSelectAnswer}
              onSubmit={handleSubmitAnswers}
              isGrading={isGrading}
              onClearAnswers={handleClearAnswers}
            />
          </div>
        )}

        {/* 3. Results Section (Shown after submission is graded) */}
        {gradeResponse && quizData && (
          <div ref={resultsRef}>
            <ResultsSection
              gradeResponse={gradeResponse}
              questions={quizData.questions}
              onRetakeQuiz={handleRetakeQuiz}
              onRequestNewQuiz={handleGenerateQuiz}
              onEditNotes={handleEditNotes}
            />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-stone-200 bg-white py-6 mt-12 text-center text-xs text-stone-500">
        <div className="max-w-4xl mx-auto px-4">
          <p>
            StudyQuiz · Powered by Google Gemini · Generates 3 MCQs & Grades with Explanations
          </p>
        </div>
      </footer>
    </div>
  );
}
