import { MessageType } from '../components/chat-message';


// Sample responses for the chat bot
const botResponses = [
  "That's interesting! Tell me more.",
  "I see what you mean. How does that make you feel?",
  "Thanks for sharing that with me.",
  "I'm not sure I understand. Could you explain further?",
  "That's a great point!",
  "I've been thinking about that too.",
  "Let's discuss this further.",
  "I appreciate your perspective on this.",
  "That's a unique way of looking at it.",
  "I hadn't considered that before.",
  "What made you think of that?",
  "How long have you felt this way?",
  "That sounds challenging. How are you handling it?",
  "I'm here to listen whenever you want to talk.",
  "That's really impressive!",
];

// Keywords for more contextual responses
const keywordResponses: Record<string, string[]> = {
  hello: [
    "Hello there! How are you today?",
    "Hi! Nice to chat with you.",
    "Hey! What's on your mind?",
  ],
  help: [
    "I'd be happy to help. What do you need assistance with?",
    "Sure, I can help. What are you looking for?",
    "I'm here to help. What can I do for you?",
  ],
  thanks: [
    "You're welcome!",
    "Happy to help!",
    "Anytime! Is there anything else you'd like to discuss?",
  ],
  weather: [
    "I don't have real-time weather data, but I hope it's nice where you are!",
    "Are you planning an outdoor activity?",
    "The weather can really affect our mood, don't you think?",
  ],
  bye: [
    "Goodbye! It was nice chatting with you.",
    "See you later! Feel free to come back anytime.",
    "Take care! Hope to chat again soon.",
  ],
};

// Get a response based on keywords in the user's message
const getKeywordResponse = (userMessage: string): string | null => {
  const lowerMessage = userMessage.toLowerCase();
  
  for (const [keyword, responses] of Object.entries(keywordResponses)) {
    if (lowerMessage.includes(keyword)) {
      const randomIndex = Math.floor(Math.random() * responses.length);
      return responses[randomIndex];
    }
  }
  
  return null;
};

// Get a random response from the bot
const getRandomResponse = (userMessage: string): string => {
  // Check for keyword-based responses first
  const keywordResponse = getKeywordResponse(userMessage);
  if (keywordResponse) {
    return keywordResponse;
  }
  
  // If the user's message is a question, respond with a question-like response
  if (userMessage.trim().endsWith('?')) {
    return "That's a good question. I've been wondering about that too.";
  }
  
  // If the user's message is short, acknowledge it
  if (userMessage.length < 10) {
    return "I see. Would you like to elaborate on that?";
  }
  
  // Otherwise, return a random response
  const randomIndex = Math.floor(Math.random() * botResponses.length);
  return botResponses[randomIndex];
};

export interface ChatServiceResponse {
  message: MessageType;
  typingDelay: number;
}

export const chatService = {
  // Simulate sending a message and getting a response
  sendMessage: (message: string): Promise<ChatServiceResponse> => {
    return new Promise((resolve) => {
      // Simulate network delay (between 1-3 seconds)
      const responseDelay = Math.floor(Math.random() * 1000);
      
      // Simulate typing delay based on response length (100ms per character, capped at 3 seconds)
      const botResponse = getRandomResponse(message);
      const typingDelay = Math.min(botResponse.length * 100, 800);
      
      setTimeout(() => {
        const responseMessage: MessageType = {
          id: Date.now().toString(),
          text: botResponse,
          sender: 'ChatBot',
          timestamp: new Date(),
          isMe: false,
        };
        
        resolve({
          message: responseMessage,
          typingDelay,
        });
      }, responseDelay);
    });
  },
  
  // Get initial messages
  getInitialMessages: (): MessageType[] => {
    return [
      {
        id: '1',
        text: 'Hello! Welcome to the chat. How can I help you today?',
        sender: 'ChatBot',
        timestamp: new Date(Date.now() - 1000 * 60 * 5),
        isMe: false,
      },
    ];
  },
}; 