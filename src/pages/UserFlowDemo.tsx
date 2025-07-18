import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { useApp } from '@/hooks/useApp';
import { 
  ArrowRight,
  ArrowLeft,
  Mail,
  Home,
  User,
  BookOpen,
  Target,
  Play,
  CheckCircle,
  Star,
  Award,
  Clock,
  Zap,
  Trophy,
  Users,
  TrendingUp,
  Smartphone,
  X
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface FlowStep {
  id: string;
  title: string;
  description: string;
  screen: React.ReactNode;
}

export default function UserFlowDemo() {
  const { skills: realSkills, modules, lessons, clients } = useApp();
  const [currentStep, setCurrentStep] = useState(0);
  const [userEmail, setUserEmail] = useState('');
  const [selectedSkill, setSelectedSkill] = useState<string | null>(null);
  const [completedLessons, setCompletedLessons] = useState<Set<string>>(new Set());
  const [userProgress, setUserProgress] = useState({
    level: 1,
    points: 0,
    streak: 0,
    badges: [] as string[]
  });

  // Use first client for branding, or default
  const firstClient = clients[0];
  const clientBranding = firstClient ? {
    name: firstClient.name,
    primaryColor: firstClient.branding.primary_color,
    accentColor: firstClient.branding.accent_color,
    logo: firstClient.name.split(' ').map(word => word[0]).join('').toUpperCase()
  } : {
    name: 'GenMo Demo',
    primaryColor: '#1E40AF',
    accentColor: '#3B82F6',
    logo: 'GM'
  };

  // Map real skills to the format expected by the UI
  const getIconForSkill = (title: string) => {
    const titleLower = title.toLowerCase();
    if (titleLower.includes('budget')) return Target;
    if (titleLower.includes('investment')) return TrendingUp;
    if (titleLower.includes('credit')) return TrendingUp;
    if (titleLower.includes('retirement')) return Award;
    if (titleLower.includes('business')) return TrendingUp;
    if (titleLower.includes('emergency')) return Award;
    return BookOpen;
  };

  const skills = realSkills
    .filter(skill => skill.status === 'published')
    .slice(0, 3) // Show only first 3 for demo
    .map(skill => {
      const skillModules = modules.filter(m => m.skill_id === skill.id);
      return {
        id: skill.id,
        title: skill.title,
        description: skill.description,
        difficulty: skill.difficulty.charAt(0).toUpperCase() + skill.difficulty.slice(1),
        duration: `${skill.estimated_duration} min`,
        modules: skillModules.length,
        icon: getIconForSkill(skill.title)
      };
    });

  // Use real module data if available, otherwise use sample data
  const firstModule = modules.find(m => m.status === 'published' || m.status === 'draft');
  const sampleModule = firstModule ? {
    title: firstModule.title,
    lessons: lessons
      .filter(l => l.module_id === firstModule.id && (l.status === 'published' || l.status === 'draft'))
      .map(lesson => ({
        id: lesson.id,
        title: lesson.title,
        duration: lesson.estimated_duration || 10,
        completed: false
      })),
    quiz: { 
      title: `${firstModule.title} Knowledge Check`, 
      questions: 5, 
      duration: 5 
    }
  } : {
    title: 'Understanding Your Income',
    lessons: [
      { id: 'lesson1', title: 'Types of Income', duration: 8, completed: false },
      { id: 'lesson2', title: 'Calculating Net Income', duration: 12, completed: false },
      { id: 'lesson3', title: 'Income Tracking Tools', duration: 10, completed: false }
    ],
    quiz: { title: 'Income Knowledge Check', questions: 5, duration: 5 }
  };

  const flowSteps: FlowStep[] = [
    {
      id: 'welcome',
      title: 'Welcome Screen',
      description: 'User opens the widget for the first time',
      screen: (
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-8 rounded-lg text-center">
          <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-white font-bold text-xl">{clientBranding.logo}</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">
            Welcome to {clientBranding.name} Financial Learning
          </h2>
          <p className="text-slate-600 mb-6 max-w-md mx-auto">
            Improve your financial literacy with personalized learning paths designed just for you.
          </p>
          <div className="flex items-center justify-center space-x-4 text-sm text-slate-500 mb-6">
            <div className="flex items-center">
              <Clock className="w-4 h-4 mr-1" />
              <span>Self-paced</span>
            </div>
            <div className="flex items-center">
              <Award className="w-4 h-4 mr-1" />
              <span>Earn badges</span>
            </div>
            <div className="flex items-center">
              <Smartphone className="w-4 h-4 mr-1" />
              <span>Mobile friendly</span>
            </div>
          </div>
          <Button 
            className="w-full max-w-sm"
            style={{ backgroundColor: clientBranding.primaryColor }}
          >
            Get Started
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      )
    },
    {
      id: 'login',
      title: 'Login Screen',
      description: 'User authentication with email',
      screen: (
        <div className="bg-white p-8 rounded-lg border-2 border-slate-200">
          <div className="text-center mb-6">
            <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mx-auto mb-4">
              <User className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-slate-900 mb-2">Sign In to Continue</h3>
            <p className="text-slate-600">Enter your email to access your learning dashboard</p>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Email Address</label>
              <Input
                type="email"
                placeholder="your.email@example.com"
                value={userEmail}
                onChange={(e) => setUserEmail(e.target.value)}
                className="w-full"
              />
            </div>
            
            <Button 
              className="w-full"
              style={{ backgroundColor: clientBranding.primaryColor }}
              disabled={!userEmail}
            >
              <Mail className="w-4 h-4 mr-2" />
              Send Magic Link
            </Button>
            
            <p className="text-xs text-slate-500 text-center">
              We'll send you a secure link to sign in instantly
            </p>
          </div>
        </div>
      )
    },
    {
      id: 'home',
      title: 'Home Screen',
      description: 'Main dashboard showing progress and recommendations',
      screen: (
        <div className="space-y-6">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6 rounded-lg text-white">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-semibold">Welcome back, Sarah!</h3>
                <p className="text-blue-100">Continue your financial learning journey</p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold">Level {userProgress.level}</div>
                <div className="text-sm text-blue-100">{userProgress.points} points</div>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-green-50 p-4 rounded-lg text-center">
              <div className="text-2xl font-bold text-green-600">3</div>
              <div className="text-sm text-green-700">Completed</div>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg text-center">
              <div className="text-2xl font-bold text-blue-600">{userProgress.streak}</div>
              <div className="text-sm text-blue-700">Day Streak</div>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg text-center">
              <div className="text-2xl font-bold text-purple-600">2</div>
              <div className="text-sm text-purple-700">Badges</div>
            </div>
          </div>

          {/* Continue Learning */}
          <div>
            <h4 className="font-semibold text-slate-900 mb-3">Continue Learning</h4>
            <div className="bg-slate-50 p-4 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium">Budgeting Basics</span>
                <span className="text-sm text-slate-600">75% complete</span>
              </div>
              <Progress value={75} className="mb-3" />
              <Button size="sm" style={{ backgroundColor: clientBranding.primaryColor }}>
                <Play className="w-4 h-4 mr-2" />
                Continue Module 2
              </Button>
            </div>
          </div>

          {/* Recommended Skills */}
          <div>
            <h4 className="font-semibold text-slate-900 mb-3">Recommended for You</h4>
            <div className="space-y-3">
              {skills.slice(0, 2).map((skill) => (
                <div key={skill.id} className="flex items-center justify-between p-3 border border-slate-200 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <skill.icon className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <h5 className="font-medium text-slate-900">{skill.title}</h5>
                      <p className="text-sm text-slate-600">{skill.duration} • {skill.difficulty}</p>
                    </div>
                  </div>
                  <Button size="sm" variant="outline">Start</Button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'skill-selection',
      title: 'Skill Selection',
      description: 'User browses and selects a skill to learn',
      screen: (
        <div className="space-y-6">
          <div className="text-center">
            <h3 className="text-xl font-semibold text-slate-900 mb-2">Choose Your Learning Path</h3>
            <p className="text-slate-600">Select a skill to start building your financial knowledge</p>
          </div>

          <div className="space-y-4">
            {skills.map((skill) => (
              <div 
                key={skill.id}
                className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                  selectedSkill === skill.id 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-slate-200 hover:border-slate-300'
                }`}
                onClick={() => setSelectedSkill(skill.id)}
              >
                <div className="flex items-start space-x-4">
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                    selectedSkill === skill.id ? 'bg-blue-200' : 'bg-slate-100'
                  }`}>
                    <skill.icon className={`w-6 h-6 ${
                      selectedSkill === skill.id ? 'text-blue-600' : 'text-slate-600'
                    }`} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-slate-900">{skill.title}</h4>
                      <Badge variant="outline">{skill.difficulty}</Badge>
                    </div>
                    <p className="text-slate-600 mb-3">{skill.description}</p>
                    <div className="flex items-center space-x-4 text-sm text-slate-500">
                      <span className="flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        {skill.duration}
                      </span>
                      <span className="flex items-center">
                        <BookOpen className="w-4 h-4 mr-1" />
                        {skill.modules} modules
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <Button 
            className="w-full"
            disabled={!selectedSkill}
            style={{ backgroundColor: clientBranding.primaryColor }}
          >
            Start Learning
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      )
    },
    {
      id: 'module-overview',
      title: 'Module Overview',
      description: 'User sees module structure and lessons',
      screen: (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-green-500 to-green-600 p-6 rounded-lg text-white">
            <h3 className="text-xl font-semibold mb-2">{sampleModule.title}</h3>
            <p className="text-green-100">Module 1 of 3 in Budgeting Basics</p>
          </div>

          <div className="space-y-4">
            <h4 className="font-semibold text-slate-900">Lessons in this module:</h4>
            
            {sampleModule.lessons.map((lesson, index) => (
              <div key={lesson.id} className="flex items-center justify-between p-4 border border-slate-200 rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    completedLessons.has(lesson.id) 
                      ? 'bg-green-100 text-green-600' 
                      : 'bg-slate-100 text-slate-600'
                  }`}>
                    {completedLessons.has(lesson.id) ? (
                      <CheckCircle className="w-4 h-4" />
                    ) : (
                      <span className="text-sm font-medium">{index + 1}</span>
                    )}
                  </div>
                  <div>
                    <h5 className="font-medium text-slate-900">{lesson.title}</h5>
                    <p className="text-sm text-slate-600">{lesson.duration} minutes</p>
                  </div>
                </div>
                <Button 
                  size="sm"
                  variant={completedLessons.has(lesson.id) ? "outline" : "default"}
                  style={!completedLessons.has(lesson.id) ? { backgroundColor: clientBranding.primaryColor } : {}}
                >
                  {completedLessons.has(lesson.id) ? 'Review' : 'Start'}
                </Button>
              </div>
            ))}

            {/* Quiz */}
            <div className="p-4 border-2 border-orange-200 bg-orange-50 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-8 h-8 bg-orange-200 rounded-full flex items-center justify-center">
                    <Trophy className="w-4 h-4 text-orange-600" />
                  </div>
                  <div>
                    <h5 className="font-medium text-slate-900">{sampleModule.quiz.title}</h5>
                    <p className="text-sm text-slate-600">
                      {sampleModule.quiz.questions} questions • {sampleModule.quiz.duration} minutes
                    </p>
                  </div>
                </div>
                <Button size="sm" variant="outline" disabled>
                  Complete lessons first
                </Button>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <Zap className="w-4 h-4 text-blue-600" />
              <span className="font-medium text-blue-900">Learning Tip</span>
            </div>
            <p className="text-sm text-blue-800">
              Complete all lessons in order to unlock the quiz and earn your badge!
            </p>
          </div>
        </div>
      )
    },
    {
      id: 'lesson',
      title: 'Lesson Screen',
      description: 'User engages with lesson content',
      screen: (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-slate-900">Types of Income</h3>
              <p className="text-slate-600">Lesson 1 of 3</p>
            </div>
            <div className="text-right">
              <div className="text-sm text-slate-600">Progress</div>
              <div className="text-lg font-semibold">33%</div>
            </div>
          </div>

          <Progress value={33} className="h-2" />

          <div className="bg-white p-6 border border-slate-200 rounded-lg">
            <h4 className="text-lg font-semibold text-slate-900 mb-4">Understanding Different Types of Income</h4>
            
            <div className="prose prose-slate max-w-none">
              <p className="text-slate-700 mb-4">
                Income is the money you receive regularly, and it comes in different forms. Understanding these types helps you plan your budget more effectively.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="bg-green-50 p-4 rounded-lg">
                  <h5 className="font-semibold text-green-900 mb-2">Active Income</h5>
                  <p className="text-sm text-green-800">Money earned from work or services you actively provide, like salary or wages.</p>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h5 className="font-semibold text-blue-900 mb-2">Passive Income</h5>
                  <p className="text-sm text-blue-800">Money earned with minimal ongoing effort, like rental income or dividends.</p>
                </div>
              </div>

              <p className="text-slate-700">
                Most people start with active income from their job, but building passive income streams can provide financial security and freedom over time.
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <Button variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Previous
            </Button>
            <Button style={{ backgroundColor: clientBranding.primaryColor }}>
              Next
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      )
    },
    {
      id: 'quiz',
      title: 'Quiz Screen',
      description: 'User takes a quiz to test knowledge',
      screen: (
        <div className="space-y-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trophy className="w-8 h-8 text-orange-600" />
            </div>
            <h3 className="text-xl font-semibold text-slate-900 mb-2">Income Knowledge Check</h3>
            <p className="text-slate-600">Question 1 of 5</p>
          </div>

          <Progress value={20} className="h-2" />

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Which of the following is an example of passive income?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                'Salary from your full-time job',
                'Rental income from a property you own',
                'Hourly wages from part-time work',
                'Commission from sales'
              ].map((option, index) => (
                <button
                  key={index}
                  className="w-full p-4 text-left border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-6 h-6 border-2 border-slate-300 rounded-full"></div>
                    <span>{option}</span>
                  </div>
                </button>
              ))}
            </CardContent>
          </Card>

          <div className="flex items-center justify-between">
            <div className="text-sm text-slate-600">
              <Clock className="w-4 h-4 inline mr-1" />
              4:32 remaining
            </div>
            <Button style={{ backgroundColor: clientBranding.primaryColor }}>
              Submit Answer
            </Button>
          </div>
        </div>
      )
    },
    {
      id: 'progress',
      title: 'Progress Screen',
      description: 'User sees their learning progress and achievements',
      screen: (
        <div className="space-y-6">
          <div className="text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold text-slate-900 mb-2">Great Job!</h3>
            <p className="text-slate-600">You've completed "Understanding Your Income"</p>
          </div>

          <div className="bg-gradient-to-r from-green-500 to-green-600 p-6 rounded-lg text-white text-center">
            <div className="text-3xl font-bold mb-2">+50 Points</div>
            <div className="text-green-100">Quiz Score: 4/5 (80%)</div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg text-center">
              <div className="text-2xl font-bold text-blue-600 mb-1">Level 2</div>
              <div className="text-sm text-blue-700">Level Up!</div>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg text-center">
              <div className="text-2xl font-bold text-purple-600 mb-1">7</div>
              <div className="text-sm text-purple-700">Day Streak</div>
            </div>
          </div>

          <div className="bg-yellow-50 p-4 rounded-lg">
            <div className="flex items-center space-x-3 mb-2">
              <Award className="w-6 h-6 text-yellow-600" />
              <span className="font-semibold text-yellow-900">New Badge Earned!</span>
            </div>
            <p className="text-sm text-yellow-800">Income Expert - Completed your first income lesson</p>
          </div>

          <div className="space-y-3">
            <h4 className="font-semibold text-slate-900">Continue Your Journey</h4>
            <Button 
              className="w-full"
              style={{ backgroundColor: clientBranding.primaryColor }}
            >
              Next Lesson: Calculating Net Income
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      )
    }
  ];

  const nextStep = () => {
    if (currentStep < flowSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-semibold text-slate-900">User Flow Demo</h1>
              <p className="text-sm text-slate-600">Experience the learner journey from start to finish</p>
            </div>
            <Badge className="bg-purple-100 text-purple-800">Interactive Demo</Badge>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Flow Navigation */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">User Journey Steps</CardTitle>
                <CardDescription>
                  Click on any step to jump to that screen
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {flowSteps.map((step, index) => (
                    <button
                      key={step.id}
                      onClick={() => setCurrentStep(index)}
                      className={`w-full p-3 text-left rounded-lg transition-colors ${
                        currentStep === index
                          ? 'bg-blue-100 border-2 border-blue-500'
                          : 'bg-slate-50 hover:bg-slate-100 border-2 border-transparent'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                          currentStep === index
                            ? 'bg-blue-600 text-white'
                            : currentStep > index
                            ? 'bg-green-600 text-white'
                            : 'bg-slate-300 text-slate-600'
                        }`}>
                          {currentStep > index ? <CheckCircle className="w-4 h-4" /> : index + 1}
                        </div>
                        <div>
                          <div className="font-medium text-slate-900">{step.title}</div>
                          <div className="text-xs text-slate-600">{step.description}</div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Demo Controls */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="text-lg">Demo Controls</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <Button
                    variant="outline"
                    onClick={prevStep}
                    disabled={currentStep === 0}
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Previous
                  </Button>
                  <span className="text-sm text-slate-600">
                    {currentStep + 1} of {flowSteps.length}
                  </span>
                  <Button
                    onClick={nextStep}
                    disabled={currentStep === flowSteps.length - 1}
                    style={{ backgroundColor: clientBranding.primaryColor }}
                  >
                    Next
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Screen Preview */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg">{flowSteps[currentStep].title}</CardTitle>
                    <CardDescription>{flowSteps[currentStep].description}</CardDescription>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline">Mobile View</Badge>
                    <Button variant="ghost" size="sm">
                      <Smartphone className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {/* Mobile Frame */}
                <div className="max-w-sm mx-auto">
                  <div className="bg-slate-900 rounded-[2rem] p-2">
                    <div className="bg-white rounded-[1.5rem] overflow-hidden">
                      {/* Mobile Status Bar */}
                      <div className="bg-slate-100 px-4 py-2 flex items-center justify-between text-xs">
                        <span>9:41</span>
                        <div className="flex items-center space-x-1">
                          <div className="w-4 h-2 bg-slate-400 rounded-sm"></div>
                          <div className="w-4 h-2 bg-slate-400 rounded-sm"></div>
                          <div className="w-6 h-2 bg-green-500 rounded-sm"></div>
                        </div>
                      </div>
                      
                      {/* App Content */}
                      <div className="h-[600px] overflow-y-auto p-4">
                        {flowSteps[currentStep].screen}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Implementation Notes */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="text-lg">Implementation Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 text-sm">
                  {currentStep === 0 && (
                    <div>
                      <h4 className="font-medium text-slate-900 mb-2">Welcome Screen Features:</h4>
                      <ul className="list-disc list-inside space-y-1 text-slate-600">
                        <li>Client branding (logo, colors, name)</li>
                        <li>Value proposition messaging</li>
                        <li>Feature highlights</li>
                        <li>Clear call-to-action</li>
                      </ul>
                    </div>
                  )}
                  {currentStep === 1 && (
                    <div>
                      <h4 className="font-medium text-slate-900 mb-2">Authentication Features:</h4>
                      <ul className="list-disc list-inside space-y-1 text-slate-600">
                        <li>Magic link authentication (passwordless)</li>
                        <li>Email validation</li>
                        <li>Secure token handling</li>
                        <li>SSO integration support</li>
                      </ul>
                    </div>
                  )}
                  {currentStep === 2 && (
                    <div>
                      <h4 className="font-medium text-slate-900 mb-2">Dashboard Features:</h4>
                      <ul className="list-disc list-inside space-y-1 text-slate-600">
                        <li>Personalized welcome message</li>
                        <li>Progress tracking</li>
                        <li>Gamification elements</li>
                        <li>Content recommendations</li>
                      </ul>
                    </div>
                  )}
                  {currentStep >= 3 && (
                    <div>
                      <h4 className="font-medium text-slate-900 mb-2">Learning Features:</h4>
                      <ul className="list-disc list-inside space-y-1 text-slate-600">
                        <li>Structured learning paths</li>
                        <li>Interactive content</li>
                        <li>Progress tracking</li>
                        <li>Achievement system</li>
                        <li>Real-time sync</li>
                      </ul>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}