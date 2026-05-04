import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { useTrivia } from '../hooks/useTrivia';
import { ArrowLeft, RefreshCcw, CheckCircle2, XCircle, Award } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const GameView: React.FC = () => {
  const { players, setPlayers, resetGame, settings } = useGame();
  const { currentQuestion, loading, error, nextQuestion, refreshQuestions } = useTrivia();
  
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [showResult, setShowResult] = useState(false);

  const activePlayer = players.find(p => p.isActive) || players[0];

  const handleAnswer = (answer: string) => {
    if (showResult) return;
    
    setSelectedAnswer(answer);
    const correct = answer === currentQuestion.correct_answer;
    setIsCorrect(correct);
    setShowResult(true);

    if (correct) {
      const updatedPlayers = players.map(p => 
        p.id === activePlayer.id ? { ...p, score: p.score + 1 } : p
      );
      setPlayers(updatedPlayers);
    }
  };

  const handleNext = () => {
    const activeIndex = players.findIndex(p => p.id === activePlayer.id);
    const nextIndex = (activeIndex + 1) % players.length;
    
    const updatedPlayers = players.map((p, idx) => ({
      ...p,
      isActive: idx === nextIndex
    }));
    
    setPlayers(updatedPlayers);
    setSelectedAnswer(null);
    setIsCorrect(null);
    setShowResult(false);
    nextQuestion();
  };

  if (loading) {
    return (
      <div className="p-12 text-center h-[600px] flex flex-col items-center justify-center text-emerald-400">
        <RefreshCcw className="animate-spin mb-4" size={48} />
        <h2 className="text-2xl font-bold">Diving for Questions...</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-12 text-center text-emerald-50">
        <XCircle className="text-red-400 mx-auto mb-4" size={48} />
        <h2 className="text-2xl font-bold mb-4">{error}</h2>
        <div className="flex justify-center gap-4">
          <button onClick={resetGame} className="bg-slate-700 text-slate-300 px-6 py-3 rounded-xl font-bold hover:bg-slate-600 transition-colors">
            Exit to Setup
          </button>
          <button onClick={refreshQuestions} className="bg-emerald-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-emerald-500 transition-colors">
            Retry Now
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-10 text-emerald-50">
      {/* Top Bar */}
      <div className="flex justify-between items-center mb-8">
        <button 
          onClick={resetGame}
          className="flex items-center gap-2 text-slate-500 hover:text-emerald-400 transition-colors font-bold"
        >
          <ArrowLeft size={20} />
          Exit
        </button>
        <div className="flex items-center gap-4">
           <div className="bg-slate-700/50 text-slate-400 px-4 py-1 rounded-full font-bold text-xs uppercase">
            Goal: {settings.pointLimit} pts
          </div>
          <div className="bg-teal-900/50 text-teal-400 px-4 py-1 rounded-full font-black text-xs uppercase tracking-widest border border-teal-500/20">
            {currentQuestion?.difficulty}
          </div>
        </div>
      </div>

      {/* Players Scoreboard */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-10">
        {players.map(player => (
          <div 
            key={player.id}
            className={`p-3 rounded-2xl border-2 transition-all relative ${
              player.id === activePlayer.id 
                ? 'border-emerald-500 bg-emerald-500/10 shadow-lg shadow-emerald-900/20 scale-105 z-10' 
                : 'border-slate-700/50 bg-slate-800/50 opacity-50'
            }`}
          >
            {player.id === activePlayer.id && (
              <motion.div 
                layoutId="active-indicator"
                className="absolute -top-2 -right-2 bg-emerald-500 text-white p-1 rounded-full shadow-lg"
              >
                <Award size={14} />
              </motion.div>
            )}
            <div className="text-[10px] font-black text-emerald-500/50 uppercase leading-none mb-1 truncate pr-2">
              {player.name}
            </div>
            <div className="text-lg font-black text-emerald-100 leading-none">{player.score}</div>
          </div>
        ))}
      </div>

      {/* Question Card */}
      <div className="bg-slate-800/50 rounded-3xl p-8 border border-white/5 relative overflow-hidden min-h-[420px] flex flex-col shadow-inner">
        <div className="mb-8">
          <span className="text-sm font-black text-emerald-400/50 uppercase tracking-widest mb-2 block">
            Question for {activePlayer.name}
          </span>
          <h2 className="text-2xl md:text-3xl font-bold text-emerald-50 leading-tight">
            {currentQuestion?.question}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-auto">
          {currentQuestion?.all_answers.map((answer, index) => {
            const isSelected = selectedAnswer === answer;
            const isCorrectAnswer = answer === currentQuestion.correct_answer;
            
            let btnClass = "p-5 rounded-2xl border-2 font-bold text-left transition-all text-lg flex items-center justify-between ";
            
            if (!showResult) {
              btnClass += "border-slate-700 bg-slate-700/30 hover:border-emerald-500 hover:bg-emerald-500/10 text-emerald-100 active:scale-95";
            } else {
              if (isCorrectAnswer) {
                btnClass += "border-emerald-500 bg-emerald-500/20 text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.1)]";
              } else if (isSelected && !isCorrect) {
                btnClass += "border-red-500/50 bg-red-500/10 text-red-400";
              } else {
                btnClass += "border-slate-700/50 text-slate-600";
              }
            }

            return (
              <button
                key={index}
                onClick={() => handleAnswer(answer)}
                disabled={showResult}
                className={btnClass}
              >
                <span>{answer}</span>
                {showResult && isCorrectAnswer && <CheckCircle2 className="text-emerald-400 shrink-0" />}
                {showResult && isSelected && !isCorrect && <XCircle className="text-red-500 shrink-0" />}
              </button>
            );
          })}
        </div>

        {/* Feedback Overlay */}
        <AnimatePresence>
          {showResult && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute bottom-0 left-0 right-0 p-6 bg-slate-900/95 backdrop-blur-xl border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4"
            >
              <div className="flex items-center gap-3">
                {isCorrect ? (
                  <div className="flex items-center gap-2 text-emerald-400 font-black text-xl italic uppercase">
                    <CheckCircle2 size={32} />
                    Correct! +1
                  </div>
                ) : (
                  <div className="flex flex-col">
                    <div className="text-red-400 font-black text-xl italic uppercase flex items-center gap-2 leading-none">
                      <XCircle size={32} />
                      Wrong!
                    </div>
                    <div className="text-slate-500 text-sm mt-1">Answer: <b className="text-emerald-400/80">{currentQuestion.correct_answer}</b></div>
                  </div>
                )}
              </div>
              <button
                onClick={handleNext}
                className="w-full md:w-auto bg-emerald-600 hover:bg-emerald-500 text-white font-black py-4 px-10 rounded-2xl transition-all shadow-xl shadow-emerald-900/20 uppercase tracking-widest text-sm"
              >
                Next Turn
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default GameView;
