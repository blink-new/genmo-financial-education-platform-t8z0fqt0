import React from 'react';
import AdminLayout from '@/components/layout/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  TrendingUp, 
  Users, 
  BookOpen, 
  Award,
  Download,
  Calendar,
  Filter,
  BarChart3,
  PieChart,
  Activity,
  Clock
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function AnalyticsDashboard() {
  const overallStats = [
    {
      title: 'Total Learners',
      value: '12,847',
      change: '+23%',
      changeType: 'positive' as const,
      icon: Users,
      description: 'Active users this month'
    },
    {
      title: 'Course Completions',
      value: '8,234',
      change: '+18%',
      changeType: 'positive' as const,
      icon: Award,
      description: 'Completed this month'
    },
    {
      title: 'Avg Session Time',
      value: '24m',
      change: '+12%',
      changeType: 'positive' as const,
      icon: Clock,
      description: 'Per learning session'
    },
    {
      title: 'Engagement Rate',
      value: '78%',
      change: '+5%',
      changeType: 'positive' as const,
      icon: Activity,
      description: 'Weekly active users'
    }
  ];

  const clientPerformance = [
    {
      name: 'First National Bank',
      learners: 2847,
      completions: 2341,
      completionRate: 82,
      avgScore: 87,
      engagement: 'High',
      trend: 'up'
    },
    {
      name: 'Regional Bank Corp',
      learners: 3421,
      completions: 3045,
      completionRate: 89,
      avgScore: 91,
      engagement: 'High',
      trend: 'up'
    },
    {
      name: 'Community Credit Union',
      learners: 1234,
      completions: 938,
      completionRate: 76,
      avgScore: 83,
      engagement: 'Medium',
      trend: 'stable'
    },
    {
      name: 'Metro Financial',
      learners: 892,
      completions: 401,
      completionRate: 45,
      avgScore: 72,
      engagement: 'Low',
      trend: 'down'
    }
  ];

  const topContent = [
    {
      title: 'Budgeting Basics',
      type: 'Module',
      completions: 2654,
      rating: 4.7,
      avgTime: '45m',
      difficulty: 'Beginner'
    },
    {
      title: 'Emergency Fund Planning',
      type: 'Module',
      completions: 1876,
      rating: 4.9,
      avgTime: '35m',
      difficulty: 'Intermediate'
    },
    {
      title: 'Understanding Credit Scores',
      type: 'Lesson',
      completions: 1543,
      rating: 4.6,
      avgTime: '20m',
      difficulty: 'Beginner'
    },
    {
      title: 'Investment Fundamentals',
      type: 'Module',
      completions: 1234,
      rating: 4.8,
      avgTime: '60m',
      difficulty: 'Advanced'
    }
  ];

  const getEngagementColor = (engagement: string) => {
    switch (engagement) {
      case 'High': return 'bg-green-100 text-green-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Low': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="w-4 h-4 text-green-600" />;
      case 'down': return <TrendingUp className="w-4 h-4 text-red-600 rotate-180" />;
      default: return <Activity className="w-4 h-4 text-gray-600" />;
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Analytics Dashboard</h1>
            <p className="text-slate-600 mt-1">
              Monitor platform performance and user engagement across all clients.
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <Select defaultValue="30days">
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7days">Last 7 days</SelectItem>
                <SelectItem value="30days">Last 30 days</SelectItem>
                <SelectItem value="90days">Last 90 days</SelectItem>
                <SelectItem value="1year">Last year</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline">
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </Button>
            <Button>
              <Download className="w-4 h-4 mr-2" />
              Export Report
            </Button>
          </div>
        </div>

        {/* Overall Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {overallStats.map((stat) => (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-600">
                  {stat.title}
                </CardTitle>
                <stat.icon className="h-4 w-4 text-slate-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-slate-900">{stat.value}</div>
                <div className="flex items-center space-x-2 mt-1">
                  <Badge 
                    variant={stat.changeType === 'positive' ? 'default' : 'destructive'}
                    className="text-xs"
                  >
                    {stat.change}
                  </Badge>
                  <p className="text-xs text-slate-500">{stat.description}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Analytics Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="clients">Client Performance</TabsTrigger>
            <TabsTrigger value="content">Content Analytics</TabsTrigger>
            <TabsTrigger value="engagement">User Engagement</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Learning Progress Chart Placeholder */}
              <Card>
                <CardHeader>
                  <CardTitle>Learning Progress Trends</CardTitle>
                  <CardDescription>
                    Course completions and user engagement over time
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64 bg-slate-50 rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <BarChart3 className="w-12 h-12 text-slate-400 mx-auto mb-2" />
                      <p className="text-slate-500">Chart visualization would go here</p>
                      <p className="text-xs text-slate-400">Line chart showing completion trends</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* User Demographics Placeholder */}
              <Card>
                <CardHeader>
                  <CardTitle>User Demographics</CardTitle>
                  <CardDescription>
                    Age groups and learning preferences
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64 bg-slate-50 rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <PieChart className="w-12 h-12 text-slate-400 mx-auto mb-2" />
                      <p className="text-slate-500">Chart visualization would go here</p>
                      <p className="text-xs text-slate-400">Pie chart showing age distribution</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="clients" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Client Performance Metrics</CardTitle>
                <CardDescription>
                  Compare performance across all financial institution clients
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {clientPerformance.map((client) => (
                    <div key={client.name} className="flex items-center justify-between p-4 border border-slate-200 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                          <Users className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-slate-900">{client.name}</h3>
                          <div className="flex items-center space-x-4 mt-1 text-sm text-slate-600">
                            <span>{client.learners.toLocaleString()} learners</span>
                            <span>•</span>
                            <span>{client.completions.toLocaleString()} completions</span>
                            <span>•</span>
                            <Badge className={`text-xs ${getEngagementColor(client.engagement)}`}>
                              {client.engagement}
                            </Badge>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-6">
                        <div className="text-center">
                          <div className="text-sm font-medium text-slate-900">
                            {client.completionRate}%
                          </div>
                          <div className="text-xs text-slate-500">Completion</div>
                          <Progress value={client.completionRate} className="w-16 mt-1" />
                        </div>
                        <div className="text-center">
                          <div className="text-sm font-medium text-slate-900">
                            {client.avgScore}%
                          </div>
                          <div className="text-xs text-slate-500">Avg Score</div>
                        </div>
                        <div className="flex items-center">
                          {getTrendIcon(client.trend)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="content" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Top Performing Content</CardTitle>
                <CardDescription>
                  Most popular and highest-rated learning materials
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {topContent.map((content, index) => (
                    <div key={content.title} className="flex items-center justify-between p-4 border border-slate-200 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center text-sm font-medium text-slate-600">
                          #{index + 1}
                        </div>
                        <div>
                          <h3 className="font-semibold text-slate-900">{content.title}</h3>
                          <div className="flex items-center space-x-4 mt-1 text-sm text-slate-600">
                            <Badge variant="outline" className="text-xs">
                              {content.type}
                            </Badge>
                            <span>{content.completions.toLocaleString()} completions</span>
                            <span>•</span>
                            <span>★ {content.rating}</span>
                            <span>•</span>
                            <span>{content.avgTime}</span>
                          </div>
                        </div>
                      </div>
                      <Badge variant="secondary" className="text-xs">
                        {content.difficulty}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="engagement" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Daily Active Users</CardTitle>
                  <CardDescription>
                    User activity patterns throughout the week
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64 bg-slate-50 rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <Activity className="w-12 h-12 text-slate-400 mx-auto mb-2" />
                      <p className="text-slate-500">Chart visualization would go here</p>
                      <p className="text-xs text-slate-400">Bar chart showing daily activity</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Session Duration</CardTitle>
                  <CardDescription>
                    Average time spent per learning session
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64 bg-slate-50 rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <Clock className="w-12 h-12 text-slate-400 mx-auto mb-2" />
                      <p className="text-slate-500">Chart visualization would go here</p>
                      <p className="text-xs text-slate-400">Histogram of session lengths</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
}