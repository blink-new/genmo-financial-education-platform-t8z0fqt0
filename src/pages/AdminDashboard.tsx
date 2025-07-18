import React from 'react';
import AdminLayout from '@/components/layout/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useApp } from '@/hooks/useApp';
import { 
  Users, 
  BookOpen, 
  TrendingUp, 
  Activity,
  Plus,
  ArrowUpRight,
  Building2,
  Target,
  Clock,
  Award
} from 'lucide-react';

export default function AdminDashboard() {
  const { clients, skills, modules, lessons, quizzes, getRecentActivities } = useApp();

  // Calculate real stats
  const activeClients = clients.filter(c => c.status === 'active').length;
  const totalContentItems = skills.length + modules.length + lessons.length + quizzes.length;
  
  const stats = [
    {
      title: 'Active Clients',
      value: activeClients.toString(),
      change: activeClients > 0 ? '+100%' : '0%',
      changeType: 'positive' as const,
      icon: Building2,
      description: 'Financial institutions'
    },
    {
      title: 'Total Learners',
      value: '0', // No learners yet since this is admin-only
      change: '0%',
      changeType: 'neutral' as const,
      icon: Users,
      description: 'No learners yet'
    },
    {
      title: 'Content Items',
      value: totalContentItems.toString(),
      change: totalContentItems > 0 ? '+100%' : '0%',
      changeType: 'positive' as const,
      icon: BookOpen,
      description: `${skills.length} skills, ${modules.length} modules, ${lessons.length} lessons, ${quizzes.length} quizzes`
    },
    {
      title: 'Completion Rate',
      value: '0%', // No completion data yet
      change: '0%',
      changeType: 'neutral' as const,
      icon: Target,
      description: 'No learner data yet'
    }
  ];

  // Use real client data
  const recentClients = clients.slice(0, 4).map(client => ({
    name: client.name,
    status: client.status,
    learners: 0, // No learners yet
    completion: 0, // No completion data yet
    lastActive: new Date(client.updated_at).toLocaleDateString()
  }));

  // Use real activity data
  const recentActivity = getRecentActivities(4).map(activity => {
    const timeAgo = getTimeAgo(activity.created_at);
    return {
      action: activity.title,
      client: activity.entity_name,
      time: timeAgo,
      type: activity.entity_type
    };
  });

  // Helper function to calculate time ago
  function getTimeAgo(dateString: string): string {
    const now = new Date();
    const date = new Date(dateString);
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays} days ago`;
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
            <p className="text-slate-600 mt-1">
              Welcome back! Here's what's happening with your platform.
            </p>
          </div>
          <div className="flex space-x-3">
            <Button variant="outline">
              <Activity className="w-4 h-4 mr-2" />
              View Reports
            </Button>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add Client
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat) => (
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
                    variant={
                      stat.changeType === 'positive' ? 'default' : 
                      stat.changeType === 'neutral' ? 'secondary' : 'destructive'
                    }
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Clients */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Recent Clients</CardTitle>
                  <CardDescription>
                    Latest client activity and performance
                  </CardDescription>
                </div>
                <Button variant="ghost" size="sm">
                  View All
                  <ArrowUpRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentClients.map((client) => (
                  <div key={client.name} className="flex items-center justify-between p-3 rounded-lg border border-slate-100 hover:bg-slate-50 transition-colors">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Building2 className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium text-slate-900">{client.name}</p>
                        <div className="flex items-center space-x-2 mt-1">
                          <Badge 
                            variant={client.status === 'active' ? 'default' : 'secondary'}
                            className="text-xs"
                          >
                            {client.status.charAt(0).toUpperCase() + client.status.slice(1)}
                          </Badge>
                          <span className="text-xs text-slate-500">
                            {client.learners.toLocaleString()} learners
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium">{client.completion}%</span>
                        <Progress value={client.completion} className="w-16" />
                      </div>
                      <p className="text-xs text-slate-500 mt-1">{client.lastActive}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>
                    Latest platform updates and alerts
                  </CardDescription>
                </div>
                <Button variant="ghost" size="sm">
                  View All
                  <ArrowUpRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className={`w-2 h-2 rounded-full mt-2 ${
                      activity.type === 'client' ? 'bg-green-500' :
                      activity.type === 'content' ? 'bg-blue-500' :
                      activity.type === 'alert' ? 'bg-yellow-500' :
                      'bg-slate-400'
                    }`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-slate-900">
                        <span className="font-medium">{activity.action}</span>
                      </p>
                      <p className="text-sm text-slate-600">{activity.client}</p>
                      <div className="flex items-center space-x-1 mt-1">
                        <Clock className="w-3 h-3 text-slate-400" />
                        <span className="text-xs text-slate-500">{activity.time}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Common tasks and shortcuts
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button variant="outline" className="h-20 flex-col space-y-2">
                <Plus className="w-6 h-6" />
                <span>Add New Client</span>
              </Button>
              <Button variant="outline" className="h-20 flex-col space-y-2">
                <BookOpen className="w-6 h-6" />
                <span>Create Content</span>
              </Button>
              <Button variant="outline" className="h-20 flex-col space-y-2">
                <Award className="w-6 h-6" />
                <span>Manage Badges</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}