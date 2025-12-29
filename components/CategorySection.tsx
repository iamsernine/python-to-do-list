
import React, { useState } from 'react';
import { Category, TodoItem, QuizQuestion } from '../types';
import { getAIAssistance, generateQuiz } from '../services/geminiService';
import QuizModal from './QuizModal';

interface CategorySectionProps {
  category: Category;
  todos: TodoItem[];
  onToggle: (id: string) => void;
  onDelete?: (id: string) => void;
  isApiReady: boolean;
  onOpenKeyDialog: () => void;
}

const CategorySection: React.FC<CategorySectionProps> = ({ category, todos, onToggle, onDelete, isApiReady, onOpenKeyDialog }) => {
  const [aiLoadingId, setAiLoadingId] = useState<string | null>(null);
  const [aiResponse, setAiResponse] = useState<{ id: string, text: string } | null>(null);
  const [quizLoading, setQuizLoading] = useState(false);
  const [quizData, setQuizData] = useState<QuizQuestion[] | null>(null);

  const completedCount = todos.filter(t => t.completed).length;
  const progressPercent = todos.length > 0 ? (completedCount / todos.length) * 100 : 0;

  const handleAskAI = async (todo: TodoItem) => {
    if (!isApiReady) {
      onOpenKeyDialog();
      return;
    }
    setAiLoadingId(todo.id);
    try {
      const result = await getAIAssistance(todo.title);
      setAiResponse({ id: todo.id, text: result || "" });
    } catch (err: any) {
      if (err.message === "API_KEY_RESET") onOpenKeyDialog();
    } finally {
      setAiLoadingId(null);
    }
  };

  const handleStartQuiz = async () => {
    if (todos.length === 0) return;
    if (!isApiReady) {
      onOpenKeyDialog();
      return;
    }
    setQuizLoading(true);
    try {
      const questions = await generateQuiz(category.name, todos.slice(0, 5).map(t => t.title));
      setQuizData(questions);
    } catch (err: any) {
      if (err.message === "API_KEY_RESET") {
        onOpenKeyDialog();
      } else {
        alert("Unable to generate quiz at this time.");
      }
    } finally {
      setQuizLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-[40px] shadow-2xl shadow-slate-200/50 border border-slate-100 overflow-hidden flex flex-col group/section transition-all">
      <div className="p-10 border-b border-slate-50 flex items-center justify-between bg-slate-50/20">
        <div className="flex items-center gap-6">
          <div className="w-14 h-14 bg-white rounded-2xl shadow-sm border border-slate-100 flex items-center justify-center text-3xl group-hover/section:scale-110 transition-transform">
            {category.icon}
          </div>
          <div>
            <h2 className="font-black text-2xl text-slate-800 tracking-tight">{category.name}</h2>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{todos.length} Study Modules</p>
          </div>
        </div>
        <button 
          onClick={handleStartQuiz}
          disabled={quizLoading || todos.length === 0}
          className={`flex items-center gap-2 px-6 py-3 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all ${
            isApiReady ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-xl shadow-indigo-200' : 'bg-slate-100 text-slate-400'
          }`}
        >
          {quizLoading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : 'Start Quiz'}
        </button>
      </div>

      <div className="h-1.5 w-full bg-slate-100">
        <div 
          className="h-full bg-blue-500 rounded-r-full transition-all duration-1000" 
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      <div className="p-6 space-y-2">
        {todos.length === 0 && (
          <div className="py-16 text-center">
            <div className="text-5xl opacity-10 mb-4">📘</div>
            <p className="text-slate-400 font-black text-xs uppercase tracking-widest">No subjects added</p>
          </div>
        )}
        {todos.map(todo => (
          <div key={todo.id} className="group relative">
            <div className={`flex items-center justify-between p-5 rounded-[28px] transition-all ${todo.completed ? 'bg-emerald-50/40' : 'hover:bg-slate-50 border border-transparent hover:border-slate-100'}`}>
              <div className="flex items-center gap-5 flex-1 pr-4">
                <button 
                  onClick={() => onToggle(todo.id)}
                  className={`w-8 h-8 rounded-xl border-2 flex items-center justify-center transition-all shrink-0 ${
                    todo.completed 
                    ? 'bg-emerald-500 border-emerald-500 text-white shadow-lg shadow-emerald-200' 
                    : 'border-slate-200 bg-white hover:border-blue-400'
                  }`}
                >
                  {todo.completed && <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path d="M5 13l4 4L19 7" /></svg>}
                </button>
                <span className={`text-base font-bold transition-all ${todo.completed ? 'text-slate-400 line-through' : 'text-slate-700'}`}>
                  {todo.title}
                </span>
              </div>

              <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all scale-95 group-hover:scale-100">
                <button
                   onClick={() => handleAskAI(todo)}
                   className={`p-3 rounded-2xl transition-all ${aiLoadingId === todo.id ? 'bg-indigo-50 text-indigo-500 animate-pulse' : 'text-indigo-500 hover:bg-indigo-50'}`}
                   disabled={aiLoadingId === todo.id}
                   title="Quick Explanation"
                >
                  {aiLoadingId === todo.id ? <div className="w-5 h-5 border-2 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" /> : <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
                </button>
                <a 
                  href={todo.videoUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="p-3 text-red-500 hover:bg-red-50 rounded-2xl transition-all"
                  title="Watch Resource Video"
                >
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/>
                  </svg>
                </a>
                {todo.custom && onDelete && (
                  <button
                    onClick={() => onDelete(todo.id)}
                    className="p-3 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-2xl transition-all"
                    title="Remove"
                  >
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                  </button>
                )}
              </div>
            </div>
            
            {aiResponse?.id === todo.id && (
              <div className="mx-6 my-4 p-8 bg-slate-900 rounded-[32px] text-sm text-slate-300 shadow-2xl animate-in zoom-in-95 duration-300">
                <div className="flex justify-between items-center mb-6">
                   <h4 className="font-black text-white uppercase text-[10px] tracking-widest flex items-center gap-2">
                     <span className="text-xl">✨</span> Subject Summary
                   </h4>
                   <button onClick={() => setAiResponse(null)} className="p-2 text-slate-500 hover:text-white transition-colors">
                     <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path d="M6 18L18 6M6 6l12 12" /></svg>
                   </button>
                </div>
                <div className="prose prose-invert prose-sm max-w-none">
                  {aiResponse.text}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {quizData && (
        <QuizModal 
          categoryName={category.name} 
          questions={quizData} 
          onClose={() => setQuizData(null)} 
        />
      )}
    </div>
  );
};

export default CategorySection;
