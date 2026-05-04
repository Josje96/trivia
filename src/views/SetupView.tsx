import React, { useState } from 'react';
import { useGame, type Player } from '../context/GameContext';
import { v4 as uuidv4 } from 'uuid';
import { Plus, Users, Play, Settings } from 'lucide-react';

const SetupView: React.FC = () => {
  const { players, setPlayers, settings, setSettings, setGameStarted } = useGame();
  const [newPlayerName, setNewPlayerName] = useState('');

  const addPlayer = () => {
    if (newPlayerName.trim() && players.length < 10) {
      const newPlayer: Player = {
        id: uuidv4(),
        name: newPlayerName.trim(),
        score: 0,
        isActive: players.length === 0,
      };
      setPlayers([...players, newPlayer]);
      setNewPlayerName('');
    }
  };

  const startGame = () => {
    if (players.length >= 1) {
      setGameStarted(true);
    }
  };

  return (
    <div className="p-8 text-emerald-50">
      <header className="text-center mb-12">
        <h1 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400 mb-2">
          TriviaSync
        </h1>
        <p className="text-emerald-400/60 font-medium">Local Multiplayer Trivia Fun</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Left Column: Player Setup */}
        <section className="space-y-6">
          <div className="flex items-center gap-2 mb-4">
            <Users className="text-emerald-400" />
            <h2 className="text-2xl font-bold">Players ({players.length}/10)</h2>
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              value={newPlayerName}
              onChange={(e) => setNewPlayerName(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addPlayer()}
              placeholder="Enter team/player name..."
              className="flex-1 px-4 py-3 rounded-xl bg-slate-700/50 border-2 border-slate-600 focus:border-emerald-500 outline-none transition-all placeholder:text-slate-500"
            />
            <button
              onClick={addPlayer}
              disabled={players.length >= 10 || !newPlayerName.trim()}
              className="bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-700 text-white p-3 rounded-xl transition-colors shadow-lg shadow-emerald-900/20"
            >
              <Plus />
            </button>
          </div>

          <div className="space-y-2 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
            {players.map((player) => (
              <div
                key={player.id}
                className="flex items-center justify-between p-4 bg-slate-700/30 rounded-xl border border-slate-600/50"
              >
                <span className="font-bold text-emerald-100">{player.name}</span>
                <button
                  onClick={() => setPlayers(players.filter(p => p.id !== player.id))}
                  className="text-red-400 hover:text-red-300 transition-colors text-sm font-bold"
                >
                  Remove
                </button>
              </div>
            ))}
            {players.length === 0 && (
              <p className="text-center text-slate-500 py-8 italic">No players added yet.</p>
            )}
          </div>
        </section>

        {/* Right Column: Game Settings */}
        <section className="space-y-6">
          <div className="flex items-center gap-2 mb-4">
            <Settings className="text-teal-400" />
            <h2 className="text-2xl font-bold">Settings</h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-black text-emerald-500/50 mb-2 uppercase tracking-widest">Point Limit</label>
              <select
                value={settings.pointLimit}
                onChange={(e) => setSettings({ ...settings, pointLimit: Number(e.target.value) })}
                className="w-full px-4 py-3 rounded-xl bg-slate-700/50 border-2 border-slate-600 outline-none focus:border-teal-500 transition-all text-emerald-50"
              >
                <option value={10} className="bg-slate-800">10 Points</option>
                <option value={20} className="bg-slate-800">20 Points</option>
                <option value={50} className="bg-slate-800">50 Points</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-black text-emerald-500/50 mb-2 uppercase tracking-widest">Difficulty</label>
              <div className="grid grid-cols-2 gap-2">
                {['any', 'easy', 'medium', 'hard'].map((diff) => (
                  <button
                    key={diff}
                    onClick={() => setSettings({ ...settings, difficulty: diff as any })}
                    className={`px-4 py-2 rounded-lg font-bold capitalize transition-all ${
                      settings.difficulty === diff
                        ? 'bg-teal-600 text-white shadow-lg shadow-teal-900/40'
                        : 'bg-slate-700/50 text-slate-400 hover:bg-slate-700'
                    }`}
                  >
                    {diff}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <button
            onClick={startGame}
            disabled={players.length === 0}
            className="w-full mt-8 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 disabled:from-slate-700 disabled:to-slate-800 text-white font-black py-4 rounded-2xl flex items-center justify-center gap-2 text-xl shadow-xl shadow-emerald-900/20 transition-all transform hover:scale-[1.02] active:scale-95"
          >
            <Play fill="currentColor" size={20} />
            Start Game
          </button>
        </section>
      </div>
    </div>
  );
};

export default SetupView;
