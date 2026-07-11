// Session 5 & 8 - async fetch with error handling
import { CONFIG } from '../config.js';

export const fetchSampleTasks = async () => {
  try {
    const res = await fetch(CONFIG.SAMPLE_URL);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (!Array.isArray(data)) throw new Error('Invalid sample payload');
    return data;
  } catch (err) {
    console.warn('fetchSampleTasks failed:', err.message);
    return [];
  }
};

// Simulated async save (Session 5 - Promises)
export const asyncSave = (tasks) =>
  new Promise((resolve) => {
    setTimeout(() => resolve({ ok: true, count: tasks.length }), 150);
  });
