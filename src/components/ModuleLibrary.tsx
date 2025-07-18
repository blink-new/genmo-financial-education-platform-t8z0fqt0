import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useApp } from '@/hooks/useApp';
import LessonViewer from '@/components/LessonViewer';
import QuizViewer from '@/components/QuizViewer';
import { Lesson, Quiz } from '@/types';
import { 
  Search,
  Shield,
  TrendingUp,
  BarChart3,
  Target,
  PiggyBank,
  Banknote,
  User,
  ArrowLeft,
  BookOpen,
  Award,
  Clock,
  X
} from 'lucide-react';

interface Module {
  id: string;
  title: string;
  icon: React.ComponentType<any>;
  points: number;
  progress: number;
  lessonsCompleted: number;
  totalLessons: number;
  demographic: 'adult' | 'teens';
}

interface ModuleLibraryProps {
  clientBranding?: {
    name: string;
    primaryColor: string;
    accentColor: string;
    logo: string;
  };
}

export default function ModuleLibrary({ clientBranding }: ModuleLibraryProps) {
  const { skills, modules, lessons, quizzes } = useApp();
  const [selectedDemographic, setSelectedDemographic] = useState<'adult' | 'teens'>('adult');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedModule, setSelectedModule] = useState<string | null>(null);
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [selectedQuiz, setSelectedQuiz] = useState<Quiz | null>(null);
  const [completedLessons, setCompletedLessons] = useState<Set<string>>(new Set());

  const defaultBranding = {
    name: 'GenMo',
    primaryColor: '#2563EB',
    accentColor: '#10B981',
    logo: 'GM'
  };

  const branding = clientBranding || defaultBranding;

  // Map modules to the format expected by the UI
  const getIconForModule = (title: string) => {
    const titleLower = title.toLowerCase();
    if (titleLower.includes('budget')) return Target;
    if (titleLower.includes('investment')) return TrendingUp;
    if (titleLower.includes('credit')) return BarChart3;
    if (titleLower.includes('retirement')) return PiggyBank;
    if (titleLower.includes('business')) return Banknote;
    if (titleLower.includes('emergency')) return Shield;
    if (titleLower.includes('risk')) return TrendingUp;
    if (titleLower.includes('reward')) return Award;
    if (titleLower.includes('insurance')) return Shield;
    return BookOpen;
  };

  const publishedModules: Module[] = modules
    .filter(module => module.status === 'published' || module.status === 'draft')
    .map(module => {
      const moduleLessons = lessons.filter(l => l.module_id === module.id && (l.status === 'published' || l.status === 'draft'));
      
      return {
        id: module.id,
        title: module.title,
        icon: getIconForModule(module.title),
        points: Math.floor(module.estimated_duration / 5), // Rough points calculation
        progress: 25, // Demo progress
        lessonsCompleted: 0, // No completion tracking yet
        totalLessons: moduleLessons.length,
        demographic: 'adult' as const // Default to adult for now
      };
    });

  const filteredModules = publishedModules.filter(module => {
    const matchesDemographic = module.demographic === selectedDemographic;
    const matchesSearch = module.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesDemographic && matchesSearch;
  });

  const getModuleLessons = (moduleId: string) => {
    // For demo purposes, show both published and draft lessons
    return lessons
      .filter(l => l.module_id === moduleId && (l.status === 'published' || l.status === 'draft'))
      .sort((a, b) => a.order_index - b.order_index);
  };

  const handleLessonClick = (lesson: Lesson) => {
    // Check if lesson has cards, if not, create a basic card structure
    if (!lesson.cards || lesson.cards.length === 0) {
      const enhancedLesson = {
        ...lesson,
        cards: [
          {
            id: `card-${lesson.id}-1`,
            type: 'text' as const,
            title: lesson.title,
            content: lesson.description || 'This lesson is currently being developed. Please check back later for content.',
            styling: {
              background_color: '#FFFFFF',
              text_color: '#1F2937',
              font_size: 'medium' as const,
              padding: 'medium' as const,
              border_radius: 'medium' as const,
              shadow: 'small' as const,
              text_align: 'left' as const
            },
            order_index: 1
          }
        ]
      };
      setSelectedLesson(enhancedLesson);
    } else {
      setSelectedLesson(lesson);
    }
  };

  const handleLessonComplete = (lessonId: string) => {
    setSelectedLesson(null);
    setCompletedLessons(prev => new Set([...prev, lessonId]));
    
    // Check if there's a quiz for this lesson
    const quiz = quizzes.find(q => q.lesson_id === lessonId && (q.status === 'published' || q.status === 'draft'));
    if (quiz) {
      setSelectedQuiz(quiz);
    }
  };

  const handleQuizComplete = (score: number, passed: boolean) => {
    setSelectedQuiz(null);
    // Here you could save quiz results, update progress, etc.
    console.log(`Quiz completed with score: ${score}%, passed: ${passed}`);
  };

  // If a quiz is selected, show the quiz viewer
  if (selectedQuiz) {
    return (
      <QuizViewer
        quiz={selectedQuiz}
        onClose={() => setSelectedQuiz(null)}
        onComplete={handleQuizComplete}
      />
    );
  }

  // If a lesson is selected, show the lesson viewer
  if (selectedLesson) {
    return (
      <LessonViewer
        lesson={selectedLesson}
        onClose={() => setSelectedLesson(null)}
        onComplete={() => handleLessonComplete(selectedLesson.id)}
      />
    );
  }

  // If a module is selected, show the lesson list
  if (selectedModule) {
    const selectedModuleData = modules.find(m => m.id === selectedModule);
    const moduleLessons = getModuleLessons(selectedModule);
    
    return (
      <div className="min-h-screen" style={{ backgroundColor: '#F9FAFB' }}>
        {/* Header */}
        <div className="bg-white border-b border-slate-200 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div 
                  className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold"
                  style={{ backgroundColor: branding.primaryColor }}
                >
                  {branding.logo}
                </div>
                <div>
                  <h1 className="text-lg font-semibold text-slate-900">Content Library Demo</h1>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-medium">M</span>
                </div>
                <div className="w-8 h-8 bg-slate-200 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-slate-600" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-2xl mx-auto px-6 py-8">
          {/* Back Button */}
          <div className="mb-6">
            <Button
              variant="ghost"
              onClick={() => setSelectedModule(null)}
              className="text-blue-600 hover:text-blue-700 p-0"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Modules
            </Button>
          </div>

          {/* Module Header */}
          {selectedModuleData && (
            <Card className="mb-6 border-2" style={{ borderColor: '#F59E0B' }}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-semibold text-slate-900 mb-2">{selectedModuleData.title}</h2>
                    <p className="text-sm text-slate-600">
                      0 of {moduleLessons.length} lessons completed
                    </p>
                    <p className="text-sm text-slate-500 mt-1">{selectedModuleData.description}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-bold">{Math.floor(selectedModuleData.estimated_duration / 5)}</span>
                    </div>
                  </div>
                </div>
                <div className="mt-4">
                  <div className="text-right text-sm text-slate-600 mb-1">25%</div>
                  <Progress 
                    value={25} 
                    className="h-3"
                    style={{ 
                      '--progress-background': '#F59E0B' 
                    } as React.CSSProperties}
                  />
                </div>
              </CardContent>
            </Card>
          )}

          {/* Lessons List */}
          <div className="space-y-8">
            {moduleLessons.map((lesson, index) => {
              const isCompleted = completedLessons.has(lesson.id);
              const hasQuiz = quizzes.some(q => q.lesson_id === lesson.id && (q.status === 'published' || q.status === 'draft'));
              
              return (
                <div key={lesson.id} className="flex flex-col items-center">
                  <div className="relative">
                    <div 
                      className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl cursor-pointer hover:scale-105 transition-transform shadow-lg ${
                        isCompleted ? 'ring-4 ring-green-200' : ''
                      }`}
                      style={{ backgroundColor: isCompleted ? '#10B981' : lesson.appearance.circle_color }}
                      onClick={() => handleLessonClick(lesson)}
                      title={lesson.title}
                    >
                      {isCompleted ? '✓' : lesson.appearance.circle_icon}
                    </div>
                    {hasQuiz && (
                      <div className="absolute -top-1 -right-1 w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs font-bold">Q</span>
                      </div>
                    )}
                  </div>
                  <div className="mt-4 text-center">
                    <h3 
                      className={`font-medium text-lg cursor-pointer hover:underline ${
                        isCompleted ? 'text-green-700' : ''
                      }`}
                      style={!isCompleted ? { 
                        color: lesson.appearance.text_color,
                        fontFamily: lesson.appearance.text_font 
                      } : {}}
                      onClick={() => handleLessonClick(lesson)}
                    >
                      {lesson.title}
                      {isCompleted && <span className="ml-2 text-green-600">✓</span>}
                    </h3>
                    <p className="text-sm text-slate-500 mt-1">
                      Lesson {index + 1}
                      {lesson.cards && lesson.cards.length > 0 ? (
                        <span className="ml-2 text-xs text-green-600">
                          • {lesson.cards.length} cards
                        </span>
                      ) : (
                        <span className="ml-2 text-xs text-blue-600">
                          • {lesson.content_type} lesson
                        </span>
                      )}
                      {hasQuiz && (
                        <span className="ml-2 text-xs text-orange-600">
                          • Quiz included
                        </span>
                      )}
                    </p>
                    {isCompleted && (
                      <Badge className="mt-2 bg-green-100 text-green-800 text-xs">
                        Completed
                      </Badge>
                    )}
                  </div>
                  
                  {/* Connecting line to next lesson */}
                  {index < moduleLessons.length - 1 && (
                    <div className={`w-0.5 h-12 mt-6 ${
                      isCompleted ? 'bg-green-300' : 'bg-slate-300'
                    }`}></div>
                  )}
                </div>
              );
            })}

            {moduleLessons.length === 0 && (
              <div className="text-center py-12">
                <BookOpen className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-slate-900 mb-2">No lessons available</h3>
                <p className="text-slate-600">
                  This module doesn't have any published lessons yet.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Default module library view
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div 
                className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold"
                style={{ backgroundColor: branding.primaryColor }}
              >
                {branding.logo}
              </div>
              <div>
                <h1 className="text-lg font-semibold text-slate-900">Content Library Demo</h1>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-medium">M</span>
              </div>
              <div className="w-8 h-8 bg-slate-200 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-slate-600" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Back to Demo Link */}
        <div className="mb-6">
          <Link to="/demo" className="inline-flex items-center text-blue-600 hover:text-blue-700 text-sm font-medium">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Demo Portal
          </Link>
        </div>

        {/* Demographic Toggle */}
        <div className="flex items-center space-x-2 mb-6">
          <Button
            variant={selectedDemographic === 'adult' ? 'default' : 'outline'}
            onClick={() => setSelectedDemographic('adult')}
            className={`rounded-full px-6 ${
              selectedDemographic === 'adult' 
                ? 'bg-green-500 hover:bg-green-600 text-white' 
                : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
            }`}
          >
            Adult
          </Button>
          <Button
            variant={selectedDemographic === 'teens' ? 'default' : 'outline'}
            onClick={() => setSelectedDemographic('teens')}
            className={`rounded-full px-6 ${
              selectedDemographic === 'teens' 
                ? 'bg-green-500 hover:bg-green-600 text-white' 
                : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
            }`}
          >
            Teens
          </Button>
        </div>

        {/* Search Bar */}
        <div className="relative mb-8 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            type="text"
            placeholder="Search for topics"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-white border-slate-300 rounded-lg"
          />
        </div>

        {/* Module Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredModules.map((module) => (
            <Card key={module.id} className="bg-white border border-slate-200 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                {/* Module Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center">
                      <module.icon className="w-6 h-6 text-slate-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900 text-base">{module.title}</h3>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1">
                    <div className="w-5 h-5 bg-orange-400 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs font-bold">⚡</span>
                    </div>
                    <span className="text-sm font-medium text-slate-700">{module.points}</span>
                  </div>
                </div>

                {/* Progress */}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-slate-600">{module.progress}%</span>
                  </div>
                  <Progress value={module.progress} className="h-2 bg-slate-100" />
                </div>

                {/* Lessons Info */}
                <div className="mb-4">
                  <p className="text-sm text-slate-600">
                    {module.lessonsCompleted} of {module.totalLessons} lessons completed
                  </p>
                </div>

                {/* Start Button */}
                <Button 
                  className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium"
                  variant="secondary"
                  onClick={() => setSelectedModule(module.id)}
                >
                  START
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Show message if no modules found */}
        {filteredModules.length === 0 && (
          <div className="text-center py-12">
            <div className="text-slate-400 mb-2">No modules found</div>
            <p className="text-sm text-slate-600">
              Try adjusting your search or demographic selection
            </p>
          </div>
        )}
      </div>
    </div>
  );
}