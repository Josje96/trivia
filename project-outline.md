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

```
  
Game Settings

  - Player Limit: 1 to 10.  

  - Point Limit: User-defined (e.g., first to 10, 20, or 50).  

  - Difficulty: Easy, Medium, Hard, or Mixed.

## Game Modes

Mode	Description
Classic	

  Turn-based. One team guesses. If correct, they get a point and the turn passes.  
  Reveal All	

  Simultaneous play. All teams input their answers (hidden). Results are revealed at the end of the round.  
  Pass the Mic	

  Turn-based. If a team gets it wrong, the next team gets a chance to steal until someone gets it right.  
  Speed Round	

  Rapid fire. One guess per team per question. First correct answer wins the point.

5. Logic & Persistence Flow

    Initialize: On mount, check localStorage for an existing game session.  

    Fetch: Pull a batch of 50 questions to minimize API calls and handle HTML entity decoding.  

    Turn Management: Use an index-based rotation: (currentIndex + 1) % totalPlayers.  

    Victory: Trigger a celebration/confetti when player.score >= pointLimit.  

6. Project Scaffolding (File Structure)

    /src/components: UI components (Button, Card, Scoreboard).  

    /src/context: GameContext.tsx to manage global state[cite: 1].

    /src/hooks: useTrivia.ts (API logic), useLocalStorage.ts[cite: 1].

    /src/views: SetupView, GameView, VictoryView[cite: 1].

7. Deployment Plan

    Host on GitHub/GitLab[cite: 1].

    Connect to Cloudflare Pages[cite: 1].

    Set build command to npm run build and output to dist[cite: 1].
