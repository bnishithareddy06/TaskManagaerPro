// Session 6, 7 - TaskManager with custom iterator (Symbol.iterator)
import { Task, taskFromData, TASK_SYMBOL } from './Task.js';

export class TaskManager {
  #tasks = [];

  constructor(initial = []) {
    this.#tasks = initial.map((t) => (t[TASK_SYMBOL] ? t : taskFromData(t)));
  }

  get all() { return [...this.#tasks]; }
  get size() { return this.#tasks.length; }

  add(data) {
    const task = data instanceof Task ? data : taskFromData(data);
    this.#tasks.unshift(task);
    return task;
  }

  remove(id) {
    const i = this.#tasks.findIndex((t) => t.id === id);
    if (i >= 0) return this.#tasks.splice(i, 1)[0];
    return null;
  }

  update(id, patch) {
    const t = this.#tasks.find((x) => x.id === id);
    if (t) t.update(patch);
    return t;
  }

  toggle(id) {
    const t = this.#tasks.find((x) => x.id === id);
    if (t) t.toggle();
    return t;
  }

  duplicate(id) {
    const t = this.#tasks.find((x) => x.id === id);
    if (!t) return null;
    const copy = t.duplicate();
    this.#tasks.unshift(copy);
    return copy;
  }

  replaceAll(list) {
    this.#tasks = list.map((t) => (t[TASK_SYMBOL] ? t : taskFromData(t)));
  }

  filter({ query = '', status = 'all' } = {}) {
    const q = query.trim().toLowerCase();
    return this.#tasks.filter((t) => {
      if (status === 'active' && t.completed) return false;
      if (status === 'completed' && !t.completed) return false;
      if (status === 'high' && t.priority !== 'high') return false;
      if (q && !t.title.toLowerCase().includes(q)) return false;
      return true;
    });
  }

  stats() {
    const total = this.#tasks.length;
    const done = this.#tasks.filter((t) => t.completed).length;
    const high = this.#tasks.filter((t) => t.priority === 'high').length;
    return { total, done, active: total - done, high };
  }

  toJSON() { return this.#tasks.map((t) => t.toJSON()); }

  // Session 7 - custom iterator
  *[Symbol.iterator]() {
    for (const t of this.#tasks) yield t;
  }
}
