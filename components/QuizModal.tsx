
import React, { useState } from 'react';
import { QuizQuestion } from '../types';

interface QuizModalProps {
  categoryName: string;
  questions: QuizQuestion[];
  onClose: () => void;
}

const QuizModal: React.FC<QuizModalProps> = ({ categoryName, questions, onClose }) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);

  const currentQuestion = questions[currentIdx];

  const handleOptionSelect = (idx: number) => {
    if (selectedOption !== null) return;
    setSelectedOption(idx);
    if (idx === currentQuestion.correctAnswer) {
      setScore(prev => prev + 1);
    }
  };

  const nextQuestion = () => {
    if (currentIdx < questions.length - 1) {
      setCurrentIdx(prev => prev + 1);
      setSelectedOption(null);
    } else {
      setShowResult(true);
    }
  };

  if (showResult) {
    return (
      <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl text-center">
          <div className="text-6xl mb-4">
            {score === questions.length ? '🏆' : score > 0 ? '👏' : '📚'}
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Quiz Complete!</h2>
          <p className="text-slate-500 mb-6">You scored {score} out of {questions.length} on {categoryName}.</p>
          <button 
            onClick={onClose}
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all"
          >
            Back to Study Plan
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full overflow-hidden flex flex-col max-h-[90vh]">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-blue-600 mb-1 block">AI Knowledge Check</span>
            <h2 className="text-xl font-bold text-slate-800">{categoryName}</h2>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-2">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-8 overflow-y-auto">
          <div className="mb-8">
            <div className="flex justify-between text-sm font-medium text-slate-400 mb-2">
              <span>Question {currentIdx + 1} of {questions.length}</span>
              <span>Progress {Math.round(((currentIdx + 1) / questions.length) * 100)}%</span>
            </div>
            <div className="h-1.5 w-full bg-slate-100 rounded-full">
              <div 
                className="h-full bg-blue-500 rounded-full transition-all" 
                style={{ width: `${((currentIdx + 1) / questions.length) * 100}%` }}
              />
            </div>
          </div>

          <h3 className="text-lg font-semibold text-slate-800 mb-6 leading-relaxed">
            {currentQuestion.question}
          </h3>

          <div className="space-y-3">
            {currentQuestion.options.map((option, i) => {
              const isSelected = selectedOption === i;
              const isCorrect = i === currentQuestion.correctAnswer;
              let btnClass = "w-full text-left p-4 rounded-xl border-2 transition-all font-medium flex justify-between items-center ";
              
              if (selectedOption === null) {
                btnClass += "border-slate-100 hover:border-blue-400 hover:bg-blue-50 text-slate-700";
              } else if (isCorrect) {
                btnClass += "border-green-500 bg-green-50 text-green-800";
              } else if (isSelected) {
                btnClass += "border-red-500 bg-red-50 text-red-800";
              } else {
                btnClass += "border-slate-50 text-slate-400 opacity-60";
              }

              return (
                <button 
                  key={i} 
                  onClick={() => handleOptionSelect(i)}
                  className={btnClass}
                  disabled={selectedOption !== null}
                >
                  <span>{option}</span>
                  {selectedOption !== null && isCorrect && (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </button>
              );
            })}
          </div>

          {selectedOption !== null && (
            <div className="mt-6 p-4 bg-slate-50 rounded-xl border border-slate-200 animate-in fade-in slide-in-from-bottom-2">
              <p className="text-sm text-slate-600 italic">
                <span className="font-bold uppercase text-[10px] text-slate-400 block mb-1">Explanation</span>
                {currentQuestion.explanation}
              </p>
            </div>
          )}
        </div>

        <div className="p-6 border-t border-slate-100 bg-slate-50 flex justify-end">
          <button 
            onClick={nextQuestion}
            disabled={selectedOption === null}
            className={`px-8 py-3 rounded-xl font-bold transition-all ${
              selectedOption === null 
              ? 'bg-slate-200 text-slate-400 cursor-not-allowed' 
              : 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-200'
            }`}
          >
            {currentIdx === questions.length - 1 ? 'Finish' : 'Next Question'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuizModal;
