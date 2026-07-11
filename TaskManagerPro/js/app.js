// Session 10 - main application controller wiring everything together
import { CONFIG } from './config.js';
import { TaskManager } from './classes/TaskManager.js';
import { taskFromData } from './classes/Task.js';
import { User } from './classes/User.js';
import { storage } from './modules/storage.js';
import { fetchSampleTasks, asyncSave } from './modules/api.js';
import { validateTaskInput, isTaskShape } from './modules/validator.js';
import { debounce } from './modules/debounce.js';
import { throttle } from './modules/throttle.js';
import { createLogger } from './modules/logger.js';
import { els, renderTasks, renderStats, showLoading, showError, setActiveFilter } from './modules/ui.js';

const log = createLogger('app', CONFIG.LOG_LEVEL);

export class App {
  constructor() {
    this.user = new User('Friend');
    this.manager = new TaskManager();
    this.state = { query: '', filter: 'all' };
    // Session 3 - explicit bind for stable references
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleListClick = this.handleListClick.bind(this);
    this.handleFilterClick = this.handleFilterClick.bind(this);
  }

  async init() {
    log.info(this.user.greet());
    this.applyTheme(storage.loadTheme());

    // Session 4 - event loop demo: sync -> microtask -> macrotask
    console.log('sync: init start');
    Promise.resolve().then(() => console.log('microtask: after init'));
    setTimeout(() => console.log('macrotask: after init'), 0);

    showLoading(true);
    const saved = storage.load();
    if (saved.length) {
      this.manager.replaceAll(saved);
    } else {
      const sample = await fetchSampleTasks();
      this.manager.replaceAll(sample);
      storage.save(this.manager.toJSON());
    }
    showLoading(false);

    this.bindEvents();
    this.render();
  }

  bindEvents() {
    els.form.addEventListener('submit', this.handleSubmit);
    els.list.addEventListener('click', this.handleListClick);
    els.list.addEventListener('change', this.handleListClick);
    els.filters.forEach((btn) => btn.addEventListener('click', this.handleFilterClick));

    // Session 9 - debounced search
    els.search.addEventListener('input', debounce((e) => {
      this.state.query = e.target.value;
      this.render();
    }, CONFIG.DEBOUNCE_MS));

    // Session 9 - throttled scroll
    window.addEventListener('scroll', throttle(() => {
      log.debug('scrollY', window.scrollY);
    }, CONFIG.THROTTLE_MS));

    els.themeToggle.addEventListener('click', () => this.toggleTheme());
    els.exportBtn.addEventListener('click', () => this.exportJSON());
    els.importBtn.addEventListener('click', () => els.importFile.click());
    els.importFile.addEventListener('change', (e) => this.importJSON(e.target.files?.[0]));
  }

  handleSubmit(e) {
    e.preventDefault();
    const payload = {
      title: els.title.value,
      dueDate: els.due.value || null,
      priority: els.priority.value,
      type: els.type.value,
    };
    const { valid, errors } = validateTaskInput(payload);
    if (!valid) { showError(errors.join(' ')); return; }
    showError('');
    this.manager.add(payload);
    els.form.reset();
    els.priority.value = 'medium';
    this.persist();
    this.render();
  }

  handleListClick(e) {
    const li = e.target.closest('.task-item');
    if (!li) return;
    const id = li.dataset.id;
    if (e.target.matches('.task-check')) { this.manager.toggle(id); }
    else if (e.target.matches('.del-btn')) { this.manager.remove(id); }
    else if (e.target.matches('.dup-btn')) { this.manager.duplicate(id); }
    else if (e.target.matches('.edit-btn')) {
      const current = this.manager.all.find((t) => t.id === id);
      const next = prompt('Edit task title:', current?.title || '');
      if (next && next.trim()) this.manager.update(id, { title: next.trim() });
      else return;
    } else return;
    this.persist();
    this.render();
  }

  handleFilterClick(e) {
    const f = e.currentTarget.dataset.filter;
    this.state.filter = f;
    setActiveFilter(f);
    this.render();
  }

  render() {
    const list = this.manager.filter({ query: this.state.query, status: this.state.filter });
    renderTasks(list);
    renderStats(this.manager.stats());
  }

  async persist() {
    storage.save(this.manager.toJSON());
    const res = await asyncSave(this.manager.toJSON());
    log.debug('async saved', res);
  }

  applyTheme(theme) {
    document.body.classList.toggle('dark', theme === 'dark');
    els.themeToggle.textContent = theme === 'dark' ? '☀️' : '🌙';
  }
  toggleTheme() {
    const next = document.body.classList.contains('dark') ? 'light' : 'dark';
    this.applyTheme(next);
    storage.saveTheme(next);
  }

  exportJSON() {
    const blob = new Blob([JSON.stringify(this.manager.toJSON(), null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `tasks-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  async importJSON(file) {
    if (!file) return;
    try {
      const text = await file.text();
      const data = JSON.parse(text);
      if (!Array.isArray(data)) throw new Error('Expected an array of tasks.');
      const clean = data.filter(isTaskShape).map(taskFromData);
      this.manager.replaceAll(clean);
      this.persist();
      this.render();
      log.info(`Imported ${clean.length} tasks`);
    } catch (err) {
      alert(`Import failed: ${err.message}`);
      log.error('import error', err);
    } finally {
      els.importFile.value = '';
    }
  }
}
