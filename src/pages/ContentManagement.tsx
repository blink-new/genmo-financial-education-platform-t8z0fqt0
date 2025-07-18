import React, { useState } from 'react';
import AdminLayout from '@/components/layout/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { useApp } from '@/hooks/useApp';
import LessonEditor from '@/components/LessonEditor';
import { Lesson, Quiz } from '@/types';
import { 
  Plus, 
  Search, 
  Filter,
  MoreHorizontal,
  BookOpen,
  FileText,
  HelpCircle,
  Play,
  Eye,
  Edit,
  Copy,
  Trash2,
  ChevronRight,
  Folder,
  Target,
  Clock,
  Star,
  Users,
  CheckCircle,
  XCircle
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export default function ContentManagement() {
  const { 
    skills, modules, lessons, quizzes, 
    addSkill, addModule, addLesson, addQuiz, 
    deleteSkill, deleteModule, deleteLesson, deleteQuiz,
    toggleSkillStatus, toggleModuleStatus, toggleLessonStatus, toggleQuizStatus,
    updateLesson, updateQuiz
  } = useApp();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddContentOpen, setIsAddContentOpen] = useState(false);
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const [contentType, setContentType] = useState<'skill' | 'module' | 'lesson' | 'quiz'>('skill');
  const [editingLesson, setEditingLesson] = useState<Lesson | null>(null);
  const [editingQuiz, setEditingQuiz] = useState<Quiz | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    parent_id: '',
    learning_objectives: [''],
    content: '',
    content_type: 'text' as 'text' | 'video' | 'interactive' | 'mixed'
  });

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'skill': return BookOpen;
      case 'module': return Folder;
      case 'lesson': return FileText;
      case 'quiz': return HelpCircle;
      default: return FileText;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'bg-green-100 text-green-800';
      case 'draft': return 'bg-yellow-100 text-yellow-800';
      case 'archived': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-blue-100 text-blue-800';
      case 'intermediate': return 'bg-orange-100 text-orange-800';
      case 'advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const toggleExpanded = (id: string) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedItems(newExpanded);
  };

  const handleAddContent = () => {
    if (!formData.title.trim()) {
      toast({
        title: "Error",
        description: "Please enter a title.",
        variant: "destructive",
      });
      return;
    }

    try {
      const baseData = {
        title: formData.title,
        description: formData.description,
        difficulty: 'beginner' as const,
        estimated_duration: 30,
        order_index: 1,
        status: 'draft' as const,
        user_id: 'admin-1'
      };

      switch (contentType) {
        case 'skill':
          if (skills.length >= 5) {
            toast({
              title: "Error",
              description: "Maximum of 5 skills allowed.",
              variant: "destructive",
            });
            return;
          }
          addSkill(baseData);
          break;
        case 'module':
          if (!formData.parent_id) {
            toast({
              title: "Error",
              description: "Please select a skill for this module.",
              variant: "destructive",
            });
            return;
          }
          addModule({
            ...baseData,
            skill_id: formData.parent_id,
            learning_objectives: formData.learning_objectives.filter(obj => obj.trim())
          });
          break;
        case 'lesson':
          if (!formData.parent_id) {
            toast({
              title: "Error",
              description: "Please select a module for this lesson.",
              variant: "destructive",
            });
            return;
          }
          addLesson({
            ...baseData,
            module_id: formData.parent_id,
            content: formData.content,
            content_type: formData.content_type,
            cards: [],
            appearance: {
              circle_color: '#2563EB',
              circle_icon: '📚',
              text_font: 'Inter',
              text_color: '#1F2937',
              progress_color: '#10B981',
              background_color: '#FFFFFF'
            }
          });
          break;
        case 'quiz':
          if (!formData.parent_id) {
            toast({
              title: "Error",
              description: "Please select a lesson for this quiz.",
              variant: "destructive",
            });
            return;
          }
          addQuiz({
            title: formData.title,
            description: formData.description,
            lesson_id: formData.parent_id,
            questions: [],
            passing_score: 70,
            max_attempts: 3,
            status: 'draft' as const,
            user_id: 'admin-1'
          });
          break;
      }

      toast({
        title: "Success",
        description: `${contentType.charAt(0).toUpperCase() + contentType.slice(1)} created successfully.`,
      });

      // Reset form
      setFormData({
        title: '',
        description: '',
        parent_id: '',
        learning_objectives: [''],
        content: '',
        content_type: 'text'
      });
      setIsAddContentOpen(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create content. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteContent = (type: string, id: string, title: string) => {
    if (window.confirm(`Are you sure you want to delete "${title}"? This will also delete all related content.`)) {
      switch (type) {
        case 'skill':
          deleteSkill(id);
          break;
        case 'module':
          deleteModule(id);
          break;
        case 'lesson':
          deleteLesson(id);
          break;
        case 'quiz':
          deleteQuiz(id);
          break;
      }
      toast({
        title: "Success",
        description: `"${title}" has been deleted.`,
      });
    }
  };

  const handleEditLesson = (lessonId: string) => {
    const lesson = lessons.find(l => l.id === lessonId);
    if (lesson) {
      setEditingLesson(lesson);
    }
  };

  const handleSaveLesson = (updatedLesson: Lesson) => {
    updateLesson(updatedLesson.id, updatedLesson);
    setEditingLesson(null);
    toast({
      title: "Success",
      description: "Lesson updated successfully.",
    });
  };

  const handleEditQuiz = (quizId: string) => {
    const quiz = quizzes.find(q => q.id === quizId);
    if (quiz) {
      setEditingQuiz(quiz);
    }
  };

  const handleSaveQuiz = (updatedQuiz: Quiz) => {
    updateQuiz(updatedQuiz.id, updatedQuiz);
    setEditingQuiz(null);
    toast({
      title: "Success",
      description: "Quiz updated successfully.",
    });
  };

  const renderContentHierarchy = () => {
    return skills.map(skill => {
      const skillModules = modules.filter(m => m.skill_id === skill.id);
      const isSkillExpanded = expandedItems.has(skill.id);
      const Icon = getTypeIcon('skill');

      return (
        <div key={skill.id} className="space-y-2">
          {/* Skill Level */}
          <div className="flex items-center justify-between p-4 border-2 border-blue-200 rounded-lg bg-blue-50 hover:bg-blue-100 transition-colors">
            <div className="flex items-center space-x-3 flex-1">
              <div className="flex items-center space-x-2">
                {skillModules.length > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0"
                    onClick={() => toggleExpanded(skill.id)}
                  >
                    <ChevronRight 
                      className={`h-4 w-4 transition-transform ${isSkillExpanded ? 'rotate-90' : ''}`} 
                    />
                  </Button>
                )}
                <div className="w-8 h-8 bg-blue-200 rounded-lg flex items-center justify-center">
                  <Icon className="w-4 h-4 text-blue-700" />
                </div>
              </div>
              
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <h3 className="font-semibold text-slate-900">{skill.title}</h3>
                  <Badge className={`text-xs ${getStatusColor(skill.status)}`}>
                    {skill.status}
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    SKILL
                  </Badge>
                </div>
                <div className="flex items-center space-x-4 mt-1 text-sm text-slate-600">
                  <span className="flex items-center">
                    <Folder className="w-3 h-3 mr-1" />
                    {skillModules.length} modules
                  </span>
                </div>
              </div>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuItem onClick={() => toggleSkillStatus(skill.id)}>
                  {skill.status === 'published' ? (
                    <>
                      <XCircle className="mr-2 h-4 w-4" />
                      Mark as Draft
                    </>
                  ) : (
                    <>
                      <CheckCircle className="mr-2 h-4 w-4" />
                      Publish
                    </>
                  )}
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Eye className="mr-2 h-4 w-4" />
                  Preview
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => {
                  // TODO: Implement skill editing
                  toast({
                    title: "Coming Soon",
                    description: "Skill editing will be available soon.",
                  });
                }}>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Copy className="mr-2 h-4 w-4" />
                  Duplicate
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  className="text-red-600"
                  onClick={() => handleDeleteContent('skill', skill.id, skill.title)}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Modules Level */}
          {isSkillExpanded && skillModules.map(module => {
            const moduleLessons = lessons.filter(l => l.module_id === module.id);
            const isModuleExpanded = expandedItems.has(module.id);
            const ModuleIcon = getTypeIcon('module');

            return (
              <div key={module.id} className="ml-8 space-y-2">
                <div className="flex items-center justify-between p-3 border border-green-200 rounded-lg bg-green-50 hover:bg-green-100 transition-colors">
                  <div className="flex items-center space-x-3 flex-1">
                    <div className="flex items-center space-x-2">
                      {moduleLessons.length > 0 && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0"
                          onClick={() => toggleExpanded(module.id)}
                        >
                          <ChevronRight 
                            className={`h-4 w-4 transition-transform ${isModuleExpanded ? 'rotate-90' : ''}`} 
                          />
                        </Button>
                      )}
                      <div className="w-7 h-7 bg-green-200 rounded-lg flex items-center justify-center">
                        <ModuleIcon className="w-3 h-3 text-green-700" />
                      </div>
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <h4 className="font-medium text-slate-900">{module.title}</h4>
                        <Badge className={`text-xs ${getStatusColor(module.status)}`}>
                          {module.status}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          MODULE
                        </Badge>
                      </div>
                      <div className="flex items-center space-x-4 mt-1 text-sm text-slate-600">
                        <span className="flex items-center">
                          <FileText className="w-3 h-3 mr-1" />
                          {moduleLessons.length} lessons
                        </span>
                        <span className="flex items-center">
                          <Target className="w-3 h-3 mr-1" />
                          {module.learning_objectives?.length || 0} objectives
                        </span>
                      </div>
                    </div>
                  </div>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem onClick={() => toggleModuleStatus(module.id)}>
                        {module.status === 'published' ? (
                          <>
                            <XCircle className="mr-2 h-4 w-4" />
                            Mark as Draft
                          </>
                        ) : (
                          <>
                            <CheckCircle className="mr-2 h-4 w-4" />
                            Publish
                          </>
                        )}
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Eye className="mr-2 h-4 w-4" />
                        Preview
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => {
                        // TODO: Implement module editing
                        toast({
                          title: "Coming Soon",
                          description: "Module editing will be available soon.",
                        });
                      }}>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Copy className="mr-2 h-4 w-4" />
                        Duplicate
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem 
                        className="text-red-600"
                        onClick={() => handleDeleteContent('module', module.id, module.title)}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                {/* Lessons Level */}
                {isModuleExpanded && moduleLessons.map(lesson => {
                  const lessonQuizzes = quizzes.filter(q => q.lesson_id === lesson.id);
                  const isLessonExpanded = expandedItems.has(lesson.id);
                  const LessonIcon = getTypeIcon('lesson');

                  return (
                    <div key={lesson.id} className="ml-8 space-y-2">
                      <div className="flex items-center justify-between p-3 border border-purple-200 rounded-lg bg-purple-50 hover:bg-purple-100 transition-colors">
                        <div className="flex items-center space-x-3 flex-1">
                          <div className="flex items-center space-x-2">
                            {lessonQuizzes.length > 0 && (
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-6 w-6 p-0"
                                onClick={() => toggleExpanded(lesson.id)}
                              >
                                <ChevronRight 
                                  className={`h-4 w-4 transition-transform ${isLessonExpanded ? 'rotate-90' : ''}`} 
                                />
                              </Button>
                            )}
                            <div className="w-6 h-6 bg-purple-200 rounded-lg flex items-center justify-center">
                              <LessonIcon className="w-3 h-3 text-purple-700" />
                            </div>
                          </div>
                          
                          <div className="flex-1">
                            <div className="flex items-center space-x-2">
                              <h5 className="font-medium text-slate-900">{lesson.title}</h5>
                              <Badge className={`text-xs ${getStatusColor(lesson.status)}`}>
                                {lesson.status}
                              </Badge>
                              <Badge variant="outline" className="text-xs">
                                LESSON
                              </Badge>
                            </div>
                            <div className="flex items-center space-x-4 mt-1 text-sm text-slate-600">
                              <span className="flex items-center">
                                <Play className="w-3 h-3 mr-1" />
                                {lesson.content_type}
                              </span>
                              <span className="flex items-center">
                                <HelpCircle className="w-3 h-3 mr-1" />
                                {lessonQuizzes.length} quiz
                              </span>
                            </div>
                          </div>
                        </div>

                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem onClick={() => toggleLessonStatus(lesson.id)}>
                              {lesson.status === 'published' ? (
                                <>
                                  <XCircle className="mr-2 h-4 w-4" />
                                  Mark as Draft
                                </>
                              ) : (
                                <>
                                  <CheckCircle className="mr-2 h-4 w-4" />
                                  Publish
                                </>
                              )}
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Eye className="mr-2 h-4 w-4" />
                              Preview
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleEditLesson(lesson.id)}>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit Lesson & Cards
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Copy className="mr-2 h-4 w-4" />
                              Duplicate
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              className="text-red-600"
                              onClick={() => handleDeleteContent('lesson', lesson.id, lesson.title)}
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>

                      {/* Quizzes Level */}
                      {isLessonExpanded && lessonQuizzes.map(quiz => {
                        const QuizIcon = getTypeIcon('quiz');

                        return (
                          <div key={quiz.id} className="ml-8">
                            <div className="flex items-center justify-between p-3 border border-orange-200 rounded-lg bg-orange-50 hover:bg-orange-100 transition-colors">
                              <div className="flex items-center space-x-3 flex-1">
                                <div className="w-6 h-6 bg-orange-200 rounded-lg flex items-center justify-center">
                                  <QuizIcon className="w-3 h-3 text-orange-700" />
                                </div>
                                
                                <div className="flex-1">
                                  <div className="flex items-center space-x-2">
                                    <h6 className="font-medium text-slate-900">{quiz.title}</h6>
                                    <Badge className={`text-xs ${getStatusColor(quiz.status)}`}>
                                      {quiz.status}
                                    </Badge>
                                    <Badge variant="outline" className="text-xs">
                                      QUIZ
                                    </Badge>
                                  </div>
                                  <div className="flex items-center space-x-4 mt-1 text-sm text-slate-600">
                                    <span className="flex items-center">
                                      <HelpCircle className="w-3 h-3 mr-1" />
                                      {quiz.questions?.length || 0} questions
                                    </span>
                                    <span className="flex items-center">
                                      <Target className="w-3 h-3 mr-1" />
                                      {quiz.passing_score}% to pass
                                    </span>
                                    <span className="flex items-center">
                                      <Users className="w-3 h-3 mr-1" />
                                      {quiz.max_attempts} attempts
                                    </span>
                                  </div>
                                </div>
                              </div>

                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" className="h-8 w-8 p-0">
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                  <DropdownMenuItem onClick={() => toggleQuizStatus(quiz.id)}>
                                    {quiz.status === 'published' ? (
                                      <>
                                        <XCircle className="mr-2 h-4 w-4" />
                                        Mark as Draft
                                      </>
                                    ) : (
                                      <>
                                        <CheckCircle className="mr-2 h-4 w-4" />
                                        Publish
                                      </>
                                    )}
                                  </DropdownMenuItem>
                                  <DropdownMenuItem>
                                    <Eye className="mr-2 h-4 w-4" />
                                    Preview
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => {
                                    toast({
                                      title: "Coming Soon",
                                      description: "Quiz editor will be available in the next update.",
                                    });
                                  }}>
                                    <Edit className="mr-2 h-4 w-4" />
                                    Edit Questions
                                  </DropdownMenuItem>
                                  <DropdownMenuItem>
                                    <Copy className="mr-2 h-4 w-4" />
                                    Duplicate
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem 
                                    className="text-red-600"
                                    onClick={() => handleDeleteContent('quiz', quiz.id, quiz.title)}
                                  >
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Delete
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      );
    });
  };

  const getParentOptions = () => {
    switch (contentType) {
      case 'module':
        return skills.map(skill => ({ value: skill.id, label: skill.title }));
      case 'lesson':
        return modules.map(module => ({ value: module.id, label: module.title }));
      case 'quiz':
        return lessons.map(lesson => ({ value: lesson.id, label: lesson.title }));
      default:
        return [];
    }
  };

  // Show lesson editor if editing a lesson
  if (editingLesson) {
    return (
      <LessonEditor
        lesson={editingLesson}
        onSave={handleSaveLesson}
        onClose={() => setEditingLesson(null)}
      />
    );
  }

  // Show quiz editor if editing a quiz
  if (editingQuiz) {
    // Quiz editor will be implemented in the next iteration
    setEditingQuiz(null);
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Content Management</h1>
            <p className="text-slate-600 mt-1">
              Create and organize learning content with proper hierarchy: Skills → Modules → Lessons → Quizzes
            </p>
          </div>
          <Dialog open={isAddContentOpen} onOpenChange={setIsAddContentOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Create Content
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Create New Content</DialogTitle>
                <DialogDescription>
                  Add a new learning item to your content library.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="content-type" className="text-right">
                    Type *
                  </Label>
                  <Select value={contentType} onValueChange={(value) => setContentType(value as any)}>
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select content type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="skill">Skill (Max 5)</SelectItem>
                      <SelectItem value="module">Module</SelectItem>
                      <SelectItem value="lesson">Lesson</SelectItem>
                      <SelectItem value="quiz">Quiz</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {contentType !== 'skill' && (
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="parent" className="text-right">
                      Parent *
                    </Label>
                    <Select value={formData.parent_id} onValueChange={(value) => setFormData(prev => ({ ...prev, parent_id: value }))}>
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder={`Select ${contentType === 'module' ? 'skill' : contentType === 'lesson' ? 'module' : 'lesson'}`} />
                      </SelectTrigger>
                      <SelectContent>
                        {getParentOptions().map(option => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="title" className="text-right">
                    Title *
                  </Label>
                  <Input
                    id="title"
                    placeholder="Content title"
                    className="col-span-3"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  />
                </div>

                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="description" className="text-right">
                    Description
                  </Label>
                  <Textarea
                    id="description"
                    placeholder="Brief description..."
                    className="col-span-3"
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  />
                </div>



                {contentType === 'lesson' && (
                  <>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="content_type" className="text-right">
                        Content Type
                      </Label>
                      <Select value={formData.content_type} onValueChange={(value) => setFormData(prev => ({ ...prev, content_type: value as any }))}>
                        <SelectTrigger className="col-span-3">
                          <SelectValue placeholder="Select content type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="text">Text Only</SelectItem>
                          <SelectItem value="video">Video Only</SelectItem>
                          <SelectItem value="interactive">Interactive</SelectItem>
                          <SelectItem value="mixed">Mixed (Cards) - Recommended</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {formData.content_type === 'mixed' && (
                      <div className="col-span-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                        <div className="flex items-start space-x-3">
                          <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                            <FileText className="w-4 h-4 text-blue-600" />
                          </div>
                          <div>
                            <h4 className="font-medium text-blue-900 mb-1">Card-Based Lesson</h4>
                            <p className="text-sm text-blue-700 mb-3">
                              Create engaging lessons with multiple cards. Each card can contain text, images, videos, or audio with full customization options for fonts, colors, and layout.
                            </p>
                            <div className="flex flex-wrap gap-2">
                              <Badge variant="outline" className="text-xs bg-white">Rich Text Editor</Badge>
                              <Badge variant="outline" className="text-xs bg-white">Media Upload</Badge>
                              <Badge variant="outline" className="text-xs bg-white">Custom Styling</Badge>
                              <Badge variant="outline" className="text-xs bg-white">Drag & Drop</Badge>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {formData.content_type !== 'mixed' && (
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="content" className="text-right">
                          Content
                        </Label>
                        <Textarea
                          id="content"
                          placeholder="Lesson content..."
                          className="col-span-3 min-h-[100px]"
                          value={formData.content}
                          onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                        />
                      </div>
                    )}
                  </>
                )}

                {contentType === 'module' && (
                  <div className="grid grid-cols-4 items-start gap-4">
                    <Label className="text-right mt-2">
                      Learning Objectives
                    </Label>
                    <div className="col-span-3 space-y-2">
                      {formData.learning_objectives.map((objective, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <Input
                            placeholder={`Objective ${index + 1}`}
                            value={objective}
                            onChange={(e) => {
                              const newObjectives = [...formData.learning_objectives];
                              newObjectives[index] = e.target.value;
                              setFormData(prev => ({ ...prev, learning_objectives: newObjectives }));
                            }}
                          />
                          {index > 0 && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                const newObjectives = formData.learning_objectives.filter((_, i) => i !== index);
                                setFormData(prev => ({ ...prev, learning_objectives: newObjectives }));
                              }}
                            >
                              Remove
                            </Button>
                          )}
                        </div>
                      ))}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setFormData(prev => ({ ...prev, learning_objectives: [...prev.learning_objectives, ''] }))}
                      >
                        Add Objective
                      </Button>
                    </div>
                  </div>
                )}
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddContentOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddContent}>
                  Create {contentType.charAt(0).toUpperCase() + contentType.slice(1)}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Skills</CardTitle>
              <BookOpen className="h-4 w-4 text-slate-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{skills.length}/5</div>
              <p className="text-xs text-slate-500">Maximum allowed</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Modules</CardTitle>
              <Folder className="h-4 w-4 text-slate-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{modules.length}</div>
              <p className="text-xs text-slate-500">Learning objectives</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Lessons</CardTitle>
              <FileText className="h-4 w-4 text-slate-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{lessons.length}</div>
              <p className="text-xs text-slate-500">Educational content</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Quizzes</CardTitle>
              <HelpCircle className="h-4 w-4 text-slate-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{quizzes.length}</div>
              <p className="text-xs text-slate-500">Assessments</p>
            </CardContent>
          </Card>
        </div>

        {/* Content Hierarchy */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Content Hierarchy</CardTitle>
                <CardDescription>
                  Skills → Modules → Lessons → Quizzes structure
                </CardDescription>
              </div>
              <div className="flex items-center space-x-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                  <Input
                    placeholder="Search content..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-64"
                  />
                </div>
                <Button variant="outline">
                  <Filter className="w-4 h-4 mr-2" />
                  Filter
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {skills.length === 0 ? (
                <div className="text-center py-8">
                  <BookOpen className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-slate-900 mb-2">No content yet</h3>
                  <p className="text-slate-600 mb-4">
                    Start by creating your first skill. Each skill can contain multiple modules.
                  </p>
                  <Button onClick={() => setIsAddContentOpen(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Create First Skill
                  </Button>
                </div>
              ) : (
                renderContentHierarchy()
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}