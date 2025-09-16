const express = require('express');
const { auth } = require('../middleware/auth');
const { GoogleGenerativeAI } = require("@google/generative-ai");

const router = express.Router();

// Initialize the Google Generative AI client with the API key from environment variables
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/**
 * An asynchronous function to get AI-powered trend data from the Gemini API.
 */
const getAITrends = async () => {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `
      You are a market trend analyst for "KalaGhar," an e-commerce platform for handmade goods.
      Your task is to generate a concise and actionable trend report for our artisans based on current market data.
      The report must be returned as a single, valid, parsable JSON object and nothing else.
      Do not include any text, backticks, or explanations outside of the JSON object itself.

      The JSON object must have the following structure:
      {
        "trendOfMonth": {
          "title": "A short, catchy title for the main trend (e.g., 'Functional Art for the Home Office').",
          "summary": "A 1-2 sentence summary explaining the trend and its relevance to artisans.",
          "keywords": ["An", "array", "of", "4", "relevant", "keywords"]
        },
        "actionableTips": [
          {
            "title": "A short, actionable tip title (e.g., 'Bundle Products for Gifting').",
            "description": "A brief, data-inspired explanation of how an artisan can apply this tip to increase sales or engagement."
          },
          { "title": "A second actionable tip.", "description": "Description for the second tip." },
          { "title": "A third actionable tip.", "description": "Description for the third tip." },
          { "title": "A fourth actionable tip.", "description": "Description for the fourth tip." }
        ],
        "categoryDemand": {
          "labels": ["An array of the top 4 trending product categories based on sales velocity (e.g., 'Pottery', 'Textiles')."],
          "data": [An array of 4 corresponding numbers representing demand percentages, which MUST sum up to 100]
        },
        "trendingMaterials": {
          "labels": ["An array of the 4 most popular craft materials right now (e.g., 'Ceramic', 'Linen', 'Recycled Metal', 'Walnut Wood')."],
          "data": [An array of 4 corresponding numbers representing their popularity in trending items, which MUST sum up to 100]
        }
      }

      Generate fresh, creative, and relevant content for today's handmade market.
    `;

    try {
        const result = await model.generateContent(prompt);
        const response = await result.response;
        let text = response.text();

        if (text.startsWith("```json")) {
            text = text.substring(7, text.length - 3).trim();
        }

        try {
            // Now, parse the cleaned text
            return JSON.parse(text);
        } catch (e) {
            console.error("Error parsing JSON from Gemini after cleaning:", text);
            throw new Error("Failed to parse AI response.");
        }

    } catch (error) {
        console.error("Error calling Gemini API:", error);
        throw new Error("Could not fetch trends from the AI model.");
    }
};

// @route   GET /api/ai/trends
// @desc    Get AI-powered trend analysis for artisans
// @access  Private (requires authentication)
router.get('/trends', auth, async (req, res) => {
    try {
        const trends = await getAITrends();
        res.json(trends);
    } catch (error) {
        console.error('AI trends route error:', error.message);
        res.status(500).json({ message: 'Server error while fetching AI trends.' });
    }
});

module.exports = router;