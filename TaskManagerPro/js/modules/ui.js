// Session 1 & 10 - UI rendering module
export const els = {
  form: document.getElementById('taskForm'),
  title: document.getElementById('taskTitle'),
  due: document.getElementById('taskDue'),
  priority: document.getElementById('taskPriority'),
  type: document.getElementById('taskType'),
  formError: document.getElementById('formError'),
  list: document.getElementById('taskList'),
  empty: document.getElementById('emptyState'),
  loading: document.getElementById('loading'),
  search: document.getElementById('searchInput'),
  filters: document.querySelectorAll('.chip'),
  themeToggle: document.getElementById('themeToggle'),
  importBtn: document.getElementById('importBtn'),
  exportBtn: document.getElementById('exportBtn'),
  importFile: document.getElementById('importFile'),
  stats: {
    total: document.getElementById('statTotal'),
    active: document.getElementById('statActive'),
    done: document.getElementById('statDone'),
    high: document.getElementById('statHigh'),
  },
};

const fmtDate = (d) => {
  if (!d) return '';
  const dt = new Date(d);
  if (Number.isNaN(dt.getTime())) return '';
  return dt.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
};

export const renderTasks = (tasks) => {
  els.list.innerHTML = '';
  els.empty.classList.toggle('hidden', tasks.length > 0);

  const frag = document.createDocumentFragment();
  for (const t of tasks) {
    const li = document.createElement('li');
    li.className = `task-item ${t.completed ? 'done' : ''}`;
    li.dataset.id = t.id;
    li.innerHTML = `
      <input type="checkbox" class="task-check" ${t.completed ? 'checked' : ''} aria-label="Toggle complete" />
      <div class="task-body">
        <span class="task-title"></span>
        <div class="task-meta">
          <span class="badge ${t.priority}">${t.priority}</span>
          <span class="badge type">${t.type || 'personal'}</span>
          ${t.dueDate ? `<span>📅 ${fmtDate(t.dueDate)}</span>` : ''}
        </div>
      </div>
      <button class="btn ghost edit-btn" title="Edit">✏️</button>
      <button class="btn ghost dup-btn" title="Duplicate">⧉</button>
      <button class="btn danger del-btn" title="Delete">✕</button>
    `;
    li.querySelector('.task-title').textContent = t.title;
    frag.appendChild(li);
  }
  els.list.appendChild(frag);
};

export const renderStats = (stats) => {
  els.stats.total.textContent = stats.total;
  els.stats.active.textContent = stats.active;
  els.stats.done.textContent = stats.done;
  els.stats.high.textContent = stats.high;
};

export const showLoading = (on) => els.loading.classList.toggle('hidden', !on);
export const showError = (msg) => { els.formError.textContent = msg || ''; };

export const setActiveFilter = (name) => {
  els.filters.forEach((btn) => btn.classList.toggle('active', btn.dataset.filter === name));
};
