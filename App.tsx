
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { TodoItem } from './types';
import { CATEGORIES, INITIAL_TODOS } from './constants';
import CategorySection from './components/CategorySection';
import Timer from './components/Timer';
import { exportToJSON, exportToCSV, parseCSV } from './services/storageService';

declare global {
  interface AIStudio {
    hasSelectedApiKey: () => Promise<boolean>;
    openSelectKey: () => Promise<void>;
  }
  interface Window {
    aistudio?: AIStudio;
  }
}

const App: React.FC = () => {
  const [todos, setTodos] = useState<TodoItem[]>(() => {
    const saved = localStorage.getItem('python-study-todos');
    return saved ? JSON.parse(saved) : INITIAL_TODOS;
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTask, setNewTask] = useState({ title: '', category: CATEGORIES[0].id });
  const [apiConfigured, setApiConfigured] = useState(false);

  const checkApiKey = useCallback(async () => {
    if (window.aistudio) {
      const hasKey = await window.aistudio.hasSelectedApiKey();
      setApiConfigured(hasKey);
    }
  }, []);

  useEffect(() => {
    checkApiKey();
    const interval = setInterval(checkApiKey, 3000);
    return () => clearInterval(interval);
  }, [checkApiKey]);

  useEffect(() => {
    localStorage.setItem('python-study-todos', JSON.stringify(todos));
  }, [todos]);

  const handleOpenApiKeyDialog = async () => {
    if (window.aistudio) {
      await window.aistudio.openSelectKey();
      setApiConfigured(true);
    }
  };

  const toggleTodo = useCallback((id: string) => {
    setTodos(prev => prev.map(todo => 
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  }, []);

  const deleteTodo = useCallback((id: string) => {
    setTodos(prev => prev.filter(t => t.id !== id));
  }, []);

  const totalTasks = todos.length;
  const completedTasks = todos.filter(t => t.completed).length;
  const overallProgress = (completedTasks / (totalTasks || 1)) * 100;

  const filteredTodos = useMemo(() => {
    if (!searchQuery) return todos;
    return todos.filter(t => t.title.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [todos, searchQuery]);

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTask.title.trim()) return;
    const id = `custom-${Date.now()}`;
    const videoUrl = `https://www.youtube.com/results?search_query=python+${encodeURIComponent(newTask.title)}`;
    setTodos(prev => [...prev, { id, title: newTask.title, category: newTask.category, completed: false, videoUrl, custom: true }]);
    setNewTask({ ...newTask, title: '' });
    setShowAddModal(false);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        if (file.name.endsWith('.csv')) {
          setTodos(parseCSV(content));
        } else {
          setTodos(JSON.parse(content));
        }
      } catch (err) { alert('Invalid file format.'); }
    };
    reader.readAsText(file);
  };

  return (
    <div className="min-h-screen bg-[#fcfcfd] flex flex-col font-sans selection:bg-blue-100 selection:text-blue-900">
      {/* Floating Action Menu for Desktop */}
      <div className="fixed bottom-8 right-8 z-50 flex flex-col gap-4">
        <Timer />
        <button 
          onClick={() => setShowAddModal(true)}
          className="w-16 h-16 bg-slate-900 text-white rounded-2xl shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all"
        >
          <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path d="M12 4v16m8-8H4" /></svg>
        </button>
      </div>

      {/* Hero Header */}
      <header className="bg-[#0f172a] text-white pt-16 pb-28 px-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-blue-600/10 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2"></div>
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-16">
            <div>
              <div className="flex items-center gap-4 mb-4">
                <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-xl shadow-blue-500/20">
                  <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg>
                </div>
                <div>
                  <h1 className="text-4xl md:text-5xl font-black tracking-tight">Python Exam <span className="text-blue-400">Master</span></h1>
                  <p className="text-slate-400 font-medium">Developed by <a href="http://sernine.com/" target="_blank" className="text-blue-300 hover:underline">sernine</a></p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <button 
                onClick={handleOpenApiKeyDialog}
                className={`px-6 py-3 rounded-2xl text-sm font-black transition-all border-2 flex items-center gap-2 ${
                  apiConfigured 
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' 
                    : 'bg-blue-600 border-blue-500 text-white shadow-xl shadow-blue-600/30 hover:bg-blue-500'
                }`}
              >
                <div className={`w-2 h-2 rounded-full ${apiConfigured ? 'bg-emerald-400 animate-pulse' : 'bg-white'}`}></div>
                {apiConfigured ? 'API Connected' : 'Setup API Key'}
              </button>
              <div className="flex bg-slate-800/50 p-1 rounded-2xl border border-slate-700">
                <button onClick={() => exportToJSON(todos)} className="px-4 py-2 hover:bg-slate-700 rounded-xl transition-all text-xs font-black uppercase">JSON</button>
                <button onClick={() => exportToCSV(todos)} className="px-4 py-2 hover:bg-slate-700 rounded-xl transition-all text-xs font-black uppercase">CSV</button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2 bg-slate-800/40 backdrop-blur-md p-8 rounded-[32px] border border-white/5 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-end mb-4">
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Overall Course Progress</span>
                  <span className="text-4xl font-black">{Math.round(overallProgress)}%</span>
                </div>
                <div className="h-4 w-full bg-slate-950 rounded-full overflow-hidden p-1 border border-slate-800">
                  <div className="h-full bg-gradient-to-r from-blue-600 to-indigo-400 rounded-full transition-all duration-1000" style={{ width: `${overallProgress}%` }} />
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-indigo-600 to-blue-700 p-8 rounded-[32px] flex flex-col justify-between shadow-2xl shadow-blue-900/20">
              <div className="text-[10px] font-black uppercase tracking-widest opacity-60">Status</div>
              <div className="text-2xl font-black">{completedTasks} / {totalTasks} Completed</div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl w-full mx-auto px-8 -mt-12 pb-24 relative z-20">
        <div className="flex flex-col md:flex-row gap-6 mb-12">
          <div className="relative flex-1">
            <div className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            </div>
            <input 
              type="text" 
              placeholder="Search subjects or modules..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-16 pr-8 py-6 bg-white border border-slate-200 rounded-[28px] shadow-xl shadow-slate-200/40 focus:ring-8 focus:ring-blue-500/5 focus:border-blue-400 outline-none transition-all font-bold text-slate-700 text-lg placeholder:text-slate-300"
            />
          </div>
          <label className="flex items-center gap-3 px-10 py-6 bg-white hover:bg-slate-50 text-slate-700 text-sm font-black rounded-[28px] border border-slate-200 cursor-pointer shadow-xl shadow-slate-200/40 transition-all active:scale-95">
            <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" strokeWidth="2.5" /></svg>
            Import JSON/CSV
            <input type="file" accept=".json,.csv" onChange={handleFileUpload} className="hidden" />
          </label>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {CATEGORIES.map(category => (
            <CategorySection 
              key={category.id}
              category={category}
              todos={filteredTodos.filter(t => t.category === category.id)}
              onToggle={toggleTodo}
              onDelete={deleteTodo}
              isApiReady={apiConfigured}
              onOpenKeyDialog={handleOpenApiKeyDialog}
            />
          ))}
        </div>
      </main>

      {/* Simple Footer */}
      <footer className="py-12 bg-white text-slate-400 text-sm border-t border-slate-100">
        <div className="max-w-6xl mx-auto px-8 flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left">
          <p className="font-medium">Curated Study Path for Python Mastery &bull; Created by <a href="http://sernine.com/" target="_blank" className="text-slate-900 font-black hover:text-blue-600 transition-colors">sernine</a></p>
          <div className="flex gap-6 font-bold uppercase tracking-widest text-[10px]">
            <a href="http://sernine.com/" className="hover:text-slate-600">Portfolio</a>
            <a href="#" className="hover:text-slate-600">Documentation</a>
            <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" className="hover:text-slate-600 text-amber-500">API Billing Info</a>
          </div>
        </div>
      </footer>

      {/* Custom Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-[100] flex items-center justify-center p-6">
          <div className="bg-white rounded-[40px] p-12 max-w-lg w-full shadow-2xl animate-in zoom-in-95 duration-300">
             <div className="flex justify-between items-center mb-10">
               <div>
                 <h2 className="text-3xl font-black text-slate-900">Add Topic</h2>
                 <p className="text-slate-400 font-bold">Customize your curriculum</p>
               </div>
               <button onClick={() => setShowAddModal(false)} className="w-12 h-12 flex items-center justify-center bg-slate-100 text-slate-400 rounded-full hover:text-slate-900">
                 <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path d="M6 18L18 6M6 6l12 12" /></svg>
               </button>
             </div>
             <form onSubmit={handleAddTask} className="space-y-8">
                <div>
                   <label className="block text-[11px] font-black uppercase tracking-widest text-slate-400 mb-3 ml-2">Topic Title</label>
                   <input autoFocus type="text" required placeholder="e.g. Garbage Collection" className="w-full p-6 bg-slate-50 border border-slate-200 rounded-3xl focus:ring-8 focus:ring-blue-500/5 focus:border-blue-400 outline-none transition-all font-bold text-slate-700" value={newTask.title} onChange={e => setNewTask({...newTask, title: e.target.value})} />
                </div>
                <div>
                   <label className="block text-[11px] font-black uppercase tracking-widest text-slate-400 mb-3 ml-2">Category</label>
                   <select className="w-full p-6 bg-slate-50 border border-slate-200 rounded-3xl focus:ring-8 focus:ring-blue-500/5 focus:border-blue-400 outline-none transition-all font-bold text-slate-700 appearance-none cursor-pointer" value={newTask.category} onChange={e => setNewTask({...newTask, category: e.target.value})} >
                     {CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.icon} {c.name}</option>)}
                   </select>
                </div>
                <button type="submit" className="w-full py-6 bg-blue-600 text-white font-black rounded-3xl shadow-xl shadow-blue-500/20 text-xl hover:bg-blue-700 transition-all active:scale-[0.98]">Add to Plan</button>
             </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
