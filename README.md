# 🏗️ Construction Task Planner

An offline-first task planning app for construction projects with floor plan interaction, checklist-based task tracking, and responsive UI.

---

## 🚀 Tech Stack

- **React + TypeScript**
- **Zustand** for global state management
- **RxDB** for offline-first local database
- **TailwindCSS** for modern UI
- **React Router** for navigation

---

## 🧠 Features

- 🔐 Simple login (by username) stored locally
- 🗺️ Interactive floor plan for placing tasks
- ✅ Per-task checklists with status tracking
- 📋 Task board with list and kanban view
- 🔄 Fully reactive UI using Zustand + RxDB
- 📴 Works fully offline with data persisted in IndexedDB
- 📱 Responsive UI with drawer-based sidebar on mobile

---

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── layouts/         # Layouts like AuthenticatedLayout
│   └── ui/              # Atomic UI components like Button, Badge
├── constants/           # Enums, config constants (statuses, sidebar, etc.)
├── db/                  # RxDB setup and schemas
│   ├── index.ts         # DB initialization
│   └── schemas/         # task.schema.ts, checklist.schema.ts, user.schema.ts
├── hooks/               # Zustand-powered hooks (auth, task, checklist)
├── pages/               # Page-level views (Plan, Taskboard)
├── router/              # React Router configuration
├── utils/               # Helper functions like getTaskStatus
└── App.tsx              # App root component
```
---

## 🕒 Time Spent on Each Feature

| Task | Estimated Time |
|------|----------------|
| 🔧 Project setup & routing | 2 hours |
| 🔐 Auth (Zustand + RxDB) | 2 hours |
| 🧬 RxDB collections | 3 hours |
| 🗺️ Floor Plan & task placement | 3.5 hours |
| 🧾 Task modal + checklist logic | 3 hours |
| ✅ Checklist UI & status sync | 4.5 hours |
| 🗂️ Task Board (list + board view) | 6 hours |
| 💾 Persistence (offline-first) | 2 hours |
| 🧼 UI polish & mobile support | 4 hours |
| 🧭 Sidebar + layout | 2 hours |
| 🔧 Final integration & bugs | 2 hours |

**Total**: ~33–35 hours

---

## 🧹 Improvements for Future

- 🧪 Add unit tests for status calculation & hooks
- 🎨 Animate modals and drawer with Framer Motion
- 🔒 Improve accessibility and focus management
- 📲 Add PWA support for installability

---

## 🔧 Running the Project

```bash
git clone https://github.com/QasimRRizvi/construction-app.git
cd construction-app
npm install
npm run dev