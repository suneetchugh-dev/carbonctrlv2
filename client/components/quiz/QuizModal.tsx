import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, CheckCircle, XCircle, RotateCcw, Award, Star } from "lucide-react";
import { Button } from "@/components/ui/button";

interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  points: number;
}

interface QuizModalProps {
  isOpen: boolean;
  onClose: () => void;
  quiz: {
    id: string;
    title: string;
    difficulty: string;
    est: string;
  };
  onComplete: (quizId: string, score: number) => void;
}

const sampleQuestions: QuizQuestion[] = [
  {
    id: "q1",
    question: "What is the primary cause of global warming?",
    options: [
      "Increased solar radiation",
      "Greenhouse gas emissions",
      "Volcanic activity",
      "Ocean currents"
    ],
    correctAnswer: 1,
    explanation: "Greenhouse gas emissions, particularly CO2 from burning fossil fuels, are the primary cause of global warming.",
    points: 10
  },
  {
    id: "q2",
    question: "Which renewable energy source is most widely used globally?",
    options: [
      "Solar power",
      "Wind power",
      "Hydroelectric power",
      "Geothermal power"
    ],
    correctAnswer: 2,
    explanation: "Hydroelectric power is the most widely used renewable energy source globally, providing about 16% of the world's electricity.",
    points: 10
  },
  {
    id: "q3",
    question: "What percentage of global CO2 emissions comes from transportation?",
    options: [
      "15%",
      "25%",
      "35%",
      "45%"
    ],
    correctAnswer: 1,
    explanation: "Transportation accounts for approximately 25% of global CO2 emissions, making it a significant contributor to climate change.",
    points: 15
  },
  {
    id: "q4",
    question: "Which of the following is NOT a greenhouse gas?",
    options: [
      "Carbon dioxide (CO2)",
      "Methane (CH4)",
      "Oxygen (O2)",
      "Nitrous oxide (N2O)"
    ],
    correctAnswer: 2,
    explanation: "Oxygen (O2) is not a greenhouse gas. Greenhouse gases include CO2, CH4, N2O, and water vapor.",
    points: 10
  },
  {
    id: "q5",
    question: "What is the main goal of the Paris Agreement?",
    options: [
      "Eliminate all fossil fuels by 2030",
      "Limit global temperature rise to well below 2°C",
      "Increase renewable energy to 50% by 2050",
      "Reduce deforestation by 80%"
    ],
    correctAnswer: 1,
    explanation: "The Paris Agreement aims to limit global temperature rise to well below 2°C above pre-industrial levels, with efforts to limit it to 1.5°C.",
    points: 20
  }
];

export default function QuizModal({ isOpen, onClose, quiz, onComplete }: QuizModalProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes in seconds
  const [isCompleted, setIsCompleted] = useState(false);

  const questions = sampleQuestions;
  const currentQ = questions[currentQuestion];

  useEffect(() => {
    if (!isOpen) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          handleComplete();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen]);

  const handleAnswerSelect = (answerIndex: number) => {
    if (showResult) return;
    setSelectedAnswer(answerIndex);
  };

  const handleSubmitAnswer = () => {
    if (selectedAnswer === null) return;

    const isCorrect = selectedAnswer === currentQ.correctAnswer;
    const newScore = isCorrect ? score + currentQ.points : score;
    const newAnswers = [...answers, selectedAnswer];

    setScore(newScore);
    setAnswers(newAnswers);
    setShowResult(true);

    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(prev => prev + 1);
        setSelectedAnswer(null);
        setShowResult(false);
      } else {
        handleComplete();
      }
    }, 2000);
  };

  const handleComplete = () => {
    setIsCompleted(true);
    onComplete(quiz.id, score);
  };

  const handleRestart = () => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setScore(0);
    setAnswers([]);
    setTimeLeft(300);
    setIsCompleted(false);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getScoreColor = (score: number) => {
    const percentage = (score / (questions.length * 15)) * 100;
    if (percentage >= 80) return "text-green-400";
    if (percentage >= 60) return "text-yellow-400";
    return "text-red-400";
  };

  const getScoreMessage = (score: number) => {
    const percentage = (score / (questions.length * 15)) * 100;
    if (percentage >= 80) return "Excellent! 🌟";
    if (percentage >= 60) return "Good job! 👍";
    return "Keep learning! 📚";
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="relative w-full max-w-2xl h-[80vh] mx-4 bg-black/95 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-white/10 flex-shrink-0">
            <div>
              <h2 className="text-xl font-bold text-white">{quiz.title}</h2>
              <p className="text-white/70 text-sm">{quiz.difficulty} • {quiz.est}</p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-white/70 hover:text-white hover:bg-white/10"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          {/* Quiz Content */}
          <div className="flex-1 p-4 overflow-y-auto min-h-0">
            {!isCompleted ? (
              <div className="h-full flex flex-col">
                {/* Progress and Timer */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <div className="text-white/60 text-sm">
                      Question {currentQuestion + 1} of {questions.length}
                    </div>
                    <div className="w-32 h-2 bg-white/10 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-white/80 transition-all duration-300"
                        style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
                      />
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="text-white/60 text-sm">Time:</div>
                    <div className={`font-mono text-lg ${timeLeft < 60 ? 'text-red-400' : 'text-white'}`}>
                      {formatTime(timeLeft)}
                    </div>
                  </div>
                </div>

                {/* Question */}
                <div className="flex-1 flex flex-col justify-center">
                  <motion.div
                    key={currentQuestion}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-6"
                  >
                    <h3 className="text-xl font-semibold text-white leading-relaxed">
                      {currentQ.question}
                    </h3>

                    {/* Options */}
                    <div className="space-y-3">
                      {currentQ.options.map((option, index) => {
                        const isSelected = selectedAnswer === index;
                        const isCorrect = index === currentQ.correctAnswer;
                        const isWrong = showResult && isSelected && !isCorrect;

                        return (
                          <motion.button
                            key={index}
                            onClick={() => handleAnswerSelect(index)}
                            disabled={showResult}
                            className={`w-full p-4 rounded-xl border text-left transition-all duration-200 ${
                              showResult
                                ? isCorrect
                                  ? 'border-green-400 bg-green-400/10 text-green-300'
                                  : isWrong
                                  ? 'border-red-400 bg-red-400/10 text-red-300'
                                  : 'border-white/20 bg-white/5 text-white/60'
                                : isSelected
                                ? 'border-white/40 bg-white/10 text-white'
                                : 'border-white/20 bg-white/5 text-white/80 hover:border-white/30 hover:bg-white/10'
                            }`}
                            whileHover={!showResult ? { scale: 1.02 } : {}}
                            whileTap={!showResult ? { scale: 0.98 } : {}}
                          >
                            <div className="flex items-center gap-3">
                              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                                showResult
                                  ? isCorrect
                                    ? 'border-green-400 bg-green-400'
                                    : isWrong
                                    ? 'border-red-400 bg-red-400'
                                    : 'border-white/20'
                                  : isSelected
                                  ? 'border-white bg-white'
                                  : 'border-white/40'
                              }`}>
                                {showResult && isCorrect && <CheckCircle className="w-4 h-4 text-black" />}
                                {showResult && isWrong && <XCircle className="w-4 h-4 text-black" />}
                                {!showResult && isSelected && <div className="w-2 h-2 bg-black rounded-full" />}
                              </div>
                              <span className="flex-1">{option}</span>
                              {showResult && isCorrect && <Star className="w-5 h-5 text-green-400" />}
                            </div>
                          </motion.button>
                        );
                      })}
                    </div>

                    {/* Submit Button */}
                    {!showResult && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                      >
                        <Button
                          onClick={handleSubmitAnswer}
                          disabled={selectedAnswer === null}
                          className="w-full bg-white text-black hover:bg-white/90 font-bold py-3 text-lg"
                        >
                          Submit Answer
                        </Button>
                      </motion.div>
                    )}

                    {/* Result Display */}
                    {showResult && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-4 rounded-xl bg-white/5 border border-white/20"
                      >
                        <div className="text-center">
                          <div className={`text-2xl font-bold mb-2 ${
                            selectedAnswer === currentQ.correctAnswer ? 'text-green-400' : 'text-red-400'
                          }`}>
                            {selectedAnswer === currentQ.correctAnswer ? 'Correct!' : 'Incorrect'}
                          </div>
                          <p className="text-white/80 text-sm leading-relaxed">
                            {currentQ.explanation}
                          </p>
                          {selectedAnswer === currentQ.correctAnswer && (
                            <div className="mt-2 text-green-400 font-semibold">
                              +{currentQ.points} points
                            </div>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </motion.div>
                </div>
              </div>
            ) : (
              /* Completion Screen */
              <div className="h-full flex flex-col justify-center text-center space-y-6">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", duration: 0.5 }}
                >
                  <div className="w-20 h-20 mx-auto bg-white/10 rounded-full flex items-center justify-center border border-white/20 mb-4">
                    <Award className="w-10 h-10 text-white" />
                  </div>
                </motion.div>

                <div>
                  <h3 className="text-3xl font-bold text-white mb-2 font-orbitron">Quiz Complete!</h3>
                  <p className="text-white/80 text-lg">
                    {getScoreMessage(score)}
                  </p>
                </div>

                <div className="grid grid-cols-3 gap-4 max-w-md mx-auto">
                  <div className="text-center p-4 bg-white/5 rounded-lg border border-white/10">
                    <div className={`text-2xl font-bold font-orbitron ${getScoreColor(score)}`}>
                      {score}
                    </div>
                    <div className="text-white/60 text-sm">Score</div>
                  </div>
                  <div className="text-center p-4 bg-white/5 rounded-lg border border-white/10">
                    <div className="text-2xl font-bold text-white font-orbitron">
                      {Math.round((score / (questions.length * 15)) * 100)}%
                    </div>
                    <div className="text-white/60 text-sm">Accuracy</div>
                  </div>
                  <div className="text-center p-4 bg-white/5 rounded-lg border border-white/10">
                    <div className="text-2xl font-bold text-white font-orbitron">
                      {questions.length}
                    </div>
                    <div className="text-white/60 text-sm">Questions</div>
                  </div>
                </div>

                <div className="flex gap-4 justify-center">
                  <Button
                    onClick={handleRestart}
                    className="bg-white/10 text-white border border-white/20 hover:bg-white/20"
                  >
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Retake Quiz
                  </Button>
                  <Button
                    onClick={onClose}
                    className="bg-white text-black hover:bg-white/90 font-bold px-6 py-2"
                  >
                    Close
                  </Button>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}


