import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { 
  Play, 
  Mail, 
  CheckCircle, 
  Star,
  Clock,
  Users,
  TrendingUp,
  Award,
  BookOpen,
  Target,
  Zap,
  Shield,
  Smartphone,
  Globe,
  ArrowRight
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function DemoPortal() {
  const [email, setEmail] = useState('');
  const [isTrialStarted, setIsTrialStarted] = useState(false);

  const features = [
    {
      icon: Zap,
      title: 'White-Label Branding',
      description: 'Fully customizable to match your institution\'s brand identity'
    },
    {
      icon: Users,
      title: 'Multi-Demographic Content',
      description: 'Tailored learning paths for kids, teens, and adults'
    },
    {
      icon: Target,
      title: 'Progress Tracking',
      description: 'Detailed analytics and completion tracking for all users'
    },
    {
      icon: Award,
      title: 'Gamification',
      description: 'Badges, streaks, and leaderboards to boost engagement'
    },
    {
      icon: Shield,
      title: 'Secure & Compliant',
      description: 'Bank-grade security with OAuth2 and JWT authentication'
    },
    {
      icon: Smartphone,
      title: 'Mobile Responsive',
      description: 'Perfect experience across all devices and screen sizes'
    }
  ];

  const demoStats = [
    { label: 'Active Learners', value: '2,847', icon: Users },
    { label: 'Completion Rate', value: '82%', icon: Target },
    { label: 'Avg Session Time', value: '24m', icon: Clock },
    { label: 'User Satisfaction', value: '4.8★', icon: Star }
  ];

  const sampleLearningPath = [
    {
      title: 'Personal Finance Fundamentals',
      modules: 4,
      duration: '2h 30m',
      difficulty: 'Beginner',
      progress: 100,
      status: 'completed'
    },
    {
      title: 'Budgeting & Expense Management',
      modules: 3,
      duration: '1h 45m',
      difficulty: 'Beginner',
      progress: 75,
      status: 'in-progress'
    },
    {
      title: 'Emergency Fund Planning',
      modules: 2,
      duration: '1h 15m',
      difficulty: 'Intermediate',
      progress: 0,
      status: 'locked'
    },
    {
      title: 'Investment Strategies',
      modules: 5,
      duration: '3h 20m',
      difficulty: 'Advanced',
      progress: 0,
      status: 'locked'
    }
  ];

  const handleStartTrial = () => {
    if (email) {
      setIsTrialStarted(true);
      // In a real app, this would send a magic link email
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in-progress': return 'bg-blue-100 text-blue-800';
      case 'locked': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">GM</span>
              </div>
              <div>
                <h1 className="text-lg font-semibold text-slate-900">GenMo</h1>
                <p className="text-xs text-slate-500">Financial Education Platform</p>
              </div>
            </div>
            <Badge className="bg-blue-100 text-blue-800">Demo Portal</Badge>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-slate-900 mb-6">
            Transform Financial Education
            <span className="block text-blue-600">For Your Institution</span>
          </h1>
          <p className="text-xl text-slate-600 mb-8 max-w-3xl mx-auto">
            GenMo provides a white-label, embeddable financial literacy platform that helps 
            banks and credit unions deliver engaging educational content to their customers.
          </p>
          
          {!isTrialStarted ? (
            <div className="max-w-md mx-auto">
              <div className="flex space-x-3">
                <Input
                  type="email"
                  placeholder="Enter your email for 7-day trial"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1"
                />
                <Button onClick={handleStartTrial} disabled={!email}>
                  <Mail className="w-4 h-4 mr-2" />
                  Start Trial
                </Button>
              </div>
              <p className="text-sm text-slate-500 mt-2">
                No credit card required • Magic link authentication
              </p>
            </div>
          ) : (
            <div className="max-w-md mx-auto">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center justify-center space-x-2 text-green-800">
                  <CheckCircle className="w-5 h-5" />
                  <span className="font-medium">Trial activated!</span>
                </div>
                <p className="text-sm text-green-700 mt-1">
                  Check your email for the magic link to access your 7-day trial.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {features.map((feature) => (
            <Card key={feature.title} className="border-0 shadow-sm hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-blue-600" />
                </div>
                <CardTitle className="text-lg">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-slate-600">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Demo Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card className="border-2 border-blue-200 bg-blue-50">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                  <Play className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-slate-900 mb-1">
                    Interactive User Flow Demo
                  </h3>
                  <p className="text-slate-600 text-sm">
                    Experience the complete learner journey using admin portal content
                  </p>
                </div>
                <Link to="/demo/user-flow">
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    Try Demo
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-green-200 bg-green-50">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center">
                  <BookOpen className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-slate-900 mb-1">
                    Module Library Demo
                  </h3>
                  <p className="text-slate-600 text-sm">
                    Browse the learning modules created in the admin portal
                  </p>
                </div>
                <Link to="/demo/modules">
                  <Button className="bg-green-600 hover:bg-green-700">
                    View Library
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Demo Tabs */}
        <Tabs defaultValue="learner" className="space-y-8">
          <div className="flex justify-center">
            <TabsList className="grid w-full max-w-md grid-cols-2">
              <TabsTrigger value="learner">Learner Experience</TabsTrigger>
              <TabsTrigger value="admin">Admin Dashboard</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="learner" className="space-y-8">
            {/* Simulated Learner Dashboard */}
            <Card className="max-w-4xl mx-auto">
              <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-t-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-xl">Welcome back, Sarah!</CardTitle>
                    <CardDescription className="text-blue-100">
                      Continue your financial learning journey
                    </CardDescription>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold">Level 3</div>
                    <div className="text-sm text-blue-100">Finance Explorer</div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                {/* Progress Overview */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                  {demoStats.map((stat) => (
                    <div key={stat.label} className="text-center p-4 bg-slate-50 rounded-lg">
                      <stat.icon className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                      <div className="text-2xl font-bold text-slate-900">{stat.value}</div>
                      <div className="text-sm text-slate-600">{stat.label}</div>
                    </div>
                  ))}
                </div>

                {/* Learning Path */}
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-4">Your Learning Path</h3>
                  <div className="space-y-4">
                    {sampleLearningPath.map((course, index) => (
                      <div key={course.title} className="flex items-center justify-between p-4 border border-slate-200 rounded-lg">
                        <div className="flex items-center space-x-4">
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                            course.status === 'completed' ? 'bg-green-100' :
                            course.status === 'in-progress' ? 'bg-blue-100' :
                            'bg-gray-100'
                          }`}>
                            {course.status === 'completed' ? (
                              <CheckCircle className="w-5 h-5 text-green-600" />
                            ) : course.status === 'in-progress' ? (
                              <Play className="w-5 h-5 text-blue-600" />
                            ) : (
                              <BookOpen className="w-5 h-5 text-gray-600" />
                            )}
                          </div>
                          <div>
                            <h4 className="font-medium text-slate-900">{course.title}</h4>
                            <div className="flex items-center space-x-4 mt-1 text-sm text-slate-600">
                              <span>{course.modules} modules</span>
                              <span>•</span>
                              <span>{course.duration}</span>
                              <span>•</span>
                              <Badge variant="outline" className="text-xs">
                                {course.difficulty}
                              </Badge>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4">
                          <div className="text-right">
                            <div className="text-sm font-medium">{course.progress}%</div>
                            <Progress value={course.progress} className="w-20 mt-1" />
                          </div>
                          <Button 
                            variant={course.status === 'locked' ? 'ghost' : 'default'}
                            size="sm"
                            disabled={course.status === 'locked'}
                          >
                            {course.status === 'completed' ? 'Review' :
                             course.status === 'in-progress' ? 'Continue' :
                             'Locked'}
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="admin" className="space-y-8">
            {/* Simulated Admin Dashboard */}
            <Card className="max-w-4xl mx-auto">
              <CardHeader>
                <CardTitle>Admin Analytics Dashboard</CardTitle>
                <CardDescription>
                  Monitor learner progress and engagement across your institution
                </CardDescription>
              </CardHeader>
              <CardContent>
                {/* Mock Analytics */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <div className="text-center p-6 bg-blue-50 rounded-lg">
                    <Users className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                    <div className="text-3xl font-bold text-slate-900">2,847</div>
                    <div className="text-sm text-slate-600">Active Learners</div>
                    <div className="text-xs text-green-600 mt-1">+23% this month</div>
                  </div>
                  <div className="text-center p-6 bg-green-50 rounded-lg">
                    <Target className="w-8 h-8 text-green-600 mx-auto mb-2" />
                    <div className="text-3xl font-bold text-slate-900">82%</div>
                    <div className="text-sm text-slate-600">Completion Rate</div>
                    <div className="text-xs text-green-600 mt-1">+5% this month</div>
                  </div>
                  <div className="text-center p-6 bg-purple-50 rounded-lg">
                    <TrendingUp className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                    <div className="text-3xl font-bold text-slate-900">4.8</div>
                    <div className="text-sm text-slate-600">Avg Rating</div>
                    <div className="text-xs text-green-600 mt-1">★ out of 5</div>
                  </div>
                </div>

                {/* Mock Chart Placeholder */}
                <div className="bg-slate-50 rounded-lg p-8 text-center">
                  <TrendingUp className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-slate-900 mb-2">
                    Interactive Analytics Charts
                  </h3>
                  <p className="text-slate-600">
                    Real-time dashboards showing user engagement, completion rates, 
                    and learning progress across all demographics.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* CTA Section */}
        <div className="text-center mt-16 p-8 bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl text-white">
          <h2 className="text-3xl font-bold mb-4">Ready to Transform Financial Education?</h2>
          <p className="text-xl text-blue-100 mb-6">
            Join leading financial institutions using GenMo to educate their customers.
          </p>
          <div className="flex items-center justify-center space-x-4">
            <Button size="lg" variant="secondary">
              <Globe className="w-5 h-5 mr-2" />
              Schedule Demo
            </Button>
            <Button size="lg" variant="outline" className="text-white border-white hover:bg-white hover:text-blue-600">
              View Pricing
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}