
import React from 'react';
import { Category, TodoItem } from './types';

export const CATEGORIES: Category[] = [
  { id: 'basics', name: 'Core Basics & Control Flow', icon: '⚡' },
  { id: 'data-structures', name: 'Data Structures', icon: '📦' },
  { id: 'advanced', name: 'Advanced Functions & Strings', icon: '🔧' },
  { id: 'hashing', name: 'Hashing & Algorithms', icon: '🔐' },
  { id: 'libraries', name: 'Numerical Libraries', icon: '📊' },
  { id: 'specialized', name: 'Specialized Tools', icon: '🛠️' },
];

const createVideoSearchUrl = (query: string) => `https://www.youtube.com/results?search_query=python+${encodeURIComponent(query)}`;

export const INITIAL_TODOS: TodoItem[] = [
  // Core Basics
  { id: '1-1', category: 'basics', completed: false, title: 'Numerical conversions: int(), float(), Decimal()', videoUrl: createVideoSearchUrl('numerical conversions int float decimal') },
  { id: '1-2', category: 'basics', completed: false, title: 'Arithmetic operators: /, //, %, round()', videoUrl: createVideoSearchUrl('arithmetic operators python') },
  { id: '1-3', category: 'basics', completed: false, title: 'User inputs & Formatted prints (sep, end)', videoUrl: createVideoSearchUrl('python input and print formatted') },
  { id: '1-4', category: 'basics', completed: false, title: 'Conditional Logic: if, elif, else', videoUrl: createVideoSearchUrl('python conditional logic') },
  { id: '1-5', category: 'basics', completed: false, title: 'Loops: while, for, break, continue', videoUrl: createVideoSearchUrl('python loops while for break continue') },
  
  // Data Structures
  { id: '2-1', category: 'data-structures', completed: false, title: 'Lists: append, insert, pop, sort, slicing', videoUrl: createVideoSearchUrl('python lists methods slicing') },
  { id: '2-2', category: 'data-structures', completed: false, title: 'Dictionaries: keys, values, items, update', videoUrl: createVideoSearchUrl('python dictionaries methods') },
  { id: '2-3', category: 'data-structures', completed: false, title: 'Sets: union (|), intersection, issubset', videoUrl: createVideoSearchUrl('python sets operations') },
  { id: '2-4', category: 'data-structures', completed: false, title: 'Tuples: Immutability and Indexing', videoUrl: createVideoSearchUrl('python tuples tutorial') },

  // Advanced Functions
  { id: '3-1', category: 'advanced', completed: false, title: 'Variable arguments: *args and **kwargs', videoUrl: createVideoSearchUrl('python args and kwargs') },
  { id: '3-2', category: 'advanced', completed: false, title: 'Advanced functions: lambda, filter, map, reduce', videoUrl: createVideoSearchUrl('python lambda filter map reduce') },
  { id: '3-3', category: 'advanced', completed: false, title: 'String methods: upper, lower, split, join, zfill', videoUrl: createVideoSearchUrl('python string methods') },

  // Hashing
  { id: '4-1', category: 'hashing', completed: false, title: 'Indices calculation: hash(element) % taille', videoUrl: createVideoSearchUrl('python hashing algorithm explained') },
  { id: '4-2', category: 'hashing', completed: false, title: 'Collision handling & MD5 vs SHA algorithms', videoUrl: createVideoSearchUrl('cryptographic hashing algorithms python') },

  // Numerical Libraries
  { id: '5-1', category: 'libraries', completed: false, title: 'NumPy: arange, linspace, zeros, eye', videoUrl: createVideoSearchUrl('numpy array generation functions') },
  { id: '5-2', category: 'libraries', completed: false, title: 'Linear Algebra: linalg.solve, transpose, inv', videoUrl: createVideoSearchUrl('numpy linear algebra functions') },
  { id: '5-3', category: 'libraries', completed: false, title: 'Pandas: Series, DataFrames, iloc/loc', videoUrl: createVideoSearchUrl('pandas dataframes loc iloc tutorial') },
  { id: '5-4', category: 'libraries', completed: false, title: 'Data Cleaning: isna, fillna, dropna', videoUrl: createVideoSearchUrl('pandas data cleaning missing values') },

  // Specialized Tools
  { id: '6-1', category: 'specialized', completed: false, title: 'Data Structures: LIFO (Stacks) & FIFO (Queues)', videoUrl: createVideoSearchUrl('python stacks and queues') },
  { id: '6-2', category: 'specialized', completed: false, title: 'File Handling: txt and csv files', videoUrl: createVideoSearchUrl('python read write files csv txt') },
  { id: '6-3', category: 'specialized', completed: false, title: 'SymPy: expand, factor, diff, integrate', videoUrl: createVideoSearchUrl('sympy tutorial symbolic math python') },
  { id: '6-4', category: 'specialized', completed: false, title: 'Matplotlib: plot, scatter, custom styles', videoUrl: createVideoSearchUrl('matplotlib plotting tutorial python') },
];
