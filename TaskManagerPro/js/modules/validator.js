// Session 8 - input validation
export const validateTaskInput = ({ title, dueDate, priority, type }) => {
  const errors = [];
  if (!title || !title.trim()) errors.push('Title is required.');
  if (title && title.length > 140) errors.push('Title must be under 140 characters.');
  if (dueDate && Number.isNaN(new Date(dueDate).getTime())) errors.push('Invalid due date.');
  if (priority && !['low', 'medium', 'high'].includes(priority)) errors.push('Invalid priority.');
  if (type && !['personal', 'office'].includes(type)) errors.push('Invalid task type.');
  return { valid: errors.length === 0, errors };
};

export const isTaskShape = (obj) =>
  obj && typeof obj === 'object' &&
  typeof obj.title === 'string' &&
  ['low','medium','high'].includes(obj.priority);
