import React, { useState } from 'react';
import { Lesson, LessonCard, CardStyling } from '@/types';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import {
  X,
  ChevronLeft,
  ChevronRight,
  Volume2,
  VolumeX,
  Play,
  Pause,
  Home,
  BookOpen
} from 'lucide-react';

interface LessonViewerProps {
  lesson: Lesson;
  onClose: () => void;
  onComplete?: () => void;
}

export default function LessonViewer({ lesson, onClose, onComplete }: LessonViewerProps) {
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);

  // Ensure lesson has cards, create a default one if not
  const lessonCards = lesson.cards && lesson.cards.length > 0 ? lesson.cards : [
    {
      id: `default-card-${lesson.id}`,
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
  ];

  const currentCard = lessonCards[currentCardIndex];
  const progress = ((currentCardIndex + 1) / lessonCards.length) * 100;

  const nextCard = () => {
    if (currentCardIndex < lessonCards.length - 1) {
      setCurrentCardIndex(prev => prev + 1);
    } else {
      // Lesson completed
      onComplete?.();
    }
  };

  const prevCard = () => {
    if (currentCardIndex > 0) {
      setCurrentCardIndex(prev => prev - 1);
    }
  };

  const getFontSizeClass = (size: CardStyling['font_size']) => {
    switch (size) {
      case 'small': return 'text-sm';
      case 'medium': return 'text-base';
      case 'large': return 'text-lg';
      default: return 'text-base';
    }
  };

  const getPaddingClass = (padding: CardStyling['padding']) => {
    switch (padding) {
      case 'small': return 'p-4';
      case 'medium': return 'p-6';
      case 'large': return 'p-8';
      default: return 'p-6';
    }
  };

  const getBorderRadiusClass = (radius: CardStyling['border_radius']) => {
    switch (radius) {
      case 'none': return 'rounded-none';
      case 'small': return 'rounded-sm';
      case 'medium': return 'rounded-md';
      case 'large': return 'rounded-lg';
      default: return 'rounded-md';
    }
  };

  const getShadowClass = (shadow: CardStyling['shadow']) => {
    switch (shadow) {
      case 'none': return 'shadow-none';
      case 'small': return 'shadow-sm';
      case 'medium': return 'shadow-md';
      case 'large': return 'shadow-lg';
      default: return 'shadow-sm';
    }
  };

  const getTextAlignClass = (align: CardStyling['text_align']) => {
    switch (align) {
      case 'left': return 'text-left';
      case 'center': return 'text-center';
      case 'right': return 'text-right';
      default: return 'text-left';
    }
  };

  if (!currentCard) {
    return null;
  }

  return (
    <div 
      className="fixed inset-0 z-50 flex flex-col"
      style={{ backgroundColor: lesson.appearance.background_color }}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-white border-b">
        <div className="flex items-center space-x-3">
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
          <Badge variant="outline" className="flex items-center space-x-1">
            <span className="text-xs">{lesson.appearance.circle_icon}</span>
            <span>{lesson.title}</span>
          </Badge>
        </div>
        <div className="text-sm text-slate-600">
          {`${currentCardIndex + 1} of ${lessonCards.length}`}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="px-4 py-2 bg-white border-b">
        <Progress 
          value={progress} 
          className="h-2"
          style={{ 
            '--progress-background': lesson.appearance.progress_color 
          } as React.CSSProperties}
        />
      </div>

      {/* Card Content */}
      <div className="flex-1 flex items-center justify-center p-4 overflow-auto">
        <div className="w-full max-w-2xl">
          <div
            className={`
              ${getPaddingClass(currentCard.styling.padding)}
              ${getBorderRadiusClass(currentCard.styling.border_radius)}
              ${getShadowClass(currentCard.styling.shadow)}
              ${getFontSizeClass(currentCard.styling.font_size)}
              ${getTextAlignClass(currentCard.styling.text_align)}
              min-h-[300px] flex flex-col justify-center
            `}
            style={{
              backgroundColor: currentCard.styling.background_color,
              color: currentCard.styling.text_color,
              fontFamily: lesson.appearance.text_font
            }}
          >
            {/* Card Title */}
            {currentCard.title && (
              <h2 className="text-xl font-semibold mb-4">
                {currentCard.title}
              </h2>
            )}

            {/* Card Content Based on Type */}
            {currentCard.type === 'text' && (
              <div className="space-y-4">
                <p className="whitespace-pre-wrap leading-relaxed">
                  {currentCard.content}
                </p>
              </div>
            )}

            {currentCard.type === 'image' && currentCard.media_url && (
              <div className="space-y-4">
                <div className="flex justify-center">
                  <img 
                    src={currentCard.media_url} 
                    alt={currentCard.title || 'Lesson image'} 
                    className="max-w-full h-auto rounded-lg shadow-sm"
                    style={{ maxHeight: '400px' }}
                  />
                </div>
                {currentCard.content && (
                  <p className="whitespace-pre-wrap leading-relaxed">
                    {currentCard.content}
                  </p>
                )}
              </div>
            )}

            {currentCard.type === 'video' && currentCard.media_url && (
              <div className="space-y-4">
                <div className="flex justify-center">
                  <video 
                    controls 
                    className="max-w-full h-auto rounded-lg shadow-sm"
                    style={{ maxHeight: '400px' }}
                  >
                    <source src={currentCard.media_url} />
                    Your browser does not support the video tag.
                  </video>
                </div>
                {currentCard.content && (
                  <p className="whitespace-pre-wrap leading-relaxed">
                    {currentCard.content}
                  </p>
                )}
              </div>
            )}

            {currentCard.type === 'audio' && currentCard.media_url && (
              <div className="space-y-4">
                <div className="flex justify-center">
                  <div className="bg-slate-100 rounded-lg p-6 flex items-center space-x-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setIsAudioPlaying(!isAudioPlaying)}
                    >
                      {isAudioPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                    </Button>
                    <audio 
                      controls 
                      className="flex-1"
                      onPlay={() => setIsAudioPlaying(true)}
                      onPause={() => setIsAudioPlaying(false)}
                    >
                      <source src={currentCard.media_url} />
                      Your browser does not support the audio tag.
                    </audio>
                  </div>
                </div>
                {currentCard.content && (
                  <p className="whitespace-pre-wrap leading-relaxed">
                    {currentCard.content}
                  </p>
                )}
              </div>
            )}

            {/* Audio Icon for Text Cards (like in the screenshot) */}
            {currentCard.type === 'text' && (
              <div className="flex justify-end mt-6">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-slate-500 hover:text-slate-700"
                  onClick={() => {
                    // Text-to-speech functionality could be added here
                    console.log('Text-to-speech for:', currentCard.content);
                  }}
                >
                  <Volume2 className="w-5 h-5" />
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Navigation Footer */}
      <div className="p-4 bg-white border-t">
        <div className="flex items-center justify-between max-w-2xl mx-auto">
          <Button
            variant="outline"
            onClick={prevCard}
            disabled={currentCardIndex === 0}
            className="flex items-center space-x-2"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Previous</span>
          </Button>

          <div className="flex items-center space-x-2">
            {lessonCards.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === currentCardIndex 
                    ? 'bg-blue-500' 
                    : index < currentCardIndex 
                      ? 'bg-green-500' 
                      : 'bg-slate-300'
                }`}
              />
            ))}
          </div>

          <Button
            onClick={nextCard}
            className="flex items-center space-x-2"
            style={{ backgroundColor: lesson.appearance.progress_color }}
          >
            <span>
              {currentCardIndex === lessonCards.length - 1 ? 'Complete' : 'Next'}
            </span>
            {currentCardIndex < lessonCards.length - 1 && (
              <ChevronRight className="w-4 h-4" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}