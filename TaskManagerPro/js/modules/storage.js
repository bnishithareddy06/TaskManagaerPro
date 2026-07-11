// Session 8 - Local Storage persistence with error handling
import { CONFIG } from '../config.js';

export const storage = {
  save(tasks) {
    try {
      localStorage.setItem(CONFIG.STORAGE_KEY, JSON.stringify(tasks));
      return true;
    } catch (err) {
      console.error('storage.save failed', err);
      return false;
    }
  },
  load() {
    try {
      const raw = localStorage.getItem(CONFIG.STORAGE_KEY);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch (err) {
      console.error('storage.load failed - resetting', err);
      return [];
    }
  },
  clear() { localStorage.removeItem(CONFIG.STORAGE_KEY); },

  saveTheme(theme) { localStorage.setItem(CONFIG.THEME_KEY, theme); },
  loadTheme() { return localStorage.getItem(CONFIG.THEME_KEY) || 'light'; },
};
