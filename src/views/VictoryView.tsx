import React, { useEffect } from 'react';
import { useGame } from '../context/GameContext';
import { Trophy, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';

const VictoryView: React.FC = () => {
  const { players, resetGame, settings } = useGame();
  const sortedPlayers = [...players].sort((a, b) => b.score - a.score);
  const winner = sortedPlayers[0];

  useEffect(() => {
    const duration = 5 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

    const interval: any = setInterval(function() {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
    }, 250);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-8 md:p-12 text-center bg-slate-900/50 text-emerald-50">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1, rotate: 360 }}
        transition={{ type: 'spring', damping: 10, stiffness: 100 }}
        className="inline-block bg-emerald-500 p-6 rounded-full shadow-[0_0_50px_rgba(16,185,129,0.3)] mb-8"
      >
        <Trophy size={80} className="text-white" />
      </motion.div>

      <h1 className="text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400 mb-2">VICTORY!</h1>
      <div className="text-2xl md:text-3xl font-bold text-emerald-100 mb-12">
        {winner?.name} is the Trivia Master!
      </div>

      <div className="max-w-md mx-auto bg-slate-800/80 rounded-3xl p-6 md:p-8 mb-12 border border-white/5">
        <h3 className="text-xs font-black text-emerald-500/30 uppercase tracking-[0.2em] mb-6">Final Standings</h3>
        <div className="space-y-4">
          {sortedPlayers.map((player, index) => (
            <div key={player.id} className="flex items-center justify-between p-3 bg-slate-700/30 rounded-2xl border border-white/5 shadow-sm">
              <div className="flex items-center gap-4">
                <span className={`w-10 h-10 flex items-center justify-center rounded-full font-black text-lg ${
                  index === 0 ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-900/20' : 
                  index === 1 ? 'bg-slate-500 text-white' :
                  index === 2 ? 'bg-slate-600 text-white' : 'bg-slate-700 text-slate-400'
                }`}>
                  {index + 1}
                </span>
                <span className="font-bold text-emerald-100 text-lg">{player.name}</span>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="font-black text-2xl text-emerald-400">{player.score}</span>
                <span className="text-[10px] font-bold text-emerald-500/50 uppercase tracking-tighter">pts</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={resetGame}
        className="bg-emerald-600 hover:bg-emerald-500 text-white font-black py-4 px-12 rounded-2xl flex items-center justify-center gap-3 mx-auto text-xl shadow-xl shadow-emerald-900/40 transition-all transform hover:scale-105 active:scale-95"
      >
        <RefreshCw size={24} />
        New Game
      </button>
    </div>
  );
};

export default VictoryView;
