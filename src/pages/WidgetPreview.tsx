import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Play, 
  CheckCircle, 
  Star,
  Clock,
  Award,
  BookOpen,
  Target,
  User,
  Settings,
  X,
  Minimize2,
  Maximize2
} from 'lucide-react';

export default function WidgetPreview() {
  const { clientId } = useParams();
  const [isMinimized, setIsMinimized] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  // Mock client branding based on clientId
  const clientBranding = {
    'first-national': {
      name: 'First National Bank',
      primaryColor: '#1E40AF',
      logo: '/logos/fnb.png',
      accentColor: '#3B82F6'
    },
    'community-cu': {
      name: 'Community Credit Union',
      primaryColor: '#059669',
      logo: '/logos/ccu.png',
      accentColor: '#10B981'
    },
    'metro-financial': {
      name: 'Metro Financial',
      primaryColor: '#DC2626',
      logo: '/logos/metro.png',
      accentColor: '#EF4444'
    }
  };

  const branding = clientBranding[clientId as keyof typeof clientBranding] || clientBranding['first-national'];

  const userProgress = {
    level: 2,
    title: 'Budget Builder',
    totalPoints: 1250,
    currentStreak: 7,
    completedCourses: 3,
    totalCourses: 8
  };

  const recommendedContent = [
    {
      id: 1,
      title: 'Emergency Fund Essentials',
      type: 'Module',
      duration: '25 min',
      difficulty: 'Beginner',
      progress: 0,
      rating: 4.8,
      description: 'Learn why emergency funds are crucial and how to build one.'
    },
    {
      id: 2,
      title: 'Credit Score Basics',
      type: 'Lesson',
      duration: '15 min',
      difficulty: 'Beginner',
      progress: 60,
      rating: 4.6,
      description: 'Understand what affects your credit score and how to improve it.'
    },
    {
      id: 3,
      title: 'Investment Fundamentals Quiz',
      type: 'Quiz',
      duration: '10 min',
      difficulty: 'Intermediate',
      progress: 0,
      rating: 4.7,
      description: 'Test your knowledge of basic investment concepts.'
    }
  ];

  const recentAchievements = [
    { title: 'Budget Master', icon: Target, earned: '2 days ago' },
    { title: 'Week Warrior', icon: Award, earned: '1 week ago' },
    { title: 'First Steps', icon: Star, earned: '2 weeks ago' }
  ];

  if (isMinimized) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <Button
          onClick={() => setIsMinimized(false)}
          className="rounded-full w-14 h-14 shadow-lg"
          style={{ backgroundColor: branding.primaryColor }}
        >
          <BookOpen className="w-6 h-6" />
        </Button>
      </div>
    );
  }

  return (
    <div className={`fixed ${isExpanded ? 'inset-4' : 'bottom-4 right-4 w-96 h-[600px]'} z-50 transition-all duration-300`}>
      <Card className="h-full flex flex-col shadow-2xl border-0">
        {/* Header */}
        <CardHeader 
          className="flex-shrink-0 text-white rounded-t-lg"
          style={{ backgroundColor: branding.primaryColor }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                <BookOpen className="w-4 h-4" />
              </div>
              <div>
                <CardTitle className="text-lg">{branding.name}</CardTitle>
                <CardDescription className="text-white/80 text-sm">
                  Financial Learning Hub
                </CardDescription>
              </div>
            </div>
            <div className="flex items-center space-x-1">
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 text-white hover:bg-white/20"
                onClick={() => setIsExpanded(!isExpanded)}
              >
                {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 text-white hover:bg-white/20"
                onClick={() => setIsMinimized(true)}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardHeader>

        {/* Content */}
        <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* User Progress */}
          <div className="bg-slate-50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <User className="w-5 h-5 text-slate-600" />
                <span className="font-medium text-slate-900">Your Progress</span>
              </div>
              <Badge 
                className="text-xs"
                style={{ backgroundColor: `${branding.primaryColor}20`, color: branding.primaryColor }}
              >
                Level {userProgress.level}
              </Badge>
            </div>
            
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-slate-600">Course Progress</span>
                  <span className="font-medium">{userProgress.completedCourses}/{userProgress.totalCourses}</span>
                </div>
                <Progress 
                  value={(userProgress.completedCourses / userProgress.totalCourses) * 100} 
                  className="h-2"
                />
              </div>
              
              <div className="grid grid-cols-3 gap-3 text-center">
                <div>
                  <div className="text-lg font-bold" style={{ color: branding.primaryColor }}>
                    {userProgress.totalPoints}
                  </div>
                  <div className="text-xs text-slate-600">Points</div>
                </div>
                <div>
                  <div className="text-lg font-bold" style={{ color: branding.primaryColor }}>
                    {userProgress.currentStreak}
                  </div>
                  <div className="text-xs text-slate-600">Day Streak</div>
                </div>
                <div>
                  <div className="text-lg font-bold" style={{ color: branding.primaryColor }}>
                    {userProgress.level}
                  </div>
                  <div className="text-xs text-slate-600">Level</div>
                </div>
              </div>
            </div>
          </div>

          {/* Recommended Content */}
          <div>
            <h3 className="font-semibold text-slate-900 mb-3">Recommended for You</h3>
            <div className="space-y-3">
              {recommendedContent.map((content) => (
                <div key={content.id} className="border border-slate-200 rounded-lg p-3 hover:bg-slate-50 transition-colors">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h4 className="font-medium text-slate-900 text-sm">{content.title}</h4>
                      <p className="text-xs text-slate-600 mt-1">{content.description}</p>
                    </div>
                    <Badge variant="outline" className="text-xs ml-2">
                      {content.type}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3 text-xs text-slate-600">
                      <span className="flex items-center">
                        <Clock className="w-3 h-3 mr-1" />
                        {content.duration}
                      </span>
                      <span className="flex items-center">
                        <Star className="w-3 h-3 mr-1" />
                        {content.rating}
                      </span>
                      <Badge variant="secondary" className="text-xs">
                        {content.difficulty}
                      </Badge>
                    </div>
                    
                    <Button 
                      size="sm" 
                      className="h-7 text-xs"
                      style={{ backgroundColor: branding.primaryColor }}
                    >
                      {content.progress > 0 ? 'Continue' : 'Start'}
                    </Button>
                  </div>
                  
                  {content.progress > 0 && (
                    <Progress value={content.progress} className="h-1 mt-2" />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Recent Achievements */}
          <div>
            <h3 className="font-semibold text-slate-900 mb-3">Recent Achievements</h3>
            <div className="space-y-2">
              {recentAchievements.map((achievement, index) => (
                <div key={index} className="flex items-center space-x-3 p-2 bg-slate-50 rounded-lg">
                  <div 
                    className="w-8 h-8 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: `${branding.primaryColor}20` }}
                  >
                    <achievement.icon 
                      className="w-4 h-4" 
                      style={{ color: branding.primaryColor }}
                    />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-sm text-slate-900">{achievement.title}</div>
                    <div className="text-xs text-slate-600">{achievement.earned}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>

        {/* Footer */}
        <div className="flex-shrink-0 p-4 border-t border-slate-200">
          <div className="flex items-center justify-between">
            <Button 
              variant="outline" 
              size="sm" 
              className="flex-1 mr-2"
            >
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </Button>
            <Button 
              size="sm" 
              className="flex-1"
              style={{ backgroundColor: branding.primaryColor }}
            >
              <BookOpen className="w-4 h-4 mr-2" />
              Browse All
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}