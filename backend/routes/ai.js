const express = require('express');
const { auth, authorize } = require('../middleware/auth');
const { GoogleGenerativeAI } = require("@google/generative-ai");
const User = require('../models/User');
const Product = require('../models/Product');
const Idea = require('../models/Idea');


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
router.post('/funding-report', [auth, authorize('artisan')], async (req, res) => {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        // 1. Fetch all necessary data from the database for personalization
        const artisan = await User.findById(req.user.id).select('name artisanProfile');
        const products = await Product.find({ artisan: req.user.id }).select('name category stats averageRating');
        const ideas = await Idea.find({ artisan: req.user.id }).select('title description votes preOrders');
        const investors = await User.find({ role: 'investor' }).select('name investorProfile');
        
        // A generic list of schemes for the AI to analyze and recommend from
        const governmentSchemes = [
            { name: 'Pradhan Mantri MUDRA Yojana (PMMY)', offeredBy: 'Govt. of India', description: 'Provides loans up to ₹10 lakh to non-corporate, non-farm small/micro enterprises.', eligibility: 'All Indian citizens with a viable business plan.' },
            { name: 'Artisan Credit Card (ACC) Scheme', offeredBy: 'Ministry of Textiles', description: 'Provides timely credit to artisans for investment and working capital.', eligibility: 'Artisans in the textile sector.' },
            { name: 'Stand-Up India Scheme', offeredBy: 'Govt. of India', description: 'Facilitates bank loans between ₹10 lakh and ₹1 Crore to SC/ST or Women entrepreneurs.', eligibility: 'SC/ST and/or Women entrepreneurs.' }
        ];

        // 2. Create the master prompt for Gemini
        const prompt = `
            You are a financial advisor on "KalaGhar," an e-commerce platform for artisans.
            Analyze the following artisan's data to generate a personalized funding report.
            Return a single, valid, parsable JSON object and nothing else.

            ARTISAN'S DATA:
            - Profile: ${JSON.stringify(artisan)}
            - Products: ${JSON.stringify(products)}
            - Ideas: ${JSON.stringify(ideas)}

            AVAILABLE INVESTORS ON THE PLATFORM:
            ${JSON.stringify(investors)}

            AVAILABLE GOVERNMENT SCHEMES:
            ${JSON.stringify(governmentSchemes)}

            Based on all this data, generate a JSON object with the following structure:
            {
              "fundingReadiness": {
                "score": A score from 0 to 100 indicating how attractive the artisan is to investors. Base this on profile completeness, product performance (views, ratings), and idea validation (votes).,
                "summary": "A 1-2 sentence summary explaining the score and giving one key area for improvement."
              },
              "matchedInvestors": [
                An array of the TOP 3 investors from the provided list. For each investor, include their id, name, type, focus, range, a matchScore, and a "reasonForMatch".
                IMPORTANT: If the 'AVAILABLE INVESTORS' list is empty or no investors are a good match, return an empty array [].
              ],
              "recommendedSchemes": [ An array of the TOP 2 most relevant schemes from the list for this artisan. ],
              "applicationTips": [
                An array of 3 personalized and actionable tips to improve funding readiness. Each tip MUST be an object with a "title" and a "description".
              ]
            }
        `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        let text = response.text();

        // Clean markdown from the response
        if (text.startsWith("```json")) {
            text = text.substring(7, text.length - 3).trim();
        }

        const report = JSON.parse(text);
        res.json(report);

    } catch (error) {
        console.error('AI funding report error:', error);
        res.status(500).json({ message: 'Server error while generating funding report' });
    }
});

module.exports = router;