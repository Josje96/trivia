# Project Specification: TriviaSync (Static Multiplayer Trivia App)

## 1. Overview
A serverless, static React web application that uses the Open Trivia Database API. The game is designed for local multiplayer (up to 10 players/teams) and runs entirely in the browser using local storage for persistence.

## 2. Core Technical Requirements
- **Framework:** React (Vite)
- **Deployment:** Cloudflare Pages (Auto-rebuilds on git commits to `main`)
- **State Management:** React Context API + LocalStorage (No backend/database)
- **API:** [Open Trivia DB](https://opentdb.com/api_config.php)[cite: 1]
- **Styling:** Fun, vibrant UI (Tailwind CSS + Framer Motion)

## 3. Game Configuration & Models
### Player/Team Model
```json
{
  "id": "uuid",
  "name": "Team Name",
  "score": 0,
  "isActive": false
}
