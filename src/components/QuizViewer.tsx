import React, { useState } from 'react';
import { Quiz, QuizQuestion } from '@/types';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import {
  X,
  CheckCircle,
  XCircle,
  Trophy,
  RotateCcw,
  ArrowRight
} from 'lucide-react';

interface QuizViewerProps {
  quiz: Quiz;
  onClose: () => void;
  onComplete?: (score: number, passed: boolean) => void;
}

interface QuizAttempt {
  questionId: string;
  selectedAnswer: string;
  isCorrect: boolean;
}

export default function QuizViewer({ quiz, onClose, onComplete }: QuizViewerProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<QuizAttempt[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<string>('');
  const [showExplanation, setShowExplanation] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [finalScore, setFinalScore] = useState(0);

  const currentQuestion = quiz.questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / quiz.questions.length) * 100;
  const isLastQuestion = currentQuestionIndex === quiz.questions.length - 1;

  const handleAnswerSelect = (optionId: string) => {
    setSelectedAnswer(optionId);
  };

  const handleSubmitAnswer = () => {
    if (!selectedAnswer) return;

    const isCorrect = currentQuestion.correct_answer === selectedAnswer;
    const attempt: QuizAttempt = {
      questionId: currentQuestion.id,
      selectedAnswer,
      isCorrect
    };

    setAnswers(prev => [...prev, attempt]);
    setShowExplanation(true);
  };

  const handleNextQuestion = () => {
    if (isLastQuestion) {
      // Calculate final score
      const correctAnswers = answers.filter(a => a.isCorrect).length + 
        (currentQuestion.correct_answer === selectedAnswer ? 1 : 0);
      const score = Math.round((correctAnswers / quiz.questions.length) * 100);
      const passed = score >= quiz.passing_score;
      
      setFinalScore(score);
      setQuizCompleted(true);
      onComplete?.(score, passed);
    } else {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedAnswer('');
      setShowExplanation(false);
    }
  };

  const handleRetakeQuiz = () => {
    setCurrentQuestionIndex(0);
    setAnswers([]);
    setSelectedAnswer('');
    setShowExplanation(false);
    setQuizCompleted(false);
    setFinalScore(0);
  };

  if (quizCompleted) {
    const passed = finalScore >= quiz.passing_score;
    
    return (
      <div className="fixed inset-0 z-50 flex flex-col bg-slate-50">
        {/* Header */}
        <div className="flex items-center justify-between p-4 bg-white border-b">
          <div className="flex items-center space-x-3">
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
            <Badge variant="outline" className="flex items-center space-x-1">
              <Trophy className="w-3 h-3" />
              <span>Quiz Complete</span>
            </Badge>
          </div>
        </div>

        {/* Results */}
        <div className="flex-1 flex items-center justify-center p-4">
          <Card className="w-full max-w-md">
            <CardContent className="p-8 text-center">
              <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 ${
                passed ? 'bg-green-100' : 'bg-red-100'
              }`}>
                {passed ? (
                  <CheckCircle className="w-10 h-10 text-green-600" />
                ) : (
                  <XCircle className="w-10 h-10 text-red-600" />
                )}
              </div>

              <h2 className="text-2xl font-bold text-slate-900 mb-2">
                {passed ? 'Congratulations!' : 'Keep Learning!'}
              </h2>
              
              <p className="text-slate-600 mb-6">
                {passed 
                  ? 'You passed the quiz and demonstrated your understanding.'
                  : `You need ${quiz.passing_score}% to pass. Review the material and try again.`
                }
              </p>

              <div className="bg-slate-50 rounded-lg p-4 mb-6">
                <div className="text-3xl font-bold text-slate-900 mb-1">
                  {finalScore}%
                </div>
                <div className="text-sm text-slate-600">
                  {answers.filter(a => a.isCorrect).length + (currentQuestion.correct_answer === selectedAnswer ? 1 : 0)} of {quiz.questions.length} correct
                </div>
              </div>

              <div className="flex space-x-3">
                {!passed && (
                  <Button
                    variant="outline"
                    onClick={handleRetakeQuiz}
                    className="flex-1"
                  >
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Retake Quiz
                  </Button>
                )}
                <Button
                  onClick={onClose}
                  className="flex-1"
                  style={{ backgroundColor: passed ? '#10B981' : '#6B7280' }}
                >
                  {passed ? 'Continue Learning' : 'Review Material'}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-slate-50">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-white border-b">
        <div className="flex items-center space-x-3">
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
          <Badge variant="outline" className="flex items-center space-x-1">
            <Trophy className="w-3 h-3" />
            <span>{quiz.title}</span>
          </Badge>
        </div>
        <div className="text-sm text-slate-600">
          Question {currentQuestionIndex + 1} of {quiz.questions.length}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="px-4 py-2 bg-white border-b">
        <Progress value={progress} className="h-2" />
      </div>

      {/* Question Content */}
      <div className="flex-1 flex items-center justify-center p-4 overflow-auto">
        <div className="w-full max-w-2xl">
          <Card>
            <CardContent className="p-8">
              <h2 className="text-xl font-semibold text-slate-900 mb-6">
                {currentQuestion.question}
              </h2>

              <div className="space-y-3 mb-6">
                {currentQuestion.options.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => handleAnswerSelect(option.id)}
                    disabled={showExplanation}
                    className={`w-full p-4 text-left border-2 rounded-lg transition-all ${
                      showExplanation
                        ? option.is_correct
                          ? 'border-green-500 bg-green-50 text-green-800'
                          : selectedAnswer === option.id
                          ? 'border-red-500 bg-red-50 text-red-800'
                          : 'border-slate-200 bg-slate-50 text-slate-600'
                        : selectedAnswer === option.id
                        ? 'border-blue-500 bg-blue-50 text-blue-800'
                        : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                        showExplanation
                          ? option.is_correct
                            ? 'border-green-500 bg-green-500'
                            : selectedAnswer === option.id
                            ? 'border-red-500 bg-red-500'
                            : 'border-slate-300'
                          : selectedAnswer === option.id
                          ? 'border-blue-500 bg-blue-500'
                          : 'border-slate-300'
                      }`}>
                        {showExplanation && option.is_correct && (
                          <CheckCircle className="w-4 h-4 text-white" />
                        )}
                        {showExplanation && selectedAnswer === option.id && !option.is_correct && (
                          <XCircle className="w-4 h-4 text-white" />
                        )}
                        {!showExplanation && selectedAnswer === option.id && (
                          <div className="w-2 h-2 bg-white rounded-full" />
                        )}
                      </div>
                      <span className="flex-1">{option.text}</span>
                    </div>
                  </button>
                ))}
              </div>

              {showExplanation && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                  <h3 className="font-medium text-blue-900 mb-2">Explanation</h3>
                  <p className="text-blue-800 text-sm">{currentQuestion.explanation}</p>
                </div>
              )}

              <div className="flex justify-between items-center">
                <div className="text-sm text-slate-500">
                  Passing score: {quiz.passing_score}%
                </div>
                
                {!showExplanation ? (
                  <Button
                    onClick={handleSubmitAnswer}
                    disabled={!selectedAnswer}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    Submit Answer
                  </Button>
                ) : (
                  <Button
                    onClick={handleNextQuestion}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    {isLastQuestion ? 'Finish Quiz' : 'Next Question'}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}