// ============================================
// Chatbot Controller
// Uses Groq chat completions to answer user questions.
// ============================================

const axios = require('axios');

const CHAT_HISTORY_LIMIT = 10;
const MAX_MESSAGE_LENGTH = 4000;

const getProviderConfig = () => {
  const apiKey = process.env.GROQ_API_KEY || process.env.OPENAI_API_KEY;
  const baseURL =
    process.env.GROQ_BASE_URL ||
    process.env.OPENAI_BASE_URL ||
    'https://api.groq.com/openai/v1';
  const model =
    process.env.CHATBOT_MODEL ||
    process.env.GROQ_MODEL ||
    process.env.OPENAI_MODEL ||
    'llama-3.3-70b-versatile';

  return { apiKey, baseURL, model };
};

const buildSystemPrompt = () => {
  return [
    'You are CropAdvisor, a simple and helpful AI chatbot inside a farming web app.',
    'Answer any user question clearly and concisely.',
    'When the topic is agriculture, give practical guidance about crops, soil, irrigation, pests, fertilizer, and weather planning.',
    'Use the provided user context when it is relevant, but do not invent missing facts.',
    'If a question is unrelated to farming, still answer helpfully as a general assistant.',
    'Use short paragraphs or bullets when it improves readability.',
    'If you are unsure, say so clearly instead of guessing.'
  ].join('\n');
};

const sanitizeMessage = (message) => {
  if (typeof message !== 'string') {
    return '';
  }

  return message.trim().slice(0, MAX_MESSAGE_LENGTH);
};

const sanitizeHistory = (history) => {
  if (!Array.isArray(history)) {
    return [];
  }

  return history
    .filter((item) => item && ['user', 'assistant'].includes(item.role))
    .map((item) => ({
      role: item.role,
      content: sanitizeMessage(item.content)
    }))
    .filter((item) => item.content)
    .slice(-CHAT_HISTORY_LIMIT);
};

const buildConversation = ({ history, userMessage, context }) => {
  return [
    {
      role: 'system',
      content: buildSystemPrompt()
    },
    {
      role: 'system',
      content: `App user context: ${JSON.stringify(context)}`
    },
    ...history,
    {
      role: 'user',
      content: userMessage
    }
  ];
};

const chatbot = async (req, res, next) => {
  try {
    const userMessage = sanitizeMessage(req.body?.message);

    if (!userMessage) {
      return res.status(400).json({
        success: false,
        message: 'message is required'
      });
    }

    const { apiKey, baseURL, model } = getProviderConfig();

    if (!apiKey) {
      return res.status(500).json({
        success: false,
        message: 'Missing Groq API key. Set GROQ_API_KEY in the server environment.'
      });
    }

    const context = {
      user: {
        isAuthenticated: Boolean(req.user),
        id: req.user?._id?.toString?.() || String(req.user?._id || ''),
        name: req.user?.name || '',
        email: req.user?.email || '',
        location: req.user?.location || ''
      }
    };

    const history = sanitizeHistory(req.body?.history);
    const messages = buildConversation({ history, userMessage, context });

    const response = await axios.post(
      `${baseURL}/chat/completions`,
      {
        model,
        messages,
        temperature: 0.3,
        max_tokens: 700
      },
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        },
        timeout: 20000
      }
    );

    const assistantText =
      response.data?.choices?.[0]?.message?.content?.trim() ||
      'Sorry, I could not generate a response right now.';

    return res.json({
      success: true,
      data: {
        message: assistantText,
        source: 'groq',
        model
      }
    });
  } catch (error) {
    console.error('Groq chatbot error:', {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message
    });

    if (error.response) {
      return res.status(502).json({
        success: false,
        message:
          error.response?.data?.error?.message ||
          'Groq request failed. Check GROQ_API_KEY, model, and network access.'
      });
    }

    if (error.code === 'ECONNABORTED' || error.code === 'ENOTFOUND') {
      return res.status(502).json({
        success: false,
        message: 'Groq request timed out or could not reach the API.'
      });
    }

    next(error);
  }
};

module.exports = { chatbot };
