<<<<<<< HEAD
# Shramdaan Connect

A starter full-stack community resource and skill mapper inspired by the Shramdaan Connect project name and public description. The live site could not be reliably inspected during preparation, so this is a fresh recreation rather than a copy of its original source code.

## Features
- Responsive landing page and navigation
- Search and filter community skills/resources by category and location
- Add a skill/resource listing
- Volunteer registration form
- REST API with Express
- Demo data stored in memory (resets when the server restarts)

## Requirements
- Node.js LTS (Node 20+ recommended)
- npm

## Run on Windows / VS Code
1. Extract this ZIP.
2. Open the extracted `shramdaan-connect` folder in VS Code.
3. Open **Terminal → New Terminal**.
4. Run:
   ```powershell
   npm install
   npm --prefix server install
   npm --prefix client install
   ```
5. Start both apps:
   ```powershell
   npm run dev
   ```
6. Open the Vite URL shown in the terminal, usually `http://localhost:5173`.

The API runs at `http://localhost:4000/api`. Check `http://localhost:4000/api/health`.

### If PowerShell blocks npm
Use `npm.cmd` instead of `npm`, or switch the VS Code terminal profile to **Command Prompt**. For example:
```powershell
npm.cmd install
npm.cmd run dev
```

### Build
```powershell
npm run build
```

## Important notes
- This is a functional demo starter, not the original Replit source code.
- Listings and volunteer registrations are held in server memory. Add a database (SQLite/PostgreSQL/MongoDB) and authentication before using real community data.
- Do not put passwords, API keys, or private personal information into the frontend.
=======
# shramdaan-connect
>>>>>>> 39c4671e0a3a1c750a38285b47a0078ca066f02b
