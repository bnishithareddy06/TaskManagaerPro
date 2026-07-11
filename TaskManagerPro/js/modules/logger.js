// Simple leveled logger - Session 9
const LEVELS = { debug: 0, info: 1, warn: 2, error: 3 };

export const createLogger = (namespace = 'app', level = 'info') => {
  const threshold = LEVELS[level] ?? 1;
  const log = (lvl, ...args) => {
    if (LEVELS[lvl] < threshold) return;
    const stamp = new Date().toISOString().split('T')[1].slice(0, 8);
    // eslint-disable-next-line no-console
    console[lvl === 'debug' ? 'log' : lvl](`[${stamp}] [${namespace}]`, ...args);
  };
  return {
    debug: (...a) => log('debug', ...a),
    info:  (...a) => log('info', ...a),
    warn:  (...a) => log('warn', ...a),
    error: (...a) => log('error', ...a),
  };
};
