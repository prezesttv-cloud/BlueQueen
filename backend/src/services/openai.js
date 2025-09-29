const OpenAI = require('openai');
const logger = require('../utils/logger');

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

class OpenAIService {
    constructor() {
        this.systemMessage = {
            role: 'system',
            content: `Jesteś Blue Queen, inteligentną asystentką AI. Rozmawiasz po polsku i jesteś pomocna, przyjazna i profesjonalna. 
            Odpowiadaj w sposób naturalny i ciepły. Twoja osobowość jest inspirowana lodową królową - elegancka, mądra, ale też przystępna.
            Zawsze odpowiadaj po polsku, chyba że użytkownik poprosi o inną. Jeśli nie znasz odpowiedzi, uczciwie to przyznaj.`
        };
    }

    async generateResponse(messages, userId) {
        try {
            logger.info(`Generating response for user ${userId}`);

            // Prepare messages with system message
            const messagesWithSystem = [
                this.systemMessage,
                ...messages
            ];

            const completion = await openai.chat.completions.create({
                model: 'gpt-3.5-turbo',
                messages: messagesWithSystem,
                max_tokens: 1000,
                temperature: 0.7,
                frequency_penalty: 0.1,
                presence_penalty: 0.1,
            });

            const response = completion.choices[0].message.content;
            
            logger.info(`Response generated for user ${userId}, tokens used: ${completion.usage.total_tokens}`);
            
            return {
                success: true,
                response,
                usage: completion.usage
            };
        } catch (error) {
            logger.error('OpenAI API error:', error);
            
            if (error.code === 'invalid_api_key') {
                return {
                    success: false,
                    error: 'Nieprawidłowy klucz API OpenAI',
                    response: 'Przepraszam, ale wystąpił problem z konfiguracją. Skontaktuj się z administratorem.'
                };
            } else if (error.code === 'rate_limit_exceeded') {
                return {
                    success: false,
                    error: 'Przekroczono limit zapytań',
                    response: 'Przepraszam, ale obecnie jestem przeciążona. Spróbuj ponownie za chwilę.'
                };
            } else if (error.code === 'context_length_exceeded') {
                return {
                    success: false,
                    error: 'Rozmowa jest zbyt długa',
                    response: 'Nasze rozmowa stała się zbyt długa. Zacznijmy od nowa!'
                };
            }
            
            return {
                success: false,
                error: 'Błąd komunikacji z AI',
                response: 'Przepraszam, ale wystąpił problem techniczny. Spróbuj ponownie.'
            };
        }
    }

    async moderateContent(text) {
        try {
            const moderation = await openai.moderations.create({
                input: text,
            });

            const result = moderation.results[0];
            
            return {
                flagged: result.flagged,
                categories: result.categories,
                category_scores: result.category_scores
            };
        } catch (error) {
            logger.error('Content moderation error:', error);
            // If moderation fails, allow the content through but log it
            return {
                flagged: false,
                categories: {},
                category_scores: {}
            };
        }
    }
}

module.exports = new OpenAIService();