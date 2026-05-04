import { GameProvider, useGame } from './context/GameContext';
import SetupView from './views/SetupView';
import GameView from './views/GameView';
import VictoryView from './views/VictoryView';
import { motion, AnimatePresence } from 'framer-motion';

function GameContainer() {
  const { gameStarted, players, settings } = useGame();
  
  const getActiveView = () => {
    if (!gameStarted) return <SetupView />;
    
    const winner = players.find(p => p.score >= settings.pointLimit);
    if (winner) return <VictoryView />;
    
    return <GameView />;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-teal-900 to-emerald-900 p-4 md:p-8 flex items-center justify-center">
      <AnimatePresence mode="wait">
        <motion.div
          key={gameStarted ? (players.some(p => p.score >= settings.pointLimit) ? 'victory' : 'game') : 'setup'}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="w-full max-w-4xl bg-slate-800/90 backdrop-blur-xl rounded-[2.5rem] shadow-2xl overflow-hidden border border-white/10"
        >
          {getActiveView()}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

function App() {
  return (
    <GameProvider>
      <GameContainer />
    </GameProvider>
  );
}

export default App;
