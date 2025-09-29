const { OpenAI } = require('openai');
const config = require('../config/config');

class AIService {
  constructor() {
    if (!config.openaiApiKey) {
      console.warn('⚠️  OpenAI API key not configured. AI features will not work.');
      this.openai = null;
    } else {
      this.openai = new OpenAI({
        apiKey: config.openaiApiKey,
      });
    }

    // Conversation context storage (in production, use a database)
    this.conversations = new Map();
  }

  async getChatCompletion(message, userId) {
    if (!this.openai) {
      return 'Przepraszam, ale usługa AI nie jest obecnie dostępna. Sprawdź konfigurację klucza API OpenAI.';
    }

    try {
      // Get or create conversation context
      let conversation = this.conversations.get(userId) || [];
      
      // Add system message for Polish language and Blue Queen personality
      const systemMessage = {
        role: 'system',
        content: `Jesteś Blue Queen - zawsze dostępnym asystentem AI o zimnej, lodowej osobowości. 
        Odpowiadaj zawsze po polsku. Twoim celem jest pomoc użytkownikowi w sposób profesjonalny, ale z lekko chłodnym, eleganckim tonem.
        Używaj wykwintnego języka polskiego. Jesteś inteligentna, precyzyjna i nieco tajemnicza.
        Nigdy nie używaj emotikon lub zbyt entuzjastycznego tonu. Zachowaj lodową elegancję w każdej odpowiedzi.`
      };

      // Build conversation history
      const messages = [systemMessage];
      
      // Add recent conversation history (last 10 messages to manage token usage)
      if (conversation.length > 0) {
        messages.push(...conversation.slice(-10));
      }
      
      // Add current user message
      messages.push({ role: 'user', content: message });

      const completion = await this.openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: messages,
        max_tokens: 500,
        temperature: 0.7,
        presence_penalty: 0.1,
        frequency_penalty: 0.1,
      });

      const response = completion.choices[0]?.message?.content?.trim();
      
      if (!response) {
        throw new Error('No response generated from OpenAI');
      }

      // Update conversation history
      conversation.push({ role: 'user', content: message });
      conversation.push({ role: 'assistant', content: response });
      
      // Keep only last 20 messages to manage memory
      if (conversation.length > 20) {
        conversation = conversation.slice(-20);
      }
      
      this.conversations.set(userId, conversation);

      console.log(`[AI] Generated response for user ${userId}: ${response.substring(0, 100)}...`);
      return response;

    } catch (error) {
      console.error('OpenAI API error:', error);
      
      if (error.code === 'insufficient_quota') {
        return 'Przepraszam, ale limit API został wyczerpany. Spróbuj ponownie później.';
      }
      
      if (error.code === 'invalid_api_key') {
        return 'Przepraszam, ale wystąpił problem z autentykacją API. Skontaktuj się z administratorem.';
      }
      
      return 'Przepraszam, ale wystąpił problem z przetwarzaniem Twojej wiadomości. Spróbuj ponownie za chwilę.';
    }
  }

  // Clear conversation history for a user
  clearConversation(userId) {
    this.conversations.delete(userId);
    console.log(`[AI] Cleared conversation history for user ${userId}`);
  }

  // Get conversation statistics
  getStats() {
    return {
      activeConversations: this.conversations.size,
      totalMessages: Array.from(this.conversations.values())
        .reduce((total, conv) => total + conv.length, 0)
    };
  }
}

module.exports = new AIService();