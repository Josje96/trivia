import { useState, useEffect, useCallback, useRef } from 'react';
import { useGame } from '../context/GameContext';
import he from 'he';

export interface Question {
  category: string;
  type: 'multiple' | 'boolean';
  difficulty: 'easy' | 'medium' | 'hard';
  question: string;
  correct_answer: string;
  incorrect_answers: string[];
  all_answers: string[]; // Shuffled
}

export function useTrivia() {
  const { settings, gameStarted } = useGame();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('trivia_session_token'));
  
  const isFetchingToken = useRef(false);

  // Helper to fetch session token
  const getSessionToken = useCallback(async () => {
    if (isFetchingToken.current) return null;
    isFetchingToken.current = true;
    try {
      const response = await fetch('https://opentdb.com/api_token.php?command=request');
      const data = await response.json();
      if (data.response_code === 0) {
        localStorage.setItem('trivia_session_token', data.token);
        setToken(data.token);
        return data.token;
      }
    } catch (err) {
      console.error('Failed to fetch session token:', err);
    } finally {
      isFetchingToken.current = false;
    }
    return null;
  }, []);

  const fetchQuestions = useCallback(async (retryWithNewToken = true) => {
    setLoading(true);
    setError(null);
    try {
      let currentToken = token;
      if (!currentToken) {
        currentToken = await getSessionToken();
      }

      let url = `https://opentdb.com/api.php?amount=50`;
      if (settings.difficulty !== 'any') {
        url += `&difficulty=${settings.difficulty}`;
      }
      if (currentToken) {
        url += `&token=${currentToken}`;
      }

      console.log(`Fetching trivia from: ${url}`);
      const response = await fetch(url);
      const data = await response.json();
      console.log('Trivia API Response:', data);

      if (data.response_code === 0) {
        const processedQuestions = data.results.map((q: any) => {
          const decodedQuestion = he.decode(q.question);
          const decodedCorrect = he.decode(q.correct_answer);
          const decodedIncorrect = q.incorrect_answers.map((a: string) => he.decode(a));
          const all = [...decodedIncorrect, decodedCorrect].sort(() => Math.random() - 0.5);
          
          return {
            ...q,
            question: decodedQuestion,
            correct_answer: decodedCorrect,
            incorrect_answers: decodedIncorrect,
            all_answers: all
          };
        });
        setQuestions(processedQuestions);
        setCurrentIndex(0);
      } else if ((data.response_code === 3 || data.response_code === 4) && retryWithNewToken) {
        // Token Not Found or Token Empty (all questions used)
        console.log('Token expired or empty, requesting reset...');
        const newToken = await getSessionToken();
        if (newToken) {
          // Wait a bit to avoid immediate rate limit on retry
          await new Promise(resolve => setTimeout(resolve, 2000));
          return fetchQuestions(false);
        }
      } else {
        switch(data.response_code) {
          case 1: setError('No Results: Not enough questions for these settings.'); break;
          case 2: setError('Invalid Parameter: The API request was malformed.'); break;
          case 5: setError('Rate Limit: API is busy. Wait 5s and click Retry.'); break;
          default: setError(`API Error: Code ${data.response_code}. Try again later.`);
        }
      }
    } catch (err) {
      setError('Network Error: Could not connect to trivia database.');
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, [settings.difficulty, token, getSessionToken]);

  useEffect(() => {
    if (gameStarted && questions.length === 0 && !loading && !error) {
      fetchQuestions();
    }
  }, [gameStarted, questions.length, loading, error, fetchQuestions]);

  const nextQuestion = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      setQuestions([]); 
    }
  };

  return {
    currentQuestion: questions[currentIndex],
    loading,
    error,
    nextQuestion,
    refreshQuestions: () => {
      setQuestions([]);
      setError(null);
    }
  };
}
