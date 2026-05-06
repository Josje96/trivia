import React, { useState, useEffect } from 'react';
import { useGame, type Player, type TriviaCategory } from '../context/GameContext';
import { v4 as uuidv4 } from 'uuid';
import { Plus, Users, Play, Settings, Baby, Beer } from 'lucide-react';

const FAMILY_CATEGORY_IDS = [9, 10, 11, 13, 14, 17, 22, 27, 32];

const SetupView: React.FC = () => {
  const { players, setPlayers, settings, setSettings, setGameStarted } = useGame();
  const [newPlayerName, setNewPlayerName] = useState('');
  const [categories, setCategories] = useState<TriviaCategory[]>([]);

  useEffect(() => {
    fetch('https://opentdb.com/api_category.php')
      .then(r => r.json())
      .then(data => setCategories(data.trivia_categories ?? []))
      .catch(() => {});
  }, []);

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
    if (players.length >= 1) setGameStarted(true);
  };

  const enableFamilyMode = () => {
    setSettings({ ...settings, familyMode: true, drinkingMode: false, difficulty: 'easy', categoryId: null });
  };

  const disableFamilyMode = () => {
    setSettings({ ...settings, familyMode: false });
  };

  const enableDrinkingMode = () => {
    setSettings({ ...settings, drinkingMode: true, familyMode: false });
  };

  const disableDrinkingMode = () => {
    setSettings({ ...settings, drinkingMode: false });
  };

  const visibleCategories = settings.familyMode
    ? categories.filter(c => FAMILY_CATEGORY_IDS.includes(c.id))
    : categories;

  return (
    <div className="p-8 text-violet-50">
      <header className="text-center mb-10">
        <h1 className="text-5xl font-black text-violet-400 mb-2">
          Trivia@Shindig
        </h1>
        <p className="text-violet-400/60 font-medium">Trivia Night, anywhere.</p>
      </header>

      {/* Mode Banners */}
      {settings.familyMode && (
        <div className="mb-6 flex items-center justify-between bg-cyan-900/40 border border-cyan-500/30 rounded-2xl px-5 py-3">
          <div className="flex items-center gap-2 text-cyan-300 font-bold">
            <Baby size={20} />
            Family Mode active — easy questions, kid-friendly topics
          </div>
          <button onClick={disableFamilyMode} className="text-cyan-500/60 hover:text-cyan-300 text-sm font-bold transition-colors">
            Turn off
          </button>
        </div>
      )}
      {settings.drinkingMode && (
        <div className="mb-6 flex items-center justify-between bg-amber-900/40 border border-amber-500/30 rounded-2xl px-5 py-3">
          <div className="flex items-center gap-2 text-amber-300 font-bold">
            <Beer size={20} />
            Drinking Mode active — wrong = drink, right = give a drink
          </div>
          <button onClick={disableDrinkingMode} className="text-amber-500/60 hover:text-amber-300 text-sm font-bold transition-colors">
            Turn off
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Left Column: Player Setup */}
        <section className="space-y-6">
          <div className="flex items-center gap-2 mb-4">
            <Users className="text-cyan-400" />
            <h2 className="text-2xl font-bold">Players ({players.length}/10)</h2>
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              value={newPlayerName}
              onChange={(e) => setNewPlayerName(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addPlayer()}
              placeholder="Enter team/player name..."
              className="flex-1 px-4 py-3 rounded-xl bg-slate-800/50 border-2 border-slate-700 focus:border-violet-500 outline-none transition-all placeholder:text-slate-500 text-violet-50"
            />
            <button
              onClick={addPlayer}
              disabled={players.length >= 10 || !newPlayerName.trim()}
              className="bg-violet-600 hover:bg-violet-500 disabled:bg-slate-700 text-white p-3 rounded-xl transition-colors"
            >
              <Plus />
            </button>
          </div>

          <div className="space-y-2 max-h-56 overflow-y-auto pr-2">
            {players.map((player) => (
              <div
                key={player.id}
                className="flex items-center justify-between p-4 bg-slate-800/40 rounded-xl border border-violet-500/20"
              >
                <span className="font-bold text-violet-100">{player.name}</span>
                <button
                  onClick={() => setPlayers(players.filter(p => p.id !== player.id))}
                  className="text-pink-400 hover:text-pink-300 transition-colors text-sm font-bold"
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
        <section className="space-y-5">
          <div className="flex items-center gap-2 mb-4">
            <Settings className="text-pink-400" />
            <h2 className="text-2xl font-bold">Settings</h2>
          </div>

          {/* Mode Toggles */}
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={settings.familyMode ? disableFamilyMode : enableFamilyMode}
              className={`flex items-center justify-center gap-2 font-bold py-3 rounded-xl transition-colors ${
                settings.familyMode
                  ? 'bg-cyan-700 text-white'
                  : 'bg-slate-800/50 text-slate-400 hover:bg-slate-700'
              }`}
            >
              <Baby size={18} />
              Family
            </button>
            <button
              onClick={settings.drinkingMode ? disableDrinkingMode : enableDrinkingMode}
              className={`flex items-center justify-center gap-2 font-bold py-3 rounded-xl transition-colors ${
                settings.drinkingMode
                  ? 'bg-amber-600 text-white'
                  : 'bg-slate-800/50 text-slate-400 hover:bg-slate-700'
              }`}
            >
              <Beer size={18} />
              Drinking
            </button>
          </div>

          {/* Point Limit */}
          <div>
            <label className="block text-xs font-black text-violet-400/50 mb-2 uppercase tracking-widest">Point Limit</label>
            <select
              value={settings.pointLimit}
              onChange={(e) => setSettings({ ...settings, pointLimit: Number(e.target.value) })}
              className="w-full px-4 py-3 rounded-xl bg-slate-800/50 border-2 border-slate-700 outline-none focus:border-violet-500 transition-all text-violet-50"
            >
              <option value={10} className="bg-slate-900">10 Points</option>
              <option value={20} className="bg-slate-900">20 Points</option>
              <option value={50} className="bg-slate-900">50 Points</option>
            </select>
          </div>

          {/* Difficulty */}
          <div>
            <label className="block text-xs font-black text-violet-400/50 mb-2 uppercase tracking-widest">Difficulty</label>
            <div className="grid grid-cols-2 gap-2">
              {(['any', 'easy', 'medium', 'hard'] as const).map((diff) => (
                <button
                  key={diff}
                  onClick={() => !settings.familyMode && setSettings({ ...settings, difficulty: diff })}
                  disabled={settings.familyMode && diff !== 'easy'}
                  className={`px-4 py-2 rounded-lg font-bold capitalize transition-all ${
                    settings.difficulty === diff
                      ? 'bg-violet-600 text-white'
                      : 'bg-slate-800/50 text-slate-400 hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed'
                  }`}
                >
                  {diff}
                </button>
              ))}
            </div>
          </div>

          {/* Category */}
          <div>
            <label className="block text-xs font-black text-violet-400/50 mb-2 uppercase tracking-widest">Category</label>
            <select
              value={settings.categoryId ?? ''}
              onChange={(e) => setSettings({ ...settings, categoryId: e.target.value === '' ? null : Number(e.target.value) })}
              className="w-full px-4 py-3 rounded-xl bg-slate-800/50 border-2 border-slate-700 outline-none focus:border-violet-500 transition-all text-violet-50"
            >
              <option value="" className="bg-slate-900">Any Category</option>
              {visibleCategories.map(cat => (
                <option key={cat.id} value={cat.id} className="bg-slate-900">{cat.name}</option>
              ))}
            </select>
          </div>
        </section>
      </div>

      <button
        onClick={startGame}
        disabled={players.length === 0}
        className="w-full mt-10 bg-violet-600 hover:bg-violet-500 disabled:bg-slate-700 text-white font-black py-4 rounded-2xl flex items-center justify-center gap-2 text-xl transition-all transform hover:scale-[1.02] active:scale-95"
      >
        <Play fill="currentColor" size={20} />
        Start Game
      </button>

      <div className="mt-8 text-center">
        <a
          href="https://buymeacoffee.com/joejewe"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-slate-500 hover:text-yellow-400 transition-colors text-sm font-medium"
        >
          ☕ Buy me a coffee
        </a>
      </div>
    </div>
  );
};

export default SetupView;
