export interface AIMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface AIConversation {
  id: string;
  userId: string;
  title: string;
  messages: AIMessage[];
  createdAt: Date;
  updatedAt: Date;
}

export interface TaskSuggestion {
  id: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  estimatedTime: string;
  category: string;
  reasoning: string;
}

class AIService {
  private conversations: AIConversation[] = [];
  private apiKey: string | null = null;

  // Initialize with API key (in production, this would be from environment variables)
  initialize(apiKey?: string) {
    this.apiKey = apiKey || null;
  }

  // Mock ChatGPT API call (replace with actual OpenAI API in production)
  async sendMessage(message: string, conversationId?: string, context?: any): Promise<string> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));

    // Mock responses based on message content
    const lowerMessage = message.toLowerCase();

    if (lowerMessage.includes('suggest') || lowerMessage.includes('task') || lowerMessage.includes('help')) {
      return this.generateTaskSuggestionResponse(context);
    }

    if (lowerMessage.includes('productivity') || lowerMessage.includes('organize')) {
      return this.generateProductivityAdvice(context);
    }

    if (lowerMessage.includes('priority') || lowerMessage.includes('prioritize')) {
      return this.generatePriorityAdvice(context);
    }

    if (lowerMessage.includes('time') || lowerMessage.includes('schedule')) {
      return this.generateTimeManagementAdvice(context);
    }

    if (lowerMessage.includes('motivation') || lowerMessage.includes('stuck')) {
      return this.generateMotivationAdvice();
    }

    // Default helpful response
    return this.generateDefaultResponse(message, context);
  }

  private generateTaskSuggestionResponse(context?: any): string {
    const suggestions = [
      "Based on your current tasks, I suggest breaking down larger projects into smaller, manageable subtasks. This makes them less overwhelming and easier to complete.",
      "I notice you have several high-priority tasks. Consider using the Eisenhower Matrix to categorize them by urgency and importance.",
      "Here are some task suggestions for better productivity:\n\n• Set up a morning routine task\n• Schedule weekly planning sessions\n• Create a 'quick wins' list for 15-minute tasks\n• Add buffer time between meetings",
      "To improve your task management, try the 2-minute rule: if a task takes less than 2 minutes, do it immediately rather than adding it to your list.",
    ];

    return suggestions[Math.floor(Math.random() * suggestions.length)];
  }

  private generateProductivityAdvice(context?: any): string {
    const advice = [
      "Here are some proven productivity techniques:\n\n🍅 **Pomodoro Technique**: Work for 25 minutes, then take a 5-minute break\n📝 **Time Blocking**: Assign specific time slots to different types of tasks\n🎯 **Single-tasking**: Focus on one task at a time for better quality results\n📊 **Weekly Reviews**: Reflect on what worked and what didn't",
      "To boost your productivity:\n\n1. Start with your most important task (MIT) each day\n2. Eliminate distractions during focused work time\n3. Use the 'two-minute rule' for quick tasks\n4. Batch similar tasks together\n5. Set clear boundaries for work and personal time",
      "Consider implementing these productivity habits:\n\n• Morning planning ritual (10 minutes)\n• End-of-day review (5 minutes)\n• Weekly goal setting\n• Regular breaks to prevent burnout\n• Celebrating small wins",
    ];

    return advice[Math.floor(Math.random() * advice.length)];
  }

  private generatePriorityAdvice(context?: any): string {
    const advice = [
      "Here's how to prioritize effectively:\n\n🔴 **Urgent & Important**: Do first\n🟡 **Important, Not Urgent**: Schedule\n🟠 **Urgent, Not Important**: Delegate\n⚪ **Neither**: Eliminate\n\nThis is called the Eisenhower Matrix and it's very effective!",
      "When prioritizing tasks, ask yourself:\n\n• What are the consequences of not doing this?\n• Does this align with my main goals?\n• Can this be delegated or automated?\n• What's the effort vs. impact ratio?",
      "Try the ABCDE method:\n\nA = Must do (serious consequences)\nB = Should do (mild consequences)\nC = Nice to do (no consequences)\nD = Delegate\nE = Eliminate",
    ];

    return advice[Math.floor(Math.random() * advice.length)];
  }

  private generateTimeManagementAdvice(context?: any): string {
    const advice = [
      "Time management tips:\n\n⏰ **Time Audit**: Track how you spend time for a week\n📅 **Calendar Blocking**: Schedule tasks like appointments\n🚫 **Say No**: Protect your time from non-essential requests\n⚡ **Energy Management**: Do important work when you're most alert",
      "Effective time management strategies:\n\n1. Plan your day the night before\n2. Use time estimates for tasks (and add 25% buffer)\n3. Group similar tasks together\n4. Minimize context switching\n5. Set specific times for checking emails/messages",
      "Consider these time-saving techniques:\n\n• Prepare everything the night before\n• Use templates for recurring tasks\n• Automate repetitive processes\n• Set time limits for decisions\n• Learn to delegate effectively",
    ];

    return advice[Math.floor(Math.random() * advice.length)];
  }

  private generateMotivationAdvice(): string {
    const advice = [
      "Feeling stuck? Here's how to regain momentum:\n\n🎯 **Start Small**: Choose the tiniest possible step\n🏆 **Celebrate Wins**: Acknowledge every completed task\n👥 **Find Accountability**: Share your goals with someone\n🔄 **Change Environment**: Sometimes a new space helps",
      "When motivation is low:\n\n• Remember your 'why' - the bigger purpose\n• Break tasks into micro-steps\n• Use the 5-minute rule (commit to just 5 minutes)\n• Reward yourself for progress\n• Connect with others who inspire you",
      "Motivation boosters:\n\n✨ Visualize the end result\n📈 Track your progress visually\n🎵 Create an energizing playlist\n🌅 Start with your easiest task\n💪 Remember past successes",
    ];

    return advice[Math.floor(Math.random() * advice.length)];
  }

  private generateDefaultResponse(message: string, context?: any): string {
    const responses = [
      "I'm here to help you be more productive! I can assist with task management, prioritization, time management, and motivation. What specific challenge are you facing?",
      "Great question! As your AI productivity assistant, I can help you organize tasks, suggest improvements to your workflow, and provide personalized advice. What would you like to work on?",
      "I'd be happy to help! I specialize in productivity, task management, and helping you achieve your goals more efficiently. Could you tell me more about what you're trying to accomplish?",
      "Thanks for reaching out! I can provide insights on productivity techniques, help prioritize your tasks, suggest time management strategies, and offer motivation when you need it. How can I assist you today?",
    ];

    return responses[Math.floor(Math.random() * responses.length)];
  }

  // Generate task suggestions based on user's current tasks
  async generateTaskSuggestions(tasks: any[], userGoals?: string[]): Promise<TaskSuggestion[]> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    const suggestions: TaskSuggestion[] = [
      {
        id: 'suggestion-1',
        title: 'Weekly Planning Session',
        description: 'Set aside 30 minutes every Sunday to plan your upcoming week and review progress',
        priority: 'medium',
        estimatedTime: '30 minutes',
        category: 'Planning',
        reasoning: 'Regular planning helps maintain focus and reduces decision fatigue during the week'
      },
      {
        id: 'suggestion-2',
        title: 'Daily Standup with Yourself',
        description: 'Start each day with a 5-minute review of priorities and goals',
        priority: 'low',
        estimatedTime: '5 minutes',
        category: 'Routine',
        reasoning: 'Daily check-ins help maintain alignment with your goals and catch issues early'
      },
      {
        id: 'suggestion-3',
        title: 'Break Down Large Projects',
        description: 'Identify any large tasks and break them into smaller, actionable steps',
        priority: 'high',
        estimatedTime: '20 minutes',
        category: 'Organization',
        reasoning: 'Smaller tasks are less overwhelming and provide more frequent wins'
      },
      {
        id: 'suggestion-4',
        title: 'Set Up Automated Reminders',
        description: 'Configure email or phone reminders for important recurring tasks',
        priority: 'medium',
        estimatedTime: '15 minutes',
        category: 'Automation',
        reasoning: 'Automation reduces mental load and ensures nothing falls through the cracks'
      },
      {
        id: 'suggestion-5',
        title: 'Create a "Someday/Maybe" List',
        description: 'Capture ideas and non-urgent tasks in a separate list to clear mental space',
        priority: 'low',
        estimatedTime: '10 minutes',
        category: 'Organization',
        reasoning: 'Separating ideas from actionable tasks helps maintain focus on current priorities'
      }
    ];

    // Return 2-3 random suggestions
    const shuffled = suggestions.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 2 + Math.floor(Math.random() * 2));
  }

  // Create a new conversation
  createConversation(userId: string, title?: string): AIConversation {
    const conversation: AIConversation = {
      id: `conv-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      userId,
      title: title || 'New Conversation',
      messages: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.conversations.push(conversation);
    return conversation;
  }

  // Add message to conversation
  addMessage(conversationId: string, role: 'user' | 'assistant', content: string): AIMessage {
    const conversation = this.conversations.find(c => c.id === conversationId);
    if (!conversation) {
      throw new Error('Conversation not found');
    }

    const message: AIMessage = {
      id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      role,
      content,
      timestamp: new Date()
    };

    conversation.messages.push(message);
    conversation.updatedAt = new Date();

    // Auto-generate title from first user message
    if (conversation.messages.length === 1 && role === 'user') {
      conversation.title = content.length > 50 ? content.substring(0, 50) + '...' : content;
    }

    return message;
  }

  // Get user conversations
  getUserConversations(userId: string): AIConversation[] {
    return this.conversations
      .filter(c => c.userId === userId)
      .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());
  }

  // Get specific conversation
  getConversation(conversationId: string): AIConversation | null {
    return this.conversations.find(c => c.id === conversationId) || null;
  }

  // Delete conversation
  deleteConversation(conversationId: string): boolean {
    const index = this.conversations.findIndex(c => c.id === conversationId);
    if (index >= 0) {
      this.conversations.splice(index, 1);
      return true;
    }
    return false;
  }

  // Clear all conversations for a user
  clearUserConversations(userId: string): void {
    this.conversations = this.conversations.filter(c => c.userId !== userId);
  }
}

export const aiService = new AIService();