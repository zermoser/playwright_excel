✅ README.md
# React Excel Import Automation Project

This project is a modern React application scaffolded with Vite, written in TypeScript, styled using Tailwind CSS, and equipped with Playwright automation to import data from an Excel file.

---

## 🚀 Getting Started

### Prerequisites

- Node.js >= 18.x
- npm or yarn

---

### 📦 Install Dependencies

```bash
npm install
# or
yarn install
🧪 Run Playwright Setup (First Time Only)

npx playwright install
📊 Start the React App

npm run dev
# or
yarn dev
App will be available at: http://localhost:5173

🤖 Run Playwright Excel Automation
Make sure the app is running before executing the test:

npx playwright test playwright/excel-import.spec.ts
📁 Excel File Format
Make sure your Excel file (data.xlsx) is placed in the playwright folder and contains a sheet with the following structure:

Name	Email	Age
John Doe	john@example.com	28
Jane Doe	jane@example.com	32

🛠 Stack
React + Vite + TypeScript

Tailwind CSS

Playwright (for automation)

xlsx (to read Excel files)

📜 License
MIT © 2025

🙋‍♂️ Author
Built by [Your Name]
