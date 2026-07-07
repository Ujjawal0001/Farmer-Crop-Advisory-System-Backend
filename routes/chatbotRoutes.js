// ============================================
// Chatbot Routes
// ============================================
const express = require('express');
const router = express.Router();

const { chatbot } = require('../controllers/chatbotController');
const { attachUserIfPresent } = require('../middleware/auth');

// POST /api/chatbot - Public Groq assistant with optional user context
router.post('/', attachUserIfPresent, chatbot);

module.exports = router;

