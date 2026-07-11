# Task Manager Pro

A beautiful vanilla-JS Task Manager built across **10 teaching sessions** covering advanced JavaScript concepts — from execution context to modules, closures, classes, async, and design patterns.

## ✨ Features

- ✅ Add / Edit / Delete / Duplicate tasks
- ✔️ Mark complete
- 🎯 Priority (Low / Medium / High)
- 📅 Due date
- 🔎 Debounced search
- 🎛️ Filters (All / Active / Completed / High)
- 💾 Local Storage persistence
- 📥📤 JSON Import / Export
- 🌙 Dark Mode (persisted)
- 📊 Live statistics
- 🧩 ES Modules architecture
- 🌐 Async fetch of sample data

## 🚀 Running

Because it uses ES modules, serve the folder over HTTP (not `file://`):

```bash
# any static server works, e.g.:
npx serve .
# or
python3 -m http.server 8000
```

Then open `http://localhost:8000`.

## 📁 Folder Structure

```
TaskManagerPro/
├── index.html
├── css/         → style, layout, dark, responsive
├── js/
│   ├── main.js  → entry point
│   ├── app.js   → application controller
│   ├── config.js
│   ├── modules/ → ui, storage, api, debounce, throttle, validator, logger
│   ├── classes/ → Task, PersonalTask, OfficeTask, TaskManager, User
│   └── data/sample.json
└── README.md
```

## 🎓 Session Map

| Session | Topic | Where it lives |
|---|---|---|
| 1 | Execution context, call stack | `index.html`, `js/main.js` |
| 2 | Scope, closures | `classes/Task.js` (`createIdGenerator`) |
| 3 | `this`, `bind` | `app.js` (`handleSubmit.bind(this)`) |
| 4 | Event loop, microtasks | `app.js` `init()` demo logs |
| 5 | Promises, async/await | `modules/api.js`, `app.js#persist` |
| 6 | Prototypes, inheritance | `classes/Task.js` (Personal/Office) |
| 7 | Deep copy, Symbols, iterators | `Task#duplicate`, `TaskManager[Symbol.iterator]` |
| 8 | Error handling, JSON, storage | `modules/storage.js`, `importJSON` |
| 9 | Debounce, throttle, modules | `modules/debounce.js`, `throttle.js` |
| 10 | Integration | Dark mode, filters, stats |

Enjoy! 💜
