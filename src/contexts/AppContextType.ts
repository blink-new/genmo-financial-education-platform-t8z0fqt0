import { createContext } from 'react';
import { Client, Skill, Module, Lesson, Quiz, Activity } from '@/types';

export interface AppContextType {
  // Client management
  clients: Client[];
  addClient: (client: Omit<Client, 'id' | 'created_at' | 'updated_at'>) => void;
  updateClient: (id: string, updates: Partial<Client>) => void;
  deleteClient: (id: string) => void;
  
  // Content management
  skills: Skill[];
  modules: Module[];
  lessons: Lesson[];
  quizzes: Quiz[];
  
  addSkill: (skill: Omit<Skill, 'id' | 'created_at' | 'updated_at'>) => void;
  updateSkill: (id: string, updates: Partial<Skill>) => void;
  deleteSkill: (id: string) => void;
  toggleSkillStatus: (id: string) => void;
  
  addModule: (module: Omit<Module, 'id' | 'created_at' | 'updated_at'>) => void;
  updateModule: (id: string, updates: Partial<Module>) => void;
  deleteModule: (id: string) => void;
  toggleModuleStatus: (id: string) => void;
  
  addLesson: (lesson: Omit<Lesson, 'id' | 'created_at' | 'updated_at'>) => void;
  updateLesson: (id: string, updates: Partial<Lesson>) => void;
  deleteLesson: (id: string) => void;
  toggleLessonStatus: (id: string) => void;
  
  addQuiz: (quiz: Omit<Quiz, 'id' | 'created_at' | 'updated_at'>) => void;
  updateQuiz: (id: string, updates: Partial<Quiz>) => void;
  deleteQuiz: (id: string) => void;
  toggleQuizStatus: (id: string) => void;

  // Activity tracking
  activities: Activity[];
  getRecentActivities: (limit?: number) => Activity[];
}

export const AppContext = createContext<AppContextType | undefined>(undefined);