const express = require("express");
const { auth, authorize } = require("../middleware/auth");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const UserService = require("../services/UserService");
const ProductService = require("../services/ProductService");
const IdeaService = require("../services/IdeaService");
const { body, validationResult } = require("express-validator");
const OrderService = require("../services/OrderService");
const ConversationService = require("../services/ConversationService");
const AIReportService = require('../services/AIReportService');
const { db } = require('../firebase');
const GoogleEventsService = require('../services/GoogleEventsService');
const GoogleSchemesService = require('../services/GovernmentSchemesService');
const router = express.Router();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// const getInternalPlatformUpdates = async (userId) => {
//   // Mock implementation - replace with actual database queries
//   return {
//     marketTrends: {
//       trending: "Block Printing",
//       demandIncrease: "+45% this month",
//       topCategory: "Textiles",
//     },
//     fundingOpportunities: [
//       {
//         name: "Craft Innovation Grant",
//         amount: "₹50,000",
//         deadline: "30 days",
//         eligibility: "For artisans with 6+ months on platform",
//       },
//     ],
//     communityHighlights: [
//       {
//         type: "success_story",
//         title: "Local artisan reaches ₹1L in sales",
//         artisan: "Priya from Jaipur",
//       },
//       {
//         type: "new_feature",
//         title: "Video uploads now available for products",
//         description: "Showcase your craft process",
//       },
//     ],
//     personalMilestones: {
//       daysOnPlatform: 120,
//       totalSales: 45,
//       nextMilestone: "50 sales - unlock Premium Badge",
//     },
//   };
// };

// const searchWebForEvents = async (query, location) => {
//   // Mock implementation - in production, integrate with an events API
//   // You could use Google Events API, Eventbrite API, or web scraping
//   return [
//     {
//       title: `${query} Workshop`,
//       location: `${location} Craft Center`,
//       date: "Next Saturday, 10 AM",
//       description: `Learn advanced ${query} techniques from master artisans`,
//       registrationUrl: "https://example.com/register",
//     },
//     {
//       title: `${location} Artisan Market`,
//       location: `Central ${location}`,
//       date: "This Sunday, 9 AM - 6 PM",
//       description: "Monthly market featuring local handicrafts",
//       registrationUrl: "https://example.com/market",
//     },
//     {
//       title: "Traditional Crafts Exhibition",
//       location: `${location} Museum`,
//       date: "Opening next week",
//       description: `Featuring ${query} and other traditional crafts`,
//       registrationUrl: "https://example.com/exhibition",
//     },
//   ];
// };

const extractJson = (text) => {
    try {
        const startIndex = text.indexOf('{');
        const endIndex = text.lastIndexOf('}');
        if (startIndex !== -1 && endIndex !== -1 && endIndex > startIndex) {
            const jsonString = text.substring(startIndex, endIndex + 1);
            return JSON.parse(jsonString);
        }
        return JSON.parse(text);
    } catch (e) {
        console.error("Fatal Error: Could not parse JSON from AI response. Raw text:", text);
        return null;
    }
};

const getAITrends = async () => {
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
  const prompt = `
      You are a market trend analyst for "KalaGhar," an e-commerce platform for handmade goods.
      Your task is to generate a concise and actionable trend report for our artisans based on current market data.
      The report must be returned as a single, valid, parsable JSON object and nothing else.
      Do not include any text, backticks, or explanations outside of the JSON object itself.
      The JSON object must have the following structure:
      {
        "trendOfMonth": {"title": "A short, catchy title.", "summary": "A 1-2 sentence summary.", "keywords": ["An", "array", "of", "4", "keywords"]},
        "actionableTips": [{"title": "A short, actionable tip title.", "description": "A brief explanation."}, {"title": "Tip 2.", "description": "Desc 2."}, {"title": "Tip 3.", "description": "Desc 3."}, {"title": "Tip 4.", "description": "Desc 4."}],
        "categoryDemand": {"labels": ["Top 4 categories"], "data": [Array of 4 numbers summing to 100]},
        "trendingMaterials": {"labels": ["Top 4 materials"], "data": [Array of 4 numbers summing to 100]}
      }
    `;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  const rawText = response.text();
  const jsonString = extractJson(rawText);
  if (!jsonString) {
    throw new Error("Failed to get valid JSON trend data from AI.");
  }
  return JSON.parse(jsonString);
};

router.get("/trends", auth, async (req, res) => {
  try {
    // 1. Check for a fresh, cached report first
    const latestReport = await AIReportService.getLatestReport('trends');
    if (latestReport && AIReportService.isReportFresh(latestReport.generatedAt)) {
      console.log("Serving cached trends report.");
      return res.json(latestReport.reportData);
    }

    console.log("Generating new trends report.");
    const trends = await getAITrends();

    // 3. Save the new report to the database for future requests
    await AIReportService.saveReport('trends', trends);

    res.json(trends);
  } catch (error) {
    console.error("AI trends route error:", error.message);
    res.status(500).json({ message: "Server error while fetching AI trends." });
  }
});


router.post(
  "/generate-description",
  [auth, authorize("artisan")],
  [
    body("name").trim().notEmpty().withMessage("Product name is required."),
    body("category")
      .trim()
      .notEmpty()
      .withMessage("Product category is required."),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { name, category, materials, inspiration } = req.body;
      const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
      const prompt = `
            You are a master storyteller for "KalaGhar," an e-commerce platform for handmade crafts.
            Write an evocative product description.
            Product Details:
            - Name: "${name}"
            - Category: "${category}"
            ${materials ? `- Materials: "${materials}"` : ""}
            ${inspiration ? `- Inspiration: "${inspiration}"` : ""}
            Instructions:
            - Start with a captivating opening sentence.
            - Tell a short story about the product, its handcrafted nature, and skill involved.
            - Describe how it can fit into the buyer's life.
            - The tone must be warm, authentic, and personal.
            - The description should be 2 paragraphs. - 50 words
            - *** IMPORTANT: The final description MUST be under 1900 characters in total. ***
            - Return only the description text. Do not use markdown.
        `;

      let result;
      let retries = 3;
      while (retries > 0) {
        try {
          result = await model.generateContent(prompt);
          break;
        } catch (error) {
          if (error.status === 503 && retries > 1) {
            console.log(
              `AI model overloaded (503) on description generation. Retrying...`
            );
            retries--;
            await delay(1000);
          } else {
            throw error;
          }
        }
      }

      const response = await result.response;
      const description = response.text();
      res.json({ description });
    } catch (error) {
      console.error("AI description generation error:", error);
      res.status(500).json({
        message:
          "The AI service is currently busy. Please try again in a moment.",
      });
    }
  }
);

router.post(
  "/suggest-price",
  [auth, authorize("artisan")],
  [
    body("name").trim().notEmpty().withMessage("Product name is required."),
    body("category")
      .trim()
      .notEmpty()
      .withMessage("Product category is required."),
    body("description")
      .trim()
      .notEmpty()
      .withMessage("Product description is required."),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { name, category, description } = req.body;
      const similarProducts = await ProductService.findActive(
        { category: category },
        { limit: 5 }
      );
      const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
      const prompt = `
            You are an expert e-commerce pricing analyst for "KalaGhar," a marketplace for handmade goods.
            Suggest a competitive price in rupees for a new product.
            Product Details:
            - Name: "${name}"
            - Category: "${category}"
            - Description: "${description}"
            Market Data (similar products in INR):
            Analyze the indian market for similar products and then give a reaosnable price an artisan would expect
            ${
              similarProducts.length > 0
                ? JSON.stringify(similarProducts, null, 2)
                : "No comparable products found."
            }
            Instructions:
            - Analyze the product description for complexity and artistic value.
            - Compare it with the market data.
            - Provide a suggested price range (e.g., "45-60").
            - Provide a short justification (1-2 sentences).

            - Return the response as a single, valid, parsable JSON object, and nothing else.
            Example Response:
            { "suggestedPriceRange": "45-60", "justification": "This price is competitive, with the intricate hand-painting justifying the higher end." }
        `;

      let result;
      let retries = 3;
      while (retries > 0) {
        try {
          result = await model.generateContent(prompt);
          break;
        } catch (error) {
          if (error.status === 503 && retries > 1) {
            console.log(
              `AI model overloaded (503) on price suggestion. Retrying...`
            );
            retries--;
            await delay(1000);
          } else {
            throw error;
          }
        }
      }

      const response = await result.response;
      const rawText = response.text();
      const jsonString = extractJson(rawText);

      if (!jsonString) {
        console.error(
          "Failed to extract JSON from AI price response:",
          rawText
        );
        throw new Error("The AI returned an invalid format. Please try again.");
      }

      const suggestion = JSON.parse(jsonString);
      res.json(suggestion);
    } catch (error) {
      console.error("AI price suggestion error:", error);
      res.status(500).json({
        message:
          error.message ||
          "The AI service is currently busy. Please try again.",
      });
    }
  }
);

router.post(
  "/funding-report",
  [auth, authorize("artisan")],
  async (req, res) => {
    try {
        const userId = req.user.id;
        const latestReport = await AIReportService.getLatestReport('funding', userId);
        if (latestReport && AIReportService.isReportFresh(latestReport.generatedAt)) {
            return res.json(latestReport.reportData);
        }

        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        // Fetch all data dynamically
        const artisan = await UserService.findById(req.user.id);
        const products = await ProductService.findMany({ artisan: req.user.id });
        const ideas = await IdeaService.findMany({ artisan: req.user.id });
        const investors = await UserService.findMany({ role: "investor" });
        
        // *** NO LONGER HARDCODED ***
        const governmentSchemes = await GoogleSchemesService.getGovernmentSchemes(req.user.id, false);

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

            Based on all this data, generate a JSON object with this structure:
            {
              "fundingReadiness": {
                "score": "A score from 0-100 on investor attractiveness (profile completeness, product performance, idea validation).",
                "summary": "A 1-2 sentence summary explaining the score and one key area for improvement."
              },
              "matchedInvestors": [
                "An array of the TOP 3 investors. Include id, name, type, focus, range, a matchScore, and a 'reasonForMatch'. If none, return empty array []."
              ],
              "recommendedSchemes": [ "An array of the TOP 2 most relevant schemes." ],
              "applicationTips": [
                "An array of 3 personalized, actionable tips to improve funding readiness. Each tip must be an object with 'title' and 'description'."
              ]
            }
        `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const rawText = response.text();
        const jsonString = extractJson(rawText);

        if (!jsonString) {
            throw new Error("The AI returned an invalid format for the funding report.");
        }

        const report = JSON.parse(jsonString);
        await AIReportService.saveReport('funding', report, userId);
        res.json(report);
    } catch (error) {
        console.error("AI funding report error:", error);
        res.status(500).json({ message: "Server error while generating funding report" });
    }
  }
);

router.post(
  "/personal-insights",
  [auth, authorize("artisan")],
  async (req, res) => {
    try {
        const userId = req.user.id;

    // 1. Check for a fresh, cached report for THIS user
    const latestReport = await AIReportService.getLatestReport('insights', userId);
    if (latestReport && AIReportService.isReportFresh(latestReport.generatedAt)) {
      console.log(`Serving cached personal insights for user ${userId}.`);
      return res.json(latestReport.reportData);
    }

    // 2. If no fresh report, generate a new one
    console.log(`Generating new personal insights for user ${userId}.`);
      const marketTrends = await getAITrends();

      const artisanProducts = await ProductService.findMany(
        { artisan: req.user.id },
        {
          sortBy: "stats.views",
          sortOrder: "desc",
        }
      );

      const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
      const prompt = `
            You are an expert e-commerce business coach for "KalaGhar," a marketplace for handmade goods.
            Your task is to provide personalized, actionable insights for an artisan based on their performance and current market trends.

            GENERAL MARKET TRENDS:
            ${JSON.stringify(marketTrends, null, 2)}

            THIS ARTISAN'S CURRENT PRODUCTS (sorted by views):
            ${
              artisanProducts.length > 0
                ? JSON.stringify(artisanProducts, null, 2)
                : "This artisan has not listed any products yet."
            }

            Instructions:
            1.  Analyze the artisan's products. Identify their top-performing item and any clear strengths (e.g., "High views on Pottery items," "Excellent average ratings").
            2.  Compare the artisan's product categories with the "categoryDemand" from the market trends. Identify their biggest opportunity (e.g., "The market demand for Textiles is high, and you have a popular textile product. You should focus more on this.").
            3.  Provide three concrete, actionable tips tailored to this specific artisan to help them increase sales and visibility. The tips should be creative and reference both their products and the market trends.
            4.  Return the response as a single, valid, parsable JSON object, and nothing else.

            Example JSON Response:
            {
              "keyStrength": "Your 'Handwoven Pashmina Shawl' is getting significant attention, indicating a strong appeal in the high-end textile market.",
              "keyOpportunity": "Market trends show a huge demand for 'Textiles'. Since your shawl is a top performer, creating variations or complementary products (like scarves or throws) could capture this demand.",
              "actionableTips": [
                {
                  "title": "Launch a 'Luxe Winter Collection'",
                  "description": "Bundle your popular shawl with a new, smaller item like a matching handwoven scarf. Market it as a premium gift set, leveraging the 'gifting' trend."
                },
                {
                  "title": "Refresh Your 'Jaipur Blue Pottery' Listing",
                  "description": "This item has a good rating but low views. Update its title and tags using keywords from the trend report like 'functional art' and 'home office decor' to attract new buyers."
                },
                {
                  "title": "Create an 'Idea' for Eco-Dyed Products",
                  "description": "The trend report shows 'Linen' is a popular material. Submit an 'Idea' on the platform for 'Hand-Dyed Linen Table Runners' to gauge customer interest before investing time and materials."
                }
              ]
            }
        `;

      let result;
      let retries = 3;
      while (retries > 0) {
        try {
          result = await model.generateContent(prompt);
          break;
        } catch (error) {
          if (error.status === 503 && retries > 1) {
            console.log(`AI model overloaded (503) on insights. Retrying...`);
            retries--;
            await delay(1000);
          } else {
            throw error;
          }
        }
      }

      const response = await result.response;
      const rawText = response.text();
      const jsonString = extractJson(rawText);

      if (!jsonString) {
        console.error(
          "Failed to extract JSON from AI insights response:",
          rawText
        );
        throw new Error("The AI returned an invalid format.");
      }

      const insights = JSON.parse(jsonString);
      await AIReportService.saveReport('insights', insights, userId);
      res.json(insights);
    } catch (error) {
      console.error("AI personal insights error:", error);
      res.status(500).json({
        message:
          error.message ||
          "The AI service is currently busy. Please try again.",
      });
    }
  }
);
const conversationHistories = {};

router.post("/assistant", [auth, authorize("artisan")], async (req, res) => {
  const { prompt } = req.body;
  const userId = req.user.id;

  if (!prompt) {
    return res.status(400).json({ message: "Prompt is required." });
  }

  try {
    // --- STEP 1: DEFINE THE DYNAMIC TOOLS ---
    const tools = [{
      functionDeclarations: [
        {
          name: "getArtisanPerformanceMetrics",
          description: "Get a summary of the artisan's business performance, including sales, new orders, product views, and low stock alerts.",
          parameters: { type: "OBJECT", properties: {} },
        },
        {
          name: "getRecentOrdersByStatus",
          description: "Gets the number of recent orders, categorized by status like pending, processing, and shipped.",
          parameters: { type: "OBJECT", properties: {} },
        },
        {
          name: "getNearbyArtisanEvents",
          description: "Finds nearby events, exhibitions, craft fairs, and markets relevant to artisans using their profile location.",
          parameters: { type: "OBJECT", properties: {} },
        },
        {
          name: "getArtisanReviews",
          description: "Fetches the most recent customer reviews for the artisan's products.",
          parameters: {
            type: "OBJECT",
            properties: {
              limit: { type: "NUMBER", description: "Number of reviews to fetch. Defaults to 3." }
            }
          }
        },
        {
          name: "getRecommendedGovernmentSchemes",
          description: "Finds relevant government schemes and funding opportunities for artisans based on their location.",
          parameters: { type: "OBJECT", properties: {} },
        }
      ],
    }];

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash", tools });

    // --- STEP 2: DEFINE THE AI'S PERSONA AND RESPONSE STYLE ---
    const personaInstructions = {
      role: "user",
      parts: [{
        text: `
              System Instruction: You are 'Kala', a friendly, encouraging, and insightful AI assistant for artisans on the KalaGhar platform. 
              
              **Core Directives:**
              1.  **Be Human-like and Conversational:** Synthesize data into natural, flowing sentences. NEVER just list raw data. For example, instead of "Result: 5 pending orders", say "It looks like you have 5 new orders waiting for your attention! That's wonderful news."
              2.  **Be Encouraging:** Frame insights positively.
              3.  **Directly Answer the Question:** Start your response by addressing the user's primary question first.
              
              **CRITICAL OUTPUT RULE:**
              Your final output, whether it's a direct answer or a summary of tool results, MUST BE a single, valid, parsable JSON object and absolutely nothing else. No extra text, no markdown. The object must have this exact structure:
              { 
                "reply": "Your complete, human-like, conversational response goes here.", 
                "language": "The BCP-47 language code of your response, e.g., 'en-US' for English or 'hi-IN' for Hindi." 
              }

              **CRITICAL TOOL HANDLING RULE:**
              When you receive a "toolResponse", your ONLY job is to transform that raw data into a friendly, conversational paragraph for the 'reply' field and then wrap it in the required JSON structure mentioned above. Do NOT output the raw data or fail to format the final response as JSON.
            `,
      }],
    };

    let history = await ConversationService.getHistory(userId);
    if (!history || history.length === 0) {
      history = [personaInstructions];
    }

    const chat = model.startChat({ history });
    const result = await chat.sendMessage(prompt);
    const response = result.response;
    const functionCalls = response.functionCalls();

    // --- STEP 3: EXECUTE THE CALLED TOOL ---
    if (functionCalls && functionCalls.length > 0) {
      const call = functionCalls[0];
      let toolResult;

      console.log(`AI Assistant is calling tool: ${call.name}`);

      if (call.name === "getArtisanPerformanceMetrics") {
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        const recentOrdersSnapshot = await db.collection('orders').where('artisanIds', 'array-contains', userId).where('status', '==', 'delivered').where('createdAt', '>=', sevenDaysAgo).get();
        let totalSalesLast7Days = 0;
        recentOrdersSnapshot.forEach(doc => { totalSalesLast7Days += doc.data().pricing.total || 0; });
        
        const [lowStockSnapshot, topProductsSnapshot] = await Promise.all([
            db.collection('products').where('artisan', '==', userId).where('inventory.isUnlimited', '==', false).where('inventory.quantity', '<', 5).get(),
            db.collection('products').where('artisan', '==', userId).orderBy('stats.views', 'desc').limit(3).get()
        ]);

        const topProducts = [];
        topProductsSnapshot.forEach(doc => { const p = doc.data(); topProducts.push({ name: p.name, views: p.stats.views }); });

        toolResult = { totalSalesLast7Days: `₹${totalSalesLast7Days.toFixed(2)}`, lowStockItems: lowStockSnapshot.size, topPerformingProducts: topProducts };

      } else if (call.name === "getRecentOrdersByStatus") {
        const statuses = ['pending', 'processing', 'shipped'];
        const counts = {};
        for (const status of statuses) {
            const snapshot = await db.collection('orders').where('artisanIds', 'array-contains', userId).where('status', '==', status).get();
            counts[`${status}Orders`] = snapshot.size;
        }
        toolResult = counts;

      } else if (call.name === "getNearbyArtisanEvents") {
        toolResult = await GoogleEventsService.getNearbyEvents(userId, false);

      } else if (call.name === "getArtisanReviews") {
        const { limit = 3 } = call.args;
        const reviewsSnapshot = await db.collection('reviews').where('artisanId', '==', userId).orderBy('createdAt', 'desc').limit(limit).get();
        if (reviewsSnapshot.empty) {
            toolResult = { reviews: [] };
        } else {
            toolResult = { reviews: reviewsSnapshot.docs.map(doc => { const d = doc.data(); return { productName: d.product.name, customerName: d.customerName, rating: d.rating, comment: d.comment }; })};
        }
        
      } else if (call.name === "getRecommendedGovernmentSchemes") {
        toolResult = await GoogleSchemesService.getGovernmentSchemes(userId, false);

      } else {
        toolResult = { error: "I can't perform that action right now." };
      }

      // --- STEP 4: SEND TOOL RESULT BACK TO THE MODEL ---
      const result2 = await chat.sendMessage(JSON.stringify({ toolResponse: { name: call.name, content: toolResult }}));
      const finalResponse = await result2.response;
      
      const newHistory = await chat.getHistory();
      await ConversationService.saveHistory(userId, newHistory);
      
      const aiJsonReply = extractJson(finalResponse.text());
      if (!aiJsonReply) {
      throw new Error("AI returned a non-JSON response after tool call.");
      }
      res.json(aiJsonReply);

    } else {
      // Direct reply without tools
      const newHistory = await chat.getHistory();
      await ConversationService.saveHistory(userId, newHistory);
      const aiJsonReply = extractJson(response.text());
      if (!aiJsonReply) {
          throw new Error("AI returned a non-JSON response for direct reply.");
      }
      res.json(aiJsonReply);
    }
  } catch (error) {
    console.error("AI Assistant error:", error);
    res.status(500).json({ message: "The AI assistant is having trouble. Please try again." });
  }
});

const textToSpeech = require("@google-cloud/text-to-speech");
const fs = require("fs");
const path = require("path");

const credentials = JSON.parse(process.env.GOOGLE_CREDS);

const ttsClient = new textToSpeech.TextToSpeechClient({
  credentials,
});

router.post("/synthesize-speech", auth, async (req, res) => {
  const { text, languageCode } = req.body; // e.g., languageCode: "hi-IN"

  if (!text || !languageCode) {
    return res
      .status(400)
      .json({ message: "Text and language code are required." });
  }

  try {
    const request = {
      input: { text: text },
      voice: { languageCode: languageCode, ssmlGender: "FEMALE" },
      audioConfig: { audioEncoding: "MP3" },
    };

    const [response] = await ttsClient.synthesizeSpeech(request);

    const audioBase64 = response.audioContent.toString("base64");

    res.json({ audioContent: audioBase64 });
  } catch (error) {
    console.error("Google TTS Error:", error);
    res.status(500).json({ message: "Failed to synthesize speech." });
  }
});

module.exports = router;
