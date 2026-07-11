// Session 2, 6, 7 - Task base class with closure-based ID generator + Symbol
const createIdGenerator = () => {
  let counter = 0;
  return () => {
    counter += 1;
    return `t_${Date.now().toString(36)}_${counter}`;
  };
};
const nextId = createIdGenerator();

export const TASK_SYMBOL = Symbol('task.identity');

export class Task {
  constructor({ id, title, dueDate = null, priority = 'medium', completed = false, createdAt } = {}) {
    this.id = id || nextId();
    this.title = String(title || '').trim();
    this.dueDate = dueDate || null;
    this.priority = priority;
    this.completed = Boolean(completed);
    this.createdAt = createdAt || new Date().toISOString();
    this.type = 'task';
    this[TASK_SYMBOL] = true;
  }

  toggle() { this.completed = !this.completed; return this; }

  update(patch = {}) {
    const allowed = ['title', 'dueDate', 'priority', 'completed'];
    for (const k of allowed) if (k in patch) this[k] = patch[k];
    return this;
  }

  // Session 7 - deep clone via structuredClone
  duplicate() {
    const copy = structuredClone({ ...this, id: undefined });
    return new this.constructor({ ...copy, title: `${this.title} (copy)` });
  }

  toJSON() {
    return {
      id: this.id, title: this.title, dueDate: this.dueDate,
      priority: this.priority, completed: this.completed,
      createdAt: this.createdAt, type: this.type,
    };
  }
}

// Session 6 - Inheritance
export class PersonalTask extends Task {
  constructor(opts) { super(opts); this.type = 'personal'; }
}
export class OfficeTask extends Task {
  constructor(opts) { super(opts); this.type = 'office'; }
}

export const taskFromData = (data) => {
  if (data.type === 'office') return new OfficeTask(data);
  return new PersonalTask(data);
};
