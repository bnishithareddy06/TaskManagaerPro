// Entry point - Session 1 (execution context) & Session 10 (integration)
import { App } from './app.js';

const bootstrap = async () => {
  const app = new App();
  window.__app = app; // expose for debugging
  await app.init();
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', bootstrap);
} else {
  bootstrap();
}
