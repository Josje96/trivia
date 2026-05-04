# TriviaSync 

A serverless, static-file multiplayer trivia application. **TriviaSync** allows players to engage in real-time trivia battles without a heavy backend, utilizing the OpenTDB API and browser-based synchronization.

## Overview

TriviaSync is designed to be lightweight and fast. Built with **React** and **Vite**, it is hosted as a static site on **Cloudflare Pages**. It leverages a "serverless-first" philosophy, using browser storage and unique session IDs to keep players in sync.

- **Frontend:** React + Vite
- **API:** Open Trivia Database (OpenTDB)
- **Deployment:** Cloudflare Pages
- **State Management:** Local/Session Storage & React Hooks

## Features

*   **Multiplayer Sync:** Play together using a serverless synchronization logic.
*   **Dynamic Categories:** Pulls fresh questions from various categories via OpenTDB.
*   **Static-File Architecture:** No dedicated database or server required—runs entirely in the browser environment.
*   **Mobile Friendly:** Designed to work across different machines and devices.

## Development & Setup

Since this project uses Vite, getting started is straightforward.

### Prerequisites
*   Node.js (LTS version recommended)
*   GitHub CLI (optional, but recommended for repo management)

### Installation
1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/your-username/triviasync.git](https://github.com/your-username/triviasync.git)
    cd triviasync
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    ```
3.  **Run the development server:**
    ```bash
    npm run dev
