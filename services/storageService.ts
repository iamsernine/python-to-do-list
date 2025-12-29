
import { TodoItem } from '../types';

export const exportToJSON = (todos: TodoItem[]) => {
  const dataStr = JSON.stringify(todos, null, 2);
  const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
  const exportFileDefaultName = 'python_study_plan.json';

  const linkElement = document.createElement('a');
  linkElement.setAttribute('href', dataUri);
  linkElement.setAttribute('download', exportFileDefaultName);
  linkElement.click();
};

export const exportToCSV = (todos: TodoItem[]) => {
  const headers = ['id', 'category', 'title', 'completed', 'videoUrl'];
  const rows = todos.map(todo => [
    todo.id,
    todo.category,
    `"${todo.title.replace(/"/g, '""')}"`,
    todo.completed,
    todo.videoUrl
  ]);

  const csvContent = [
    headers.join(','),
    ...rows.map(e => e.join(','))
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', 'python_study_plan.csv');
  link.click();
};

export const parseCSV = (csvText: string): TodoItem[] => {
  const lines = csvText.split('\n');
  const result: TodoItem[] = [];
  // Skip header
  for (let i = 1; i < lines.length; i++) {
    if (!lines[i].trim()) continue;
    const parts = lines[i].split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/); // Regex to split by comma but ignore commas inside quotes
    if (parts.length >= 5) {
      result.push({
        id: parts[0],
        category: parts[1],
        title: parts[2].replace(/^"|"$/g, '').replace(/""/g, '"'),
        completed: parts[3].toLowerCase() === 'true',
        videoUrl: parts[4]
      });
    }
  }
  return result;
};
