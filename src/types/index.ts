// Core types for the GenMo platform

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'client_admin' | 'learner';
  created_at: string;
  updated_at: string;
}

export interface Client {
  id: string;
  name: string;
  type: 'bank' | 'credit_union' | 'savings_loan' | 'insurance';
  status: 'active' | 'setup' | 'paused' | 'inactive';
  contact_email: string;
  description?: string;
  branding: ClientBranding;
  created_at: string;
  updated_at: string;
  user_id: string; // Admin who created this client
}

export interface ClientBranding {
  primary_color: string;
  accent_color: string;
  logo_url?: string;
  font_family?: string;
  custom_css?: string;
}

export interface Skill {
  id: string;
  title: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimated_duration: number; // in minutes
  order_index: number;
  status: 'draft' | 'published' | 'archived';
  created_at: string;
  updated_at: string;
  user_id: string;
}

export interface Module {
  id: string;
  skill_id: string;
  title: string;
  description: string;
  learning_objectives: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimated_duration: number; // in minutes
  order_index: number;
  status: 'draft' | 'published' | 'archived';
  created_at: string;
  updated_at: string;
  user_id: string;
}

export interface Lesson {
  id: string;
  module_id: string;
  title: string;
  content: string; // Rich text content
  content_type: 'text' | 'video' | 'interactive' | 'mixed';
  estimated_duration: number; // in minutes
  order_index: number;
  status: 'draft' | 'published' | 'archived';
  cards: LessonCard[];
  appearance: LessonAppearance;
  created_at: string;
  updated_at: string;
  user_id: string;
}

export interface LessonCard {
  id: string;
  type: 'text' | 'image' | 'video' | 'gif' | 'audio' | 'quiz' | 'interactive';
  title?: string;
  content: string; // Text content, URL for media, or JSON for interactive content
  media_url?: string;
  order_index: number;
  styling: CardStyling;
}

export interface CardStyling {
  background_color: string;
  text_color: string;
  font_size: 'small' | 'medium' | 'large';
  text_align: 'left' | 'center' | 'right';
  padding: 'small' | 'medium' | 'large';
  border_radius: 'none' | 'small' | 'medium' | 'large';
  shadow: 'none' | 'small' | 'medium' | 'large';
  font_family?: string;
  custom_css?: string;
  animation?: string;
}

export interface LessonAppearance {
  circle_color: string;
  circle_icon: string; // Icon name or emoji
  text_font: string;
  text_color: string;
  progress_color: string;
  background_color: string;
}

export interface Quiz {
  id: string;
  lesson_id: string;
  title: string;
  description?: string;
  questions: QuizQuestion[];
  passing_score: number; // percentage
  max_attempts: number;
  status: 'draft' | 'published' | 'archived';
  created_at: string;
  updated_at: string;
  user_id: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  type: 'single_choice' | 'multiple_choice' | 'true_false';
  options: QuizOption[];
  correct_answer: string | string[];
  explanation?: string;
  order_index: number;
}

export interface QuizOption {
  id: string;
  text: string;
  is_correct: boolean;
}

export interface LearnerProgress {
  id: string;
  user_id: string;
  client_id: string;
  skill_id?: string;
  module_id?: string;
  lesson_id?: string;
  quiz_id?: string;
  status: 'not_started' | 'in_progress' | 'completed';
  progress_percentage: number;
  score?: number;
  time_spent: number; // in minutes
  started_at?: string;
  completed_at?: string;
  last_accessed: string;
}

export interface UserFlow {
  id: string;
  name: string;
  description: string;
  steps: UserFlowStep[];
  target_demographic: 'kids' | 'teens' | 'adults' | 'all';
  created_at: string;
  updated_at: string;
  user_id: string;
}

export interface UserFlowStep {
  id: string;
  type: 'welcome' | 'login' | 'home' | 'skill_selection' | 'module_overview' | 'lesson' | 'quiz' | 'progress' | 'completion';
  title: string;
  description: string;
  screen_type: 'modal' | 'page' | 'overlay';
  order_index: number;
  conditions?: string; // JSON string of conditions
  actions?: string; // JSON string of actions
}

// Analytics and reporting types
export interface AnalyticsData {
  total_learners: number;
  active_learners: number;
  completion_rate: number;
  average_session_time: number;
  engagement_score: number;
  popular_content: ContentPopularity[];
  demographic_breakdown: DemographicData[];
}

export interface ContentPopularity {
  content_id: string;
  content_type: 'skill' | 'module' | 'lesson' | 'quiz';
  title: string;
  views: number;
  completions: number;
  average_rating: number;
  engagement_time: number;
}

export interface DemographicData {
  demographic: 'kids' | 'teens' | 'adults';
  learner_count: number;
  completion_rate: number;
  average_session_time: number;
  popular_topics: string[];
}

export interface Activity {
  id: string;
  type: 'client_added' | 'client_updated' | 'client_deleted' | 
        'skill_added' | 'skill_updated' | 'skill_deleted' |
        'module_added' | 'module_updated' | 'module_deleted' |
        'lesson_added' | 'lesson_updated' | 'lesson_deleted' |
        'quiz_added' | 'quiz_updated' | 'quiz_deleted';
  title: string;
  description: string;
  entity_id: string;
  entity_type: 'client' | 'skill' | 'module' | 'lesson' | 'quiz';
  entity_name: string;
  created_at: string;
  user_id: string;
}