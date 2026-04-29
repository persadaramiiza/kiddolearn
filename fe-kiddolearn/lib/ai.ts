import api from './api';

export interface ChatMessage {
  role: 'user' | 'model';
  content: string;
}

export interface AiResponse {
  response: string;
  available: boolean;
}

export interface AiStatus {
  available: boolean;
  message: string;
}

export const aiService = {
  /**
   * Check AI service status
   */
  async getStatus(): Promise<AiStatus> {
    const response = await api.get('/ai/status');
    return response.data;
  },

  /**
   * Chat with EduBot
   */
  async chat(message: string, history: ChatMessage[] = []): Promise<AiResponse> {
    console.log('🤖 Sending chat to AI:', message.substring(0, 50));
    const response = await api.post('/ai/chat', { message, history });
    return response.data;
  },

  /**
   * Get explanation for quiz answer
   */
  async explainQuiz(
    question: string,
    options: string[],
    correctAnswer?: string,
    userAnswer?: string
  ): Promise<AiResponse> {
    console.log('📚 Requesting quiz explanation');
    const response = await api.post('/ai/explain-quiz', {
      question,
      options,
      correctAnswer,
      userAnswer,
    });
    return response.data;
  },

  /**
   * Explain a topic for children
   */
  async explain(topic: string, audience: string = 'anak-anak'): Promise<AiResponse> {
    console.log('🧠 Requesting topic explanation for', audience);
    const message = `Jelaskan tentang "${topic}" dengan bahasa yang mudah dipahami untuk ${audience}. Berikan penjelasan singkat dan menarik.`;
    const response = await api.post('/ai/chat', { message, history: [] });
    return {
      response: response.data.response,
      available: response.data.available,
      explanation: response.data.response, // Add explanation property for compatibility
    } as AiResponse & { explanation: string };
  },

  /**
   * Get AI hint for quiz
   */
  async getQuizHint(question: string, options: string[]): Promise<AiResponse> {
    console.log('💡 Requesting AI hint');
    const response = await api.post('/ai/quiz-hint', { question, options });
    return response.data;
  },

  /**
   * Get video topic summary
   */
  async summarizeVideo(title: string, description?: string): Promise<AiResponse> {
    console.log('📝 Requesting video summary');
    const response = await api.post('/ai/summarize', { title, description });
    return response.data;
  },

  /**
   * Generate quiz with AI
   */
  async generateQuiz(topic: string, numOptions: number = 4): Promise<{
    quiz: {
      question: string;
      options: { text: string; isCorrect: boolean }[];
      explanation: string;
    };
    available: boolean;
  }> {
    console.log('🎯 Generating quiz with AI for topic:', topic);
    const response = await api.post('/ai/generate-quiz', { topic, numOptions });
    return response.data;
  },
};
