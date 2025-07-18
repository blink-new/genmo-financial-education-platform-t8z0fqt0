import React, { useState } from 'react';
import { Lesson, LessonCard, CardStyling } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import RichCardEditor from './RichCardEditor';
import AdminLayout from './layout/AdminLayout';
import {
  Plus,
  Edit,
  Trash2,
  Eye,
  Image,
  Video,
  FileText,
  Volume2,
  ArrowUp,
  ArrowDown,
  Save,
  ArrowLeft,
  Copy,
  Play,
  Pause,
  RotateCcw
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface LessonEditorProps {
  lesson: Lesson;
  onSave: (lesson: Lesson) => void;
  onClose: () => void;
}

const generateId = () => `card_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

const defaultCardStyling: CardStyling = {
  background_color: '#FFFFFF',
  text_color: '#1F2937',
  font_size: 'medium',
  text_align: 'left',
  padding: 'medium',
  border_radius: 'medium',
  shadow: 'small',
  font_family: 'inter'
};

export default function LessonEditor({ lesson, onSave, onClose }: LessonEditorProps) {
  const [editingLesson, setEditingLesson] = useState<Lesson>({
    ...lesson,
    cards: lesson.cards || []
  });
  const [selectedCard, setSelectedCard] = useState<LessonCard | null>(null);
  const [isCardEditorOpen, setIsCardEditorOpen] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  const [currentPreviewCard, setCurrentPreviewCard] = useState(0);
  const { toast } = useToast();

  const handleSave = () => {
    if (editingLesson.cards.length === 0) {
      toast({
        title: "Warning",
        description: "Consider adding at least one card to make the lesson more engaging.",
        variant: "destructive",
      });
    }

    onSave(editingLesson);
    toast({
      title: "Success",
      description: "Lesson saved successfully with all cards.",
    });
  };

  const createNewCard = () => {
    const newCard: LessonCard = {
      id: generateId(),
      type: 'text',
      content: '',
      title: '',
      order_index: editingLesson.cards.length + 1,
      styling: { ...defaultCardStyling }
    };
    setSelectedCard(newCard);
    setIsCardEditorOpen(true);
  };

  const editCard = (card: LessonCard) => {
    setSelectedCard({ ...card });
    setIsCardEditorOpen(true);
  };

  const saveCard = (updatedCard: LessonCard) => {
    if (editingLesson.cards.find(c => c.id === updatedCard.id)) {
      // Update existing card
      setEditingLesson(prev => ({
        ...prev,
        cards: prev.cards.map(c => c.id === updatedCard.id ? updatedCard : c)
      }));
      toast({
        title: "Success",
        description: "Card updated successfully.",
      });
    } else {
      // Add new card
      setEditingLesson(prev => ({
        ...prev,
        cards: [...prev.cards, updatedCard]
      }));
      toast({
        title: "Success",
        description: "New card added to lesson.",
      });
    }

    setIsCardEditorOpen(false);
    setSelectedCard(null);
  };

  const duplicateCard = (card: LessonCard) => {
    const duplicatedCard: LessonCard = {
      ...card,
      id: generateId(),
      title: `${card.title} (Copy)`,
      order_index: editingLesson.cards.length + 1
    };
    
    setEditingLesson(prev => ({
      ...prev,
      cards: [...prev.cards, duplicatedCard]
    }));

    toast({
      title: "Success",
      description: "Card duplicated successfully.",
    });
  };

  const deleteCard = (cardId: string) => {
    if (window.confirm('Are you sure you want to delete this card? This action cannot be undone.')) {
      setEditingLesson(prev => ({
        ...prev,
        cards: prev.cards.filter(c => c.id !== cardId).map((card, index) => ({
          ...card,
          order_index: index + 1
        }))
      }));

      toast({
        title: "Success",
        description: "Card deleted successfully.",
      });
    }
  };

  const moveCard = (cardId: string, direction: 'up' | 'down') => {
    const cards = [...editingLesson.cards].sort((a, b) => a.order_index - b.order_index);
    const index = cards.findIndex(c => c.id === cardId);
    
    if (direction === 'up' && index > 0) {
      [cards[index], cards[index - 1]] = [cards[index - 1], cards[index]];
    } else if (direction === 'down' && index < cards.length - 1) {
      [cards[index], cards[index + 1]] = [cards[index + 1], cards[index]];
    }

    // Update order_index
    cards.forEach((card, idx) => {
      card.order_index = idx + 1;
    });

    setEditingLesson(prev => ({ ...prev, cards }));
  };

  const getCardTypeIcon = (type: LessonCard['type']) => {
    switch (type) {
      case 'text': return FileText;
      case 'image': return Image;
      case 'video': return Video;
      case 'audio': return Volume2;
      default: return FileText;
    }
  };

  const getCardTypeColor = (type: LessonCard['type']) => {
    switch (type) {
      case 'text': return 'bg-blue-100 text-blue-800';
      case 'image': return 'bg-green-100 text-green-800';
      case 'video': return 'bg-purple-100 text-purple-800';
      case 'audio': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const renderCardPreview = (card: LessonCard) => {
    const style = {
      backgroundColor: card.styling.background_color,
      color: card.styling.text_color,
      padding: card.styling.padding === 'small' ? '8px' :
               card.styling.padding === 'medium' ? '16px' :
               card.styling.padding === 'large' ? '24px' : '16px',
      borderRadius: card.styling.border_radius === 'none' ? '0px' :
                    card.styling.border_radius === 'small' ? '4px' :
                    card.styling.border_radius === 'medium' ? '8px' :
                    card.styling.border_radius === 'large' ? '12px' : '8px',
      textAlign: card.styling.text_align as 'left' | 'center' | 'right'
    };

    return (
      <div style={style} className="border">
        {card.title && (
          <h4 className="font-semibold mb-2">{card.title}</h4>
        )}
        {card.media_url && (
          <div className="mb-2">
            {card.type === 'image' && (
              <img src={card.media_url} alt={card.title || 'Card image'} className="w-full h-32 object-cover rounded" />
            )}
            {card.type === 'video' && (
              <video src={card.media_url} className="w-full h-32 object-cover rounded" />
            )}
            {card.type === 'audio' && (
              <div className="bg-slate-100 p-4 rounded flex items-center justify-center">
                <Volume2 className="w-6 h-6 text-slate-400" />
              </div>
            )}
          </div>
        )}
        {card.content && (
          <p className="text-sm whitespace-pre-wrap">{card.content.substring(0, 100)}{card.content.length > 100 ? '...' : ''}</p>
        )}
      </div>
    );
  };

  const sortedCards = editingLesson.cards.sort((a, b) => a.order_index - b.order_index);

  if (previewMode) {
    const currentCard = sortedCards[currentPreviewCard];
    
    return (
      <AdminLayout>
        <div className="max-w-4xl mx-auto">
          {/* Preview Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <Button variant="outline" onClick={() => setPreviewMode(false)}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Editor
              </Button>
              <div>
                <h1 className="text-2xl font-bold">{editingLesson.title}</h1>
                <p className="text-slate-600">Card {currentPreviewCard + 1} of {sortedCards.length}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                onClick={() => setCurrentPreviewCard(Math.max(0, currentPreviewCard - 1))}
                disabled={currentPreviewCard === 0}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                onClick={() => setCurrentPreviewCard(Math.min(sortedCards.length - 1, currentPreviewCard + 1))}
                disabled={currentPreviewCard === sortedCards.length - 1}
              >
                Next
              </Button>
            </div>
          </div>

          {/* Card Preview */}
          {currentCard && (
            <Card className="max-w-2xl mx-auto">
              <CardContent className="p-8">
                <div 
                  style={{
                    backgroundColor: currentCard.styling.background_color,
                    color: currentCard.styling.text_color,
                    padding: currentCard.styling.padding === 'small' ? '8px' :
                             currentCard.styling.padding === 'medium' ? '16px' :
                             currentCard.styling.padding === 'large' ? '24px' : '16px',
                    borderRadius: currentCard.styling.border_radius === 'none' ? '0px' :
                                  currentCard.styling.border_radius === 'small' ? '4px' :
                                  currentCard.styling.border_radius === 'medium' ? '8px' :
                                  currentCard.styling.border_radius === 'large' ? '12px' : '8px',
                    textAlign: currentCard.styling.text_align as 'left' | 'center' | 'right',
                    fontSize: currentCard.styling.font_size === 'small' ? '14px' :
                              currentCard.styling.font_size === 'medium' ? '16px' :
                              currentCard.styling.font_size === 'large' ? '18px' : '16px',
                    fontFamily: currentCard.styling.font_family || 'Inter'
                  }}
                >
                  {currentCard.title && (
                    <h2 className="text-3xl font-bold mb-6">{currentCard.title}</h2>
                  )}
                  
                  {currentCard.media_url && (
                    <div className="mb-6">
                      {currentCard.type === 'image' && (
                        <img 
                          src={currentCard.media_url} 
                          alt={currentCard.title || 'Card image'} 
                          className="w-full h-auto rounded-lg"
                        />
                      )}
                      {currentCard.type === 'video' && (
                        <video 
                          src={currentCard.media_url} 
                          controls 
                          className="w-full h-auto rounded-lg"
                        />
                      )}
                      {currentCard.type === 'audio' && (
                        <audio 
                          src={currentCard.media_url} 
                          controls 
                          className="w-full"
                        />
                      )}
                    </div>
                  )}
                  
                  {currentCard.content && (
                    <div className="whitespace-pre-wrap leading-relaxed">
                      {currentCard.content}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Progress Indicator */}
          <div className="flex justify-center mt-8">
            <div className="flex space-x-2">
              {sortedCards.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentPreviewCard(index)}
                  className={`w-3 h-3 rounded-full transition-colors ${
                    index === currentPreviewCard ? 'bg-blue-600' : 'bg-slate-300'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="outline" onClick={onClose}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Content
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Edit Lesson</h1>
              <p className="text-slate-600">{editingLesson.title}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {sortedCards.length > 0 && (
              <Button variant="outline" onClick={() => setPreviewMode(true)}>
                <Eye className="w-4 h-4 mr-2" />
                Preview Lesson
              </Button>
            )}
            <Button onClick={handleSave}>
              <Save className="w-4 h-4 mr-2" />
              Save Lesson
            </Button>
          </div>
        </div>

        {/* Lesson Info */}
        <Card>
          <CardHeader>
            <CardTitle>Lesson Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="lesson-title">Lesson Title</Label>
                <Input
                  id="lesson-title"
                  value={editingLesson.title}
                  onChange={(e) => setEditingLesson(prev => ({ ...prev, title: e.target.value }))}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="lesson-type">Content Type</Label>
                <Select
                  value={editingLesson.content_type}
                  onValueChange={(value) => setEditingLesson(prev => ({ ...prev, content_type: value as any }))}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="text">Text</SelectItem>
                    <SelectItem value="video">Video</SelectItem>
                    <SelectItem value="interactive">Interactive</SelectItem>
                    <SelectItem value="mixed">Mixed (Cards)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Lesson Appearance */}
        <Card>
          <CardHeader>
            <CardTitle>Lesson Appearance</CardTitle>
            <p className="text-sm text-slate-600">Customize how this lesson appears to learners</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="circle-icon">Circle Icon</Label>
                <Select
                  value={editingLesson.appearance.circle_icon}
                  onValueChange={(value) => setEditingLesson(prev => ({ 
                    ...prev, 
                    appearance: { ...prev.appearance, circle_icon: value }
                  }))}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="💰">💰 Money</SelectItem>
                    <SelectItem value="📊">📊 Chart</SelectItem>
                    <SelectItem value="📝">📝 Note</SelectItem>
                    <SelectItem value="🛡️">🛡️ Shield</SelectItem>
                    <SelectItem value="💡">💡 Idea</SelectItem>
                    <SelectItem value="🎯">🎯 Target</SelectItem>
                    <SelectItem value="📚">📚 Books</SelectItem>
                    <SelectItem value="🏦">🏦 Bank</SelectItem>
                    <SelectItem value="💳">💳 Card</SelectItem>
                    <SelectItem value="📈">📈 Growth</SelectItem>
                    <SelectItem value="🔒">🔒 Security</SelectItem>
                    <SelectItem value="⭐">⭐ Star</SelectItem>
                    <SelectItem value="🚀">🚀 Rocket</SelectItem>
                    <SelectItem value="🎓">🎓 Graduate</SelectItem>
                    <SelectItem value="🔑">🔑 Key</SelectItem>
                    <SelectItem value="💎">💎 Diamond</SelectItem>
                    <SelectItem value="🏆">🏆 Trophy</SelectItem>
                    <SelectItem value="🎪">🎪 Circus</SelectItem>
                    <SelectItem value="🌟">🌟 Sparkle</SelectItem>
                    <SelectItem value="🎨">🎨 Art</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="circle-color">Circle Color</Label>
                <Input
                  id="circle-color"
                  type="color"
                  value={editingLesson.appearance.circle_color}
                  onChange={(e) => setEditingLesson(prev => ({ 
                    ...prev, 
                    appearance: { ...prev.appearance, circle_color: e.target.value }
                  }))}
                  className="mt-1 h-10"
                />
              </div>
              <div>
                <Label htmlFor="progress-color">Progress Color</Label>
                <Input
                  id="progress-color"
                  type="color"
                  value={editingLesson.appearance.progress_color}
                  onChange={(e) => setEditingLesson(prev => ({ 
                    ...prev, 
                    appearance: { ...prev.appearance, progress_color: e.target.value }
                  }))}
                  className="mt-1 h-10"
                />
              </div>
            </div>
            
            {/* Preview */}
            <div className="mt-6 p-4 bg-slate-50 rounded-lg">
              <Label className="text-sm font-medium text-slate-700 mb-2 block">Preview</Label>
              <div className="flex items-center space-x-4">
                <div 
                  className="w-16 h-16 rounded-full flex items-center justify-center text-2xl shadow-lg"
                  style={{ backgroundColor: editingLesson.appearance.circle_color }}
                >
                  {editingLesson.appearance.circle_icon}
                </div>
                <div>
                  <h4 className="font-medium text-slate-900">{editingLesson.title || 'Lesson Title'}</h4>
                  <p className="text-sm text-slate-600">This is how the lesson will appear to learners</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Cards Section */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Lesson Cards</CardTitle>
                <p className="text-sm text-slate-600 mt-1">
                  Create engaging content with rich media, custom styling, and interactive elements
                </p>
              </div>
              <Button onClick={createNewCard}>
                <Plus className="w-4 h-4 mr-2" />
                Add Card
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {sortedCards.length === 0 ? (
              <div className="text-center py-12 border-2 border-dashed border-slate-300 rounded-lg">
                <FileText className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-slate-900 mb-2">No cards yet</h3>
                <p className="text-slate-600 mb-6 max-w-md mx-auto">
                  Cards are the building blocks of your lesson. Each card can contain text, images, videos, 
                  or audio with full customization options for fonts, colors, and layout.
                </p>
                <Button onClick={createNewCard} size="lg">
                  <Plus className="w-5 h-5 mr-2" />
                  Create Your First Card
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {sortedCards.map((card, index) => {
                  const Icon = getCardTypeIcon(card.type);
                  
                  return (
                    <Card key={card.id} className="border-2 hover:border-slate-300 transition-colors">
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
                              <Icon className="w-5 h-5 text-slate-600" />
                            </div>
                            <div>
                              <div className="flex items-center space-x-2">
                                <h4 className="font-semibold">
                                  {card.title || `Card ${index + 1}`}
                                </h4>
                                <Badge className={getCardTypeColor(card.type)}>
                                  {card.type.toUpperCase()}
                                </Badge>
                              </div>
                              <p className="text-sm text-slate-600">
                                {card.content ? `${card.content.substring(0, 60)}${card.content.length > 60 ? '...' : ''}` : 'No content'}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => moveCard(card.id, 'up')}
                              disabled={index === 0}
                              title="Move up"
                            >
                              <ArrowUp className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => moveCard(card.id, 'down')}
                              disabled={index === sortedCards.length - 1}
                              title="Move down"
                            >
                              <ArrowDown className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => duplicateCard(card)}
                              title="Duplicate card"
                            >
                              <Copy className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => editCard(card)}
                              title="Edit card"
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => deleteCard(card.id)}
                              className="text-red-600 hover:text-red-700"
                              title="Delete card"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <div className="bg-slate-50 rounded-lg p-4">
                          {renderCardPreview(card)}
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Rich Card Editor Modal */}
        {isCardEditorOpen && selectedCard && (
          <RichCardEditor
            card={selectedCard}
            onSave={saveCard}
            onCancel={() => {
              setIsCardEditorOpen(false);
              setSelectedCard(null);
            }}
          />
        )}
      </div>
    </AdminLayout>
  );
}