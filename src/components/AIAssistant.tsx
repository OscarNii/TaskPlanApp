import React, { useState, useEffect, useRef } from 'react';
import { 
  MessageCircle, 
  Send, 
  X, 
  Bot, 
  User, 
  Lightbulb, 
  Trash2, 
  Plus,
  Loader,
  Sparkles,
  Brain,
  Target,
  Clock,
  TrendingUp,
  Minimize2,
  Maximize2
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useTask } from '../contexts/TaskContext';
import { aiService, AIConversation, AIMessage, TaskSuggestion } from '../services/aiService';

interface AIAssistantProps {
  onClose: () => void;
}

const AIAssistant: React.FC<AIAssistantProps> = ({ onClose }) => {
  const { user } = useAuth();
  const { tasks, addTask } = useTask();
  const [conversations, setConversations] = useState<AIConversation[]>([]);
  const [activeConversation, setActiveConversation] = useState<AIConversation | null>(null);
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [taskSuggestions, setTaskSuggestions] = useState<TaskSuggestion[]>([]);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (user) {
      loadConversations();
    }
  }, [user]);

  useEffect(() => {
    scrollToBottom();
  }, [activeConversation?.messages]);

  const loadConversations = () => {
    if (!user) return;
    const userConversations = aiService.getUserConversations(user.id);
    setConversations(userConversations);
    
    if (userConversations.length === 0) {
      createNewConversation();
    } else {
      setActiveConversation(userConversations[0]);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const createNewConversation = () => {
    if (!user) return;
    
    const newConversation = aiService.createConversation(user.id);
    setConversations(prev => [newConversation, ...prev]);
    setActiveConversation(newConversation);
    
    // Add welcome message
    aiService.addMessage(newConversation.id, 'assistant', 
      "👋 Hi! I'm your AI productivity assistant. I can help you with:\n\n• Task management and organization\n• Productivity tips and techniques\n• Prioritization strategies\n• Time management advice\n• Motivation and goal setting\n\nWhat would you like to work on today?"
    );
    
    setConversations(aiService.getUserConversations(user.id));
  };

  const sendMessage = async () => {
    if (!message.trim() || !activeConversation || !user || isLoading) return;

    const userMessage = message.trim();
    setMessage('');
    setIsLoading(true);

    try {
      // Add user message
      aiService.addMessage(activeConversation.id, 'user', userMessage);
      setConversations(aiService.getUserConversations(user.id));

      // Get AI response
      const context = {
        tasks: tasks,
        totalTasks: tasks.length,
        completedTasks: tasks.filter(t => t.completed).length,
        pendingTasks: tasks.filter(t => !t.completed).length,
        overdueTasks: tasks.filter(t => !t.completed && t.dueDate && new Date(t.dueDate) < new Date()).length
      };

      const response = await aiService.sendMessage(userMessage, activeConversation.id, context);
      
      // Add AI response
      aiService.addMessage(activeConversation.id, 'assistant', response);
      setConversations(aiService.getUserConversations(user.id));
      
    } catch (error) {
      console.error('Error sending message:', error);
      aiService.addMessage(activeConversation.id, 'assistant', 
        "I apologize, but I'm having trouble responding right now. Please try again in a moment."
      );
      setConversations(aiService.getUserConversations(user.id));
    } finally {
      setIsLoading(false);
    }
  };

  const generateTaskSuggestions = async () => {
    if (!user) return;
    
    setLoadingSuggestions(true);
    try {
      const suggestions = await aiService.generateTaskSuggestions(tasks);
      setTaskSuggestions(suggestions);
      setShowSuggestions(true);
    } catch (error) {
      console.error('Error generating suggestions:', error);
    } finally {
      setLoadingSuggestions(false);
    }
  };

  const addSuggestedTask = async (suggestion: TaskSuggestion) => {
    try {
      await addTask({
        title: suggestion.title,
        description: suggestion.description,
        priority: suggestion.priority,
        projectId: 'project-1', // Default to first project
        tags: ['ai-suggested'],
        subtasks: [],
        completed: false,
        status: 'todo'
      });
      
      // Remove the suggestion from the list
      setTaskSuggestions(prev => prev.filter(s => s.id !== suggestion.id));
      
      // Add confirmation message to chat
      if (activeConversation) {
        aiService.addMessage(activeConversation.id, 'assistant', 
          `✅ Great! I've added "${suggestion.title}" to your task list. ${suggestion.reasoning}`
        );
        setConversations(aiService.getUserConversations(user.id));
      }
    } catch (error) {
      console.error('Error adding suggested task:', error);
    }
  };

  const deleteConversation = (conversationId: string) => {
    aiService.deleteConversation(conversationId);
    const updatedConversations = aiService.getUserConversations(user!.id);
    setConversations(updatedConversations);
    
    if (activeConversation?.id === conversationId) {
      if (updatedConversations.length > 0) {
        setActiveConversation(updatedConversations[0]);
      } else {
        createNewConversation();
      }
    }
  };

  const formatMessage = (content: string) => {
    // Simple markdown-like formatting
    return content
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/\n/g, '<br>')
      .replace(/•/g, '&bull;');
  };

  const quickPrompts = [
    { icon: Target, text: "Help me prioritize my tasks", prompt: "I have several tasks and need help prioritizing them. Can you suggest a method?" },
    { icon: Clock, text: "Time management tips", prompt: "I'm struggling with time management. What are some effective techniques I can use?" },
    { icon: TrendingUp, text: "Boost my productivity", prompt: "I want to be more productive. What are some proven strategies you recommend?" },
    { icon: Brain, text: "Break down a complex task", prompt: "I have a large, complex task that feels overwhelming. How should I break it down?" }
  ];

  // Minimized view
  if (isMinimized) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <div className="bg-gradient-to-r from-purple-500/90 to-blue-600/90 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 p-4 min-w-[280px]">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-white text-sm">AI Assistant</h3>
                <p className="text-white/70 text-xs">
                  {activeConversation ? `${activeConversation.messages.length} messages` : 'Ready to help'}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-1">
              <button
                onClick={() => setIsMinimized(false)}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors text-white/80 hover:text-white"
                title="Maximize"
              >
                <Maximize2 size={16} />
              </button>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors text-white/80 hover:text-white"
                title="Close"
              >
                <X size={16} />
              </button>
            </div>
          </div>
          
          {/* Quick message input when minimized */}
          <div className="mt-3 flex space-x-2">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
              placeholder="Quick message..."
              className="flex-1 px-3 py-2 bg-white/20 border border-white/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/50 text-white placeholder-white/60 text-sm"
              disabled={isLoading}
            />
            <button
              onClick={sendMessage}
              disabled={!message.trim() || isLoading}
              className="px-3 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send size={14} />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white/10 dark:bg-black/20 backdrop-blur-2xl rounded-2xl shadow-2xl w-full max-w-6xl h-[90vh] border border-white/20 flex overflow-hidden">
        
        {/* Sidebar - Conversations */}
        <div className="w-80 border-r border-white/20 flex flex-col">
          {/* Header */}
          <div className="p-6 border-b border-white/20">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-600 rounded-xl flex items-center justify-center">
                  <Bot className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white">AI Assistant</h2>
                  <p className="text-xs text-white/60">Powered by ChatGPT</p>
                </div>
              </div>
              
              {/* Window Controls */}
              <div className="flex items-center space-x-1">
                <button
                  onClick={() => setIsMinimized(true)}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors text-white/80 hover:text-white group"
                  title="Minimize"
                >
                  <Minimize2 size={16} />
                  <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-black/80 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                    Minimize
                  </div>
                </button>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-red-500/20 hover:border-red-400/30 rounded-lg transition-colors text-white/80 hover:text-red-300 group border border-transparent"
                  title="Close"
                >
                  <X size={16} />
                  <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-black/80 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                    Close
                  </div>
                </button>
              </div>
            </div>
            
            <button
              onClick={createNewConversation}
              className="w-full flex items-center space-x-2 px-4 py-3 bg-gradient-to-r from-purple-500/80 to-blue-600/80 hover:from-purple-500 hover:to-blue-600 text-white rounded-xl transition-colors"
            >
              <Plus size={16} />
              <span>New Conversation</span>
            </button>
          </div>

          {/* Conversations List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            {conversations.map((conversation) => (
              <button
                key={conversation.id}
                onClick={() => setActiveConversation(conversation)}
                className={`w-full text-left p-3 rounded-lg transition-colors group ${
                  activeConversation?.id === conversation.id
                    ? 'bg-white/20 text-white'
                    : 'hover:bg-white/10 text-white/80'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium truncate text-sm">{conversation.title}</h4>
                    <p className="text-xs text-white/60 mt-1">
                      {conversation.messages.length} messages
                    </p>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteConversation(conversation.id);
                    }}
                    className="opacity-0 group-hover:opacity-100 p-1 hover:bg-white/10 rounded transition-all"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              </button>
            ))}
          </div>

          {/* Quick Actions */}
          <div className="p-4 border-t border-white/20">
            <button
              onClick={generateTaskSuggestions}
              disabled={loadingSuggestions}
              className="w-full flex items-center space-x-2 px-4 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-colors disabled:opacity-50"
            >
              {loadingSuggestions ? (
                <Loader className="w-4 h-4 animate-spin" />
              ) : (
                <Lightbulb className="w-4 h-4" />
              )}
              <span className="text-sm">Get Task Suggestions</span>
            </button>
          </div>
        </div>

        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col">
          {activeConversation ? (
            <>
              {/* Chat Header */}
              <div className="p-6 border-b border-white/20">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-600 rounded-lg flex items-center justify-center">
                      <Sparkles className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white">{activeConversation.title}</h3>
                      <p className="text-sm text-white/60">AI Productivity Assistant</p>
                    </div>
                  </div>
                  
                  {/* Chat Status */}
                  <div className="flex items-center space-x-2">
                    <div className="flex items-center space-x-2 px-3 py-1 bg-green-500/20 rounded-full border border-green-400/30">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                      <span className="text-xs text-green-300 font-medium">Online</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {activeConversation.messages.length === 0 && (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-gradient-to-br from-purple-500/20 to-blue-600/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <Bot className="w-8 h-8 text-purple-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-2">Start a conversation</h3>
                    <p className="text-white/60 mb-6">Ask me anything about productivity, task management, or organization!</p>
                    
                    {/* Quick Prompts */}
                    <div className="grid grid-cols-2 gap-3 max-w-2xl mx-auto">
                      {quickPrompts.map((prompt, index) => (
                        <button
                          key={index}
                          onClick={() => setMessage(prompt.prompt)}
                          className="flex items-center space-x-3 p-4 bg-white/5 hover:bg-white/10 rounded-xl transition-colors text-left border border-white/10"
                        >
                          <prompt.icon className="w-5 h-5 text-purple-400 flex-shrink-0" />
                          <span className="text-sm text-white/80">{prompt.text}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {activeConversation.messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex items-start space-x-3 ${
                      msg.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                      msg.role === 'user' 
                        ? 'bg-blue-500' 
                        : 'bg-gradient-to-br from-purple-500 to-blue-600'
                    }`}>
                      {msg.role === 'user' ? (
                        <User className="w-4 h-4 text-white" />
                      ) : (
                        <Bot className="w-4 h-4 text-white" />
                      )}
                    </div>
                    <div className={`flex-1 ${msg.role === 'user' ? 'text-right' : ''}`}>
                      <div className={`inline-block max-w-[80%] p-4 rounded-2xl ${
                        msg.role === 'user'
                          ? 'bg-blue-500/20 text-white border border-blue-400/30'
                          : 'bg-white/10 text-white border border-white/20'
                      }`}>
                        <div 
                          className="text-sm leading-relaxed"
                          dangerouslySetInnerHTML={{ __html: formatMessage(msg.content) }}
                        />
                      </div>
                      <p className="text-xs text-white/50 mt-2">
                        {msg.timestamp.toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                ))}

                {isLoading && (
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-600 rounded-lg flex items-center justify-center">
                      <Bot className="w-4 h-4 text-white" />
                    </div>
                    <div className="bg-white/10 border border-white/20 rounded-2xl p-4">
                      <div className="flex items-center space-x-2">
                        <Loader className="w-4 h-4 animate-spin text-white/60" />
                        <span className="text-sm text-white/60">AI is thinking...</span>
                      </div>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Message Input */}
              <div className="p-6 border-t border-white/20">
                <div className="flex space-x-3">
                  <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                    placeholder="Ask me anything about productivity..."
                    className="flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400/50 text-white placeholder-white/60"
                    disabled={isLoading}
                  />
                  <button
                    onClick={sendMessage}
                    disabled={!message.trim() || isLoading}
                    className="px-6 py-3 bg-gradient-to-r from-purple-500/80 to-blue-600/80 hover:from-purple-500 hover:to-blue-600 text-white rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Send size={16} />
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <Bot className="w-16 h-16 text-white/40 mx-auto mb-4" />
                <p className="text-white/60">Select a conversation to start chatting</p>
              </div>
            </div>
          )}
        </div>

        {/* Task Suggestions Panel */}
        {showSuggestions && (
          <div className="w-80 border-l border-white/20 flex flex-col">
            <div className="p-6 border-b border-white/20">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-white flex items-center">
                  <Lightbulb className="w-5 h-5 mr-2 text-yellow-400" />
                  Task Suggestions
                </h3>
                <button
                  onClick={() => setShowSuggestions(false)}
                  className="p-1 hover:bg-white/10 rounded transition-colors text-white/60 hover:text-white"
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {taskSuggestions.map((suggestion) => (
                <div key={suggestion.id} className="bg-white/5 border border-white/10 rounded-xl p-4">
                  <div className="flex items-start justify-between mb-3">
                    <h4 className="font-medium text-white text-sm">{suggestion.title}</h4>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      suggestion.priority === 'high' ? 'bg-red-500/20 text-red-300 border border-red-400/30' :
                      suggestion.priority === 'medium' ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-400/30' :
                      'bg-green-500/20 text-green-300 border border-green-400/30'
                    }`}>
                      {suggestion.priority}
                    </span>
                  </div>
                  
                  <p className="text-white/70 text-xs mb-3">{suggestion.description}</p>
                  
                  <div className="flex items-center justify-between text-xs text-white/50 mb-3">
                    <span>⏱️ {suggestion.estimatedTime}</span>
                    <span>📁 {suggestion.category}</span>
                  </div>
                  
                  <p className="text-white/60 text-xs mb-4 italic">{suggestion.reasoning}</p>
                  
                  <button
                    onClick={() => addSuggestedTask(suggestion)}
                    className="w-full px-3 py-2 bg-gradient-to-r from-purple-500/80 to-blue-600/80 hover:from-purple-500 hover:to-blue-600 text-white rounded-lg transition-colors text-sm"
                  >
                    Add to Tasks
                  </button>
                </div>
              ))}

              {taskSuggestions.length === 0 && !loadingSuggestions && (
                <div className="text-center py-8">
                  <Lightbulb className="w-12 h-12 text-white/40 mx-auto mb-3" />
                  <p className="text-white/60 text-sm">No suggestions available</p>
                  <p className="text-white/40 text-xs mt-1">Click "Get Task Suggestions" to generate new ideas</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AIAssistant;