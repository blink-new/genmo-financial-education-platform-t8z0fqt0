import React, { useState, useRef } from 'react';
import { LessonCard, CardStyling } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import {
  Plus,
  Image,
  Video,
  FileText,
  Volume2,
  Upload,
  Palette,
  Type,
  Layout,
  Settings,
  Eye,
  Code,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Bold,
  Italic,
  Underline
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface RichCardEditorProps {
  card: LessonCard;
  onSave: (card: LessonCard) => void;
  onCancel: () => void;
}

const fontSizes = [
  { value: 'small', label: 'Small (14px)' },
  { value: 'medium', label: 'Medium (16px)' },
  { value: 'large', label: 'Large (18px)' }
];

const fontFamilies = [
  { value: 'inter', label: 'Inter' },
  { value: 'poppins', label: 'Poppins' },
  { value: 'roboto', label: 'Roboto' },
  { value: 'open-sans', label: 'Open Sans' },
  { value: 'lato', label: 'Lato' },
  { value: 'montserrat', label: 'Montserrat' },
  { value: 'playfair', label: 'Playfair Display' },
  { value: 'merriweather', label: 'Merriweather' }
];

const paddingOptions = [
  { value: 'small', label: 'Small (8px)' },
  { value: 'medium', label: 'Medium (16px)' },
  { value: 'large', label: 'Large (24px)' }
];

const borderRadiusOptions = [
  { value: 'none', label: 'None (0px)' },
  { value: 'small', label: 'Small (4px)' },
  { value: 'medium', label: 'Medium (8px)' },
  { value: 'large', label: 'Large (12px)' }
];

const shadowOptions = [
  { value: 'none', label: 'None' },
  { value: 'small', label: 'Small' },
  { value: 'medium', label: 'Medium' },
  { value: 'large', label: 'Large' }
];

export default function RichCardEditor({ card, onSave, onCancel }: RichCardEditorProps) {
  const [editingCard, setEditingCard] = useState<LessonCard>(card);
  const [activeTab, setActiveTab] = useState('content');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleSave = () => {
    if (!editingCard.title?.trim() && !editingCard.content?.trim()) {
      toast({
        title: "Error",
        description: "Please add a title or content to the card.",
        variant: "destructive",
      });
      return;
    }

    onSave(editingCard);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // In a real app, you'd upload to a storage service
      const url = URL.createObjectURL(file);
      setEditingCard(prev => ({
        ...prev,
        media_url: url,
        type: file.type.startsWith('image/') ? 'image' : 
              file.type.startsWith('video/') ? 'video' : 
              file.type.startsWith('audio/') ? 'audio' : 'text'
      }));
      
      toast({
        title: "File uploaded",
        description: `${file.name} has been uploaded successfully.`,
      });
    }
  };

  const updateStyling = (key: keyof CardStyling, value: string) => {
    setEditingCard(prev => ({
      ...prev,
      styling: {
        ...prev.styling,
        [key]: value
      }
    }));
  };

  const getPreviewStyle = () => {
    const styling = editingCard.styling;
    return {
      backgroundColor: styling.background_color,
      color: styling.text_color,
      fontSize: styling.font_size === 'small' ? '14px' :
                styling.font_size === 'medium' ? '16px' :
                styling.font_size === 'large' ? '18px' : '16px',
      textAlign: styling.text_align as 'left' | 'center' | 'right',
      padding: styling.padding === 'small' ? '8px' :
               styling.padding === 'medium' ? '16px' :
               styling.padding === 'large' ? '24px' : '16px',
      borderRadius: styling.border_radius === 'none' ? '0px' :
                    styling.border_radius === 'small' ? '4px' :
                    styling.border_radius === 'medium' ? '8px' :
                    styling.border_radius === 'large' ? '12px' : '8px',
      boxShadow: styling.shadow === 'none' ? 'none' :
                 styling.shadow === 'small' ? '0 1px 2px 0 rgb(0 0 0 / 0.05)' :
                 styling.shadow === 'medium' ? '0 4px 6px -1px rgb(0 0 0 / 0.1)' :
                 styling.shadow === 'large' ? '0 10px 15px -3px rgb(0 0 0 / 0.1)' : '0 4px 6px -1px rgb(0 0 0 / 0.1)',
      fontFamily: styling.font_family || 'Inter'
    };
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-6xl h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Rich Card Editor</h2>
            <p className="text-slate-600">Create engaging content with full customization</p>
          </div>
          <div className="flex items-center space-x-2">
            <Button onClick={handleSave}>
              <Plus className="w-4 h-4 mr-2" />
              Save Card
            </Button>
            <Button variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
            <TabsList className="grid w-full grid-cols-4 mx-6 mt-4">
              <TabsTrigger value="content" className="flex items-center">
                <FileText className="w-4 h-4 mr-2" />
                Content
              </TabsTrigger>
              <TabsTrigger value="media" className="flex items-center">
                <Image className="w-4 h-4 mr-2" />
                Media
              </TabsTrigger>
              <TabsTrigger value="styling" className="flex items-center">
                <Palette className="w-4 h-4 mr-2" />
                Styling
              </TabsTrigger>
              <TabsTrigger value="preview" className="flex items-center">
                <Eye className="w-4 h-4 mr-2" />
                Preview
              </TabsTrigger>
            </TabsList>

            <div className="flex-1 overflow-auto p-6">
              <TabsContent value="content" className="space-y-6 mt-0">
                <div className="grid grid-cols-1 gap-6">
                  {/* Card Type Selection */}
                  <div>
                    <Label className="text-base font-medium">Card Type</Label>
                    <div className="flex space-x-2 mt-2">
                      {[
                        { type: 'text', icon: FileText, label: 'Text' },
                        { type: 'image', icon: Image, label: 'Image' },
                        { type: 'video', icon: Video, label: 'Video' },
                        { type: 'audio', icon: Volume2, label: 'Audio' }
                      ].map(({ type, icon: Icon, label }) => (
                        <Button
                          key={type}
                          variant={editingCard.type === type ? 'default' : 'outline'}
                          onClick={() => setEditingCard(prev => ({ ...prev, type: type as LessonCard['type'] }))}
                          className="flex items-center"
                        >
                          <Icon className="w-4 h-4 mr-2" />
                          {label}
                        </Button>
                      ))}
                    </div>
                  </div>

                  {/* Title */}
                  <div>
                    <Label htmlFor="title" className="text-base font-medium">Card Title</Label>
                    <Input
                      id="title"
                      value={editingCard.title || ''}
                      onChange={(e) => setEditingCard(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="Enter a compelling title for this card"
                      className="mt-2 text-lg"
                    />
                  </div>

                  {/* Content */}
                  <div>
                    <Label htmlFor="content" className="text-base font-medium">Content</Label>
                    <div className="mt-2">
                      {/* Text Formatting Toolbar */}
                      <div className="flex items-center space-x-2 p-2 border border-b-0 rounded-t-md bg-slate-50">
                        <Button variant="ghost" size="sm">
                          <Bold className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Italic className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Underline className="w-4 h-4" />
                        </Button>
                        <div className="w-px h-6 bg-slate-300 mx-2" />
                        <Button variant="ghost" size="sm">
                          <AlignLeft className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <AlignCenter className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <AlignRight className="w-4 h-4" />
                        </Button>
                      </div>
                      <Textarea
                        id="content"
                        value={editingCard.content}
                        onChange={(e) => setEditingCard(prev => ({ ...prev, content: e.target.value }))}
                        placeholder="Write your content here. You can use markdown formatting..."
                        className="min-h-[300px] rounded-t-none border-t-0 resize-none"
                      />
                    </div>
                    <p className="text-sm text-slate-500 mt-2">
                      Supports markdown formatting: **bold**, *italic*, [links](url), etc.
                    </p>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="media" className="space-y-6 mt-0">
                <div className="grid grid-cols-1 gap-6">
                  {/* File Upload */}
                  <div>
                    <Label className="text-base font-medium">Upload Media</Label>
                    <div className="mt-2">
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*,video/*,audio/*"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                      <div 
                        className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center cursor-pointer hover:border-slate-400 transition-colors"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <Upload className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-slate-900 mb-2">Upload Media File</h3>
                        <p className="text-slate-600 mb-4">
                          Drag and drop or click to select images, videos, or audio files
                        </p>
                        <Button variant="outline">
                          <Upload className="w-4 h-4 mr-2" />
                          Choose File
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Media URL */}
                  <div>
                    <Label htmlFor="media-url" className="text-base font-medium">Or Enter Media URL</Label>
                    <Input
                      id="media-url"
                      value={editingCard.media_url || ''}
                      onChange={(e) => setEditingCard(prev => ({ ...prev, media_url: e.target.value }))}
                      placeholder="https://example.com/image.jpg"
                      className="mt-2"
                    />
                  </div>

                  {/* Media Preview */}
                  {editingCard.media_url && (
                    <div>
                      <Label className="text-base font-medium">Media Preview</Label>
                      <div className="mt-2 border rounded-lg p-4">
                        {editingCard.type === 'image' && (
                          <img 
                            src={editingCard.media_url} 
                            alt="Preview" 
                            className="max-w-full h-auto rounded"
                            onError={() => toast({
                              title: "Error",
                              description: "Failed to load image. Please check the URL.",
                              variant: "destructive",
                            })}
                          />
                        )}
                        {editingCard.type === 'video' && (
                          <video 
                            src={editingCard.media_url} 
                            controls 
                            className="max-w-full h-auto rounded"
                          />
                        )}
                        {editingCard.type === 'audio' && (
                          <audio 
                            src={editingCard.media_url} 
                            controls 
                            className="w-full"
                          />
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="styling" className="space-y-6 mt-0">
                <div className="grid grid-cols-2 gap-6">
                  {/* Typography */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Type className="w-5 h-5 mr-2" />
                        Typography
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <Label>Font Family</Label>
                        <Select
                          value={editingCard.styling.font_family || 'inter'}
                          onValueChange={(value) => updateStyling('font_family', value)}
                        >
                          <SelectTrigger className="mt-1">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {fontFamilies.map(font => (
                              <SelectItem key={font.value} value={font.value}>
                                {font.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label>Font Size</Label>
                        <Select
                          value={editingCard.styling.font_size}
                          onValueChange={(value) => updateStyling('font_size', value)}
                        >
                          <SelectTrigger className="mt-1">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {fontSizes.map(size => (
                              <SelectItem key={size.value} value={size.value}>
                                {size.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label>Text Alignment</Label>
                        <div className="flex space-x-2 mt-1">
                          {[
                            { value: 'left', icon: AlignLeft },
                            { value: 'center', icon: AlignCenter },
                            { value: 'right', icon: AlignRight }
                          ].map(({ value, icon: Icon }) => (
                            <Button
                              key={value}
                              variant={editingCard.styling.text_align === value ? 'default' : 'outline'}
                              size="sm"
                              onClick={() => updateStyling('text_align', value)}
                            >
                              <Icon className="w-4 h-4" />
                            </Button>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Colors */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Palette className="w-5 h-5 mr-2" />
                        Colors
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <Label>Background Color</Label>
                        <div className="flex items-center space-x-2 mt-1">
                          <Input
                            type="color"
                            value={editingCard.styling.background_color}
                            onChange={(e) => updateStyling('background_color', e.target.value)}
                            className="w-12 h-10"
                          />
                          <Input
                            value={editingCard.styling.background_color}
                            onChange={(e) => updateStyling('background_color', e.target.value)}
                            className="flex-1"
                          />
                        </div>
                      </div>

                      <div>
                        <Label>Text Color</Label>
                        <div className="flex items-center space-x-2 mt-1">
                          <Input
                            type="color"
                            value={editingCard.styling.text_color}
                            onChange={(e) => updateStyling('text_color', e.target.value)}
                            className="w-12 h-10"
                          />
                          <Input
                            value={editingCard.styling.text_color}
                            onChange={(e) => updateStyling('text_color', e.target.value)}
                            className="flex-1"
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Layout */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Layout className="w-5 h-5 mr-2" />
                        Layout
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <Label>Padding</Label>
                        <Select
                          value={editingCard.styling.padding}
                          onValueChange={(value) => updateStyling('padding', value)}
                        >
                          <SelectTrigger className="mt-1">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {paddingOptions.map(option => (
                              <SelectItem key={option.value} value={option.value}>
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label>Border Radius</Label>
                        <Select
                          value={editingCard.styling.border_radius}
                          onValueChange={(value) => updateStyling('border_radius', value)}
                        >
                          <SelectTrigger className="mt-1">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {borderRadiusOptions.map(option => (
                              <SelectItem key={option.value} value={option.value}>
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label>Shadow</Label>
                        <Select
                          value={editingCard.styling.shadow}
                          onValueChange={(value) => updateStyling('shadow', value)}
                        >
                          <SelectTrigger className="mt-1">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {shadowOptions.map(option => (
                              <SelectItem key={option.value} value={option.value}>
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Advanced */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Settings className="w-5 h-5 mr-2" />
                        Advanced
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <Label htmlFor="custom-css">Custom CSS Classes</Label>
                        <Input
                          id="custom-css"
                          value={editingCard.styling.custom_css || ''}
                          onChange={(e) => updateStyling('custom_css', e.target.value)}
                          placeholder="custom-class another-class"
                          className="mt-1"
                        />
                      </div>

                      <div>
                        <Label htmlFor="animation">Animation</Label>
                        <Select
                          value={editingCard.styling.animation || 'none'}
                          onValueChange={(value) => updateStyling('animation', value)}
                        >
                          <SelectTrigger className="mt-1">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="none">None</SelectItem>
                            <SelectItem value="fade-in">Fade In</SelectItem>
                            <SelectItem value="slide-up">Slide Up</SelectItem>
                            <SelectItem value="slide-left">Slide Left</SelectItem>
                            <SelectItem value="zoom-in">Zoom In</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="preview" className="mt-0">
                <div className="space-y-6">
                  <div>
                    <Label className="text-base font-medium">Live Preview</Label>
                    <p className="text-sm text-slate-500 mt-1">
                      See how your card will look to learners
                    </p>
                  </div>

                  <div className="border rounded-lg p-8 bg-slate-50">
                    <div 
                      className="max-w-2xl mx-auto"
                      style={getPreviewStyle()}
                    >
                      {editingCard.title && (
                        <h3 className="text-2xl font-bold mb-4">
                          {editingCard.title}
                        </h3>
                      )}
                      
                      {editingCard.media_url && (
                        <div className="mb-4">
                          {editingCard.type === 'image' && (
                            <img 
                              src={editingCard.media_url} 
                              alt={editingCard.title || 'Card image'} 
                              className="w-full h-auto rounded"
                            />
                          )}
                          {editingCard.type === 'video' && (
                            <video 
                              src={editingCard.media_url} 
                              controls 
                              className="w-full h-auto rounded"
                            />
                          )}
                          {editingCard.type === 'audio' && (
                            <audio 
                              src={editingCard.media_url} 
                              controls 
                              className="w-full"
                            />
                          )}
                        </div>
                      )}
                      
                      {editingCard.content && (
                        <div className="whitespace-pre-wrap">
                          {editingCard.content}
                        </div>
                      )}
                      
                      {!editingCard.title && !editingCard.content && !editingCard.media_url && (
                        <div className="text-center py-12 text-slate-400">
                          <FileText className="w-12 h-12 mx-auto mb-4" />
                          <p>Add content to see preview</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Style Information */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Code className="w-5 h-5 mr-2" />
                        Style Information
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <strong>Font:</strong> {editingCard.styling.font_family || 'Inter'}
                        </div>
                        <div>
                          <strong>Size:</strong> {editingCard.styling.font_size}
                        </div>
                        <div>
                          <strong>Alignment:</strong> {editingCard.styling.text_align}
                        </div>
                        <div>
                          <strong>Padding:</strong> {editingCard.styling.padding}
                        </div>
                        <div>
                          <strong>Background:</strong> {editingCard.styling.background_color}
                        </div>
                        <div>
                          <strong>Text Color:</strong> {editingCard.styling.text_color}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </div>
    </div>
  );
}