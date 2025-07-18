import { ReactNode } from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { Client, Skill, Module, Lesson, Quiz, Activity } from '@/types';
import { AppContext, AppContextType } from './AppContextType';

// Initial sample data
const initialClients: Client[] = [
  {
    id: 'client-1',
    name: 'First National Bank',
    type: 'bank',
    status: 'active',
    contact_email: 'admin@firstnational.com',
    description: 'Leading regional bank focused on community financial education',
    branding: {
      primary_color: '#1E40AF',
      accent_color: '#3B82F6',
      logo_url: '/logos/fnb.png',
      font_family: 'Inter'
    },
    created_at: '2024-01-15T10:00:00Z',
    updated_at: '2024-01-15T10:00:00Z',
    user_id: 'admin-1'
  },
  {
    id: 'client-2',
    name: 'Community Credit Union',
    type: 'credit_union',
    status: 'active',
    contact_email: 'learning@communitycu.org',
    description: 'Member-owned financial cooperative serving local communities',
    branding: {
      primary_color: '#059669',
      accent_color: '#10B981',
      logo_url: '/logos/ccu.png',
      font_family: 'Inter'
    },
    created_at: '2024-02-20T10:00:00Z',
    updated_at: '2024-02-20T10:00:00Z',
    user_id: 'admin-1'
  }
];

const initialSkills: Skill[] = [
  {
    id: 'skill-1',
    title: 'Personal Finance Fundamentals',
    description: 'Master the basics of personal financial management',
    difficulty: 'beginner',
    estimated_duration: 180,
    order_index: 1,
    status: 'published',
    created_at: '2024-01-10T10:00:00Z',
    updated_at: '2024-01-10T10:00:00Z',
    user_id: 'admin-1'
  },
  {
    id: 'skill-2',
    title: 'Risk and Reward',
    description: 'Understanding the relationship between investment risk and potential returns',
    difficulty: 'intermediate',
    estimated_duration: 120,
    order_index: 2,
    status: 'published',
    created_at: '2024-01-12T10:00:00Z',
    updated_at: '2024-01-12T10:00:00Z',
    user_id: 'admin-1'
  },
  {
    id: 'skill-3',
    title: 'Credit Management',
    description: 'Understanding and improving your credit score',
    difficulty: 'intermediate',
    estimated_duration: 120,
    order_index: 3,
    status: 'published',
    created_at: '2024-01-14T10:00:00Z',
    updated_at: '2024-01-14T10:00:00Z',
    user_id: 'admin-1'
  },
  {
    id: 'skill-4',
    title: 'Retirement Planning',
    description: 'Plan for a secure financial future',
    difficulty: 'intermediate',
    estimated_duration: 200,
    order_index: 4,
    status: 'published',
    created_at: '2024-01-16T10:00:00Z',
    updated_at: '2024-01-16T10:00:00Z',
    user_id: 'admin-1'
  },
  {
    id: 'skill-5',
    title: 'Investment Strategies',
    description: 'Learn advanced investment techniques and portfolio management',
    difficulty: 'advanced',
    estimated_duration: 240,
    order_index: 5,
    status: 'published',
    created_at: '2024-01-18T10:00:00Z',
    updated_at: '2024-01-18T10:00:00Z',
    user_id: 'admin-1'
  },
  {
    id: 'skill-6',
    title: 'Small Business Finance',
    description: 'Financial management for entrepreneurs',
    difficulty: 'advanced',
    estimated_duration: 300,
    order_index: 6,
    status: 'draft',
    created_at: '2024-01-20T10:00:00Z',
    updated_at: '2024-01-20T10:00:00Z',
    user_id: 'admin-1'
  }
];

// Start with empty arrays - demo should show only user-created content
const initialModules: Module[] = [];
const initialLessons: Lesson[] = [];
const initialQuizzes: Quiz[] = [];

export function AppProvider({ children }: { children: ReactNode }) {
  const [clients, setClients] = useLocalStorage<Client[]>('genmo-clients', initialClients);
  const [skills, setSkills] = useLocalStorage<Skill[]>('genmo-skills', initialSkills);
  const [modules, setModules] = useLocalStorage<Module[]>('genmo-modules', initialModules);
  const [lessons, setLessons] = useLocalStorage<Lesson[]>('genmo-lessons', initialLessons);
  const [quizzes, setQuizzes] = useLocalStorage<Quiz[]>('genmo-quizzes', initialQuizzes);
  const [activities, setActivities] = useLocalStorage<Activity[]>('genmo-activities', []);

  // Generate unique IDs
  const generateId = () => `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  // Helper function to add activity
  const addActivity = (
    type: Activity['type'],
    title: string,
    description: string,
    entityId: string,
    entityType: Activity['entity_type'],
    entityName: string
  ) => {
    const newActivity: Activity = {
      id: generateId(),
      type,
      title,
      description,
      entity_id: entityId,
      entity_type: entityType,
      entity_name: entityName,
      created_at: new Date().toISOString(),
      user_id: 'admin-1' // In real app, this would come from auth
    };
    setActivities(prev => [newActivity, ...prev]);
  };

  // Get recent activities
  const getRecentActivities = (limit: number = 10) => {
    return activities
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .slice(0, limit);
  };

  // Client management functions
  const addClient = (clientData: Omit<Client, 'id' | 'created_at' | 'updated_at'>) => {
    const newClient: Client = {
      ...clientData,
      id: generateId(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    setClients(prev => [...prev, newClient]);
    addActivity(
      'client_added',
      'New client onboarded',
      `${newClient.name} has been added to the platform`,
      newClient.id,
      'client',
      newClient.name
    );
  };

  const updateClient = (id: string, updates: Partial<Client>) => {
    const client = clients.find(c => c.id === id);
    if (client) {
      setClients(prev => prev.map(c => 
        c.id === id 
          ? { ...c, ...updates, updated_at: new Date().toISOString() }
          : c
      ));
      addActivity(
        'client_updated',
        'Client updated',
        `${client.name} settings have been modified`,
        id,
        'client',
        client.name
      );
    }
  };

  const deleteClient = (id: string) => {
    const client = clients.find(c => c.id === id);
    if (client) {
      setClients(prev => prev.filter(c => c.id !== id));
      addActivity(
        'client_deleted',
        'Client removed',
        `${client.name} has been removed from the platform`,
        id,
        'client',
        client.name
      );
    }
  };

  // Skill management functions
  const addSkill = (skillData: Omit<Skill, 'id' | 'created_at' | 'updated_at'>) => {
    const newSkill: Skill = {
      ...skillData,
      id: generateId(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    setSkills(prev => [...prev, newSkill]);
    addActivity(
      'skill_added',
      'New skill created',
      `"${newSkill.title}" skill has been added to the content library`,
      newSkill.id,
      'skill',
      newSkill.title
    );
  };

  const updateSkill = (id: string, updates: Partial<Skill>) => {
    const skill = skills.find(s => s.id === id);
    if (skill) {
      setSkills(prev => prev.map(s => 
        s.id === id 
          ? { ...s, ...updates, updated_at: new Date().toISOString() }
          : s
      ));
      addActivity(
        'skill_updated',
        'Skill updated',
        `"${skill.title}" skill has been modified`,
        id,
        'skill',
        skill.title
      );
    }
  };

  const deleteSkill = (id: string) => {
    const skill = skills.find(s => s.id === id);
    if (skill) {
      setSkills(prev => prev.filter(s => s.id !== id));
      // Also delete related modules, lessons, and quizzes
      setModules(prev => prev.filter(module => module.skill_id !== id));
      const moduleIds = modules.filter(m => m.skill_id === id).map(m => m.id);
      setLessons(prev => prev.filter(lesson => !moduleIds.includes(lesson.module_id)));
      const lessonIds = lessons.filter(l => moduleIds.includes(l.module_id)).map(l => l.id);
      setQuizzes(prev => prev.filter(quiz => !lessonIds.includes(quiz.lesson_id)));
      addActivity(
        'skill_deleted',
        'Skill removed',
        `"${skill.title}" skill and all related content have been removed`,
        id,
        'skill',
        skill.title
      );
    }
  };

  const toggleSkillStatus = (id: string) => {
    const skill = skills.find(s => s.id === id);
    if (skill) {
      const newStatus = skill.status === 'published' ? 'draft' : 'published';
      updateSkill(id, { status: newStatus });
    }
  };

  // Module management functions
  const addModule = (moduleData: Omit<Module, 'id' | 'created_at' | 'updated_at'>) => {
    const newModule: Module = {
      ...moduleData,
      id: generateId(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    setModules(prev => [...prev, newModule]);
    addActivity(
      'module_added',
      'New module created',
      `"${newModule.title}" module has been added`,
      newModule.id,
      'module',
      newModule.title
    );
  };

  const updateModule = (id: string, updates: Partial<Module>) => {
    const module = modules.find(m => m.id === id);
    if (module) {
      setModules(prev => prev.map(m => 
        m.id === id 
          ? { ...m, ...updates, updated_at: new Date().toISOString() }
          : m
      ));
      addActivity(
        'module_updated',
        'Module updated',
        `"${module.title}" module has been modified`,
        id,
        'module',
        module.title
      );
    }
  };

  const deleteModule = (id: string) => {
    const module = modules.find(m => m.id === id);
    if (module) {
      setModules(prev => prev.filter(m => m.id !== id));
      // Also delete related lessons and quizzes
      setLessons(prev => prev.filter(lesson => lesson.module_id !== id));
      const lessonIds = lessons.filter(l => l.module_id === id).map(l => l.id);
      setQuizzes(prev => prev.filter(quiz => !lessonIds.includes(quiz.lesson_id)));
      addActivity(
        'module_deleted',
        'Module removed',
        `"${module.title}" module and all related content have been removed`,
        id,
        'module',
        module.title
      );
    }
  };

  const toggleModuleStatus = (id: string) => {
    const module = modules.find(m => m.id === id);
    if (module) {
      const newStatus = module.status === 'published' ? 'draft' : 'published';
      updateModule(id, { status: newStatus });
    }
  };

  // Lesson management functions
  const addLesson = (lessonData: Omit<Lesson, 'id' | 'created_at' | 'updated_at'>) => {
    const newLesson: Lesson = {
      ...lessonData,
      id: generateId(),
      cards: lessonData.cards || [],
      appearance: lessonData.appearance || {
        circle_color: '#10B981',
        circle_icon: '📚',
        text_font: 'Inter',
        text_color: '#1F2937',
        progress_color: '#F59E0B',
        background_color: '#F9FAFB'
      },
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    setLessons(prev => [...prev, newLesson]);
    addActivity(
      'lesson_added',
      'New lesson created',
      `"${newLesson.title}" lesson has been added`,
      newLesson.id,
      'lesson',
      newLesson.title
    );
  };

  const updateLesson = (id: string, updates: Partial<Lesson>) => {
    const lesson = lessons.find(l => l.id === id);
    if (lesson) {
      setLessons(prev => prev.map(l => 
        l.id === id 
          ? { ...l, ...updates, updated_at: new Date().toISOString() }
          : l
      ));
      addActivity(
        'lesson_updated',
        'Lesson updated',
        `"${lesson.title}" lesson has been modified`,
        id,
        'lesson',
        lesson.title
      );
    }
  };

  const deleteLesson = (id: string) => {
    const lesson = lessons.find(l => l.id === id);
    if (lesson) {
      setLessons(prev => prev.filter(l => l.id !== id));
      // Also delete related quizzes
      setQuizzes(prev => prev.filter(quiz => quiz.lesson_id !== id));
      addActivity(
        'lesson_deleted',
        'Lesson removed',
        `"${lesson.title}" lesson and related quizzes have been removed`,
        id,
        'lesson',
        lesson.title
      );
    }
  };

  const toggleLessonStatus = (id: string) => {
    const lesson = lessons.find(l => l.id === id);
    if (lesson) {
      const newStatus = lesson.status === 'published' ? 'draft' : 'published';
      updateLesson(id, { status: newStatus });
    }
  };

  // Quiz management functions
  const addQuiz = (quizData: Omit<Quiz, 'id' | 'created_at' | 'updated_at'>) => {
    const newQuiz: Quiz = {
      ...quizData,
      id: generateId(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    setQuizzes(prev => [...prev, newQuiz]);
    addActivity(
      'quiz_added',
      'New quiz created',
      `"${newQuiz.title}" quiz has been added`,
      newQuiz.id,
      'quiz',
      newQuiz.title
    );
  };

  const updateQuiz = (id: string, updates: Partial<Quiz>) => {
    const quiz = quizzes.find(q => q.id === id);
    if (quiz) {
      setQuizzes(prev => prev.map(q => 
        q.id === id 
          ? { ...q, ...updates, updated_at: new Date().toISOString() }
          : q
      ));
      addActivity(
        'quiz_updated',
        'Quiz updated',
        `"${quiz.title}" quiz has been modified`,
        id,
        'quiz',
        quiz.title
      );
    }
  };

  const deleteQuiz = (id: string) => {
    const quiz = quizzes.find(q => q.id === id);
    if (quiz) {
      setQuizzes(prev => prev.filter(q => q.id !== id));
      addActivity(
        'quiz_deleted',
        'Quiz removed',
        `"${quiz.title}" quiz has been removed`,
        id,
        'quiz',
        quiz.title
      );
    }
  };

  const toggleQuizStatus = (id: string) => {
    const quiz = quizzes.find(q => q.id === id);
    if (quiz) {
      const newStatus = quiz.status === 'published' ? 'draft' : 'published';
      updateQuiz(id, { status: newStatus });
    }
  };

  const value: AppContextType = {
    clients,
    addClient,
    updateClient,
    deleteClient,
    skills,
    modules,
    lessons,
    quizzes,
    addSkill,
    updateSkill,
    deleteSkill,
    toggleSkillStatus,
    addModule,
    updateModule,
    deleteModule,
    toggleModuleStatus,
    addLesson,
    updateLesson,
    deleteLesson,
    toggleLessonStatus,
    addQuiz,
    updateQuiz,
    deleteQuiz,
    toggleQuizStatus,
    activities,
    getRecentActivities,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}