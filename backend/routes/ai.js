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

const router = express.Router();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const getInternalPlatformUpdates = async (userId) => {
  // Mock implementation - replace with actual database queries
  return {
    marketTrends: {
      trending: "Block Printing",
      demandIncrease: "+45% this month",
      topCategory: "Textiles",
    },
    fundingOpportunities: [
      {
        name: "Craft Innovation Grant",
        amount: "₹50,000",
        deadline: "30 days",
        eligibility: "For artisans with 6+ months on platform",
      },
    ],
    communityHighlights: [
      {
        type: "success_story",
        title: "Local artisan reaches ₹1L in sales",
        artisan: "Priya from Jaipur",
      },
      {
        type: "new_feature",
        title: "Video uploads now available for products",
        description: "Showcase your craft process",
      },
    ],
    personalMilestones: {
      daysOnPlatform: 120,
      totalSales: 45,
      nextMilestone: "50 sales - unlock Premium Badge",
    },
  };
};

const searchWebForEvents = async (query, location) => {
  // Mock implementation - in production, integrate with an events API
  // You could use Google Events API, Eventbrite API, or web scraping
  return [
    {
      title: `${query} Workshop`,
      location: `${location} Craft Center`,
      date: "Next Saturday, 10 AM",
      description: `Learn advanced ${query} techniques from master artisans`,
      registrationUrl: "https://example.com/register",
    },
    {
      title: `${location} Artisan Market`,
      location: `Central ${location}`,
      date: "This Sunday, 9 AM - 6 PM",
      description: "Monthly market featuring local handicrafts",
      registrationUrl: "https://example.com/market",
    },
    {
      title: "Traditional Crafts Exhibition",
      location: `${location} Museum`,
      date: "Opening next week",
      description: `Featuring ${query} and other traditional crafts`,
      registrationUrl: "https://example.com/exhibition",
    },
  ];
};

const extractJson = (text) => {
  const jsonMatch = text.match(/```json\s*(\{[\s\S]*?\})\s*```|(\{[\s\S]*?\})/);
  if (jsonMatch) {
    const jsonString = jsonMatch[1] || jsonMatch[2];
    try {
      JSON.parse(jsonString);
      return jsonString;
    } catch (e) {
      console.error("Could not parse extracted JSON string:", jsonString);
      return null;
    }
  }
  return null;
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

    // 1. Check for a fresh, cached report for THIS user
    const latestReport = await AIReportService.getLatestReport('funding', userId);
    if (latestReport && AIReportService.isReportFresh(latestReport.generatedAt)) {
      console.log(`Serving cached funding report for user ${userId}.`);
      return res.json(latestReport.reportData);
    }
    // 2. If no fresh report, generate a new one
    console.log(`Generating new funding report for user ${userId}.`);
      const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

      const artisan = await UserService.findById(req.user.id);
      const products = await ProductService.findMany({ artisan: req.user.id });
      const ideas = await IdeaService.findMany({ artisan: req.user.id });
      const investors = await UserService.findMany({ role: "investor" });

      const governmentSchemes = [
        {
          name: "Pradhan Mantri MUDRA Yojana (PMMY)",
          offeredBy: "Govt. of India",
          description:
            "Provides loans up to ₹10 lakh to non-corporate, non-farm small/micro enterprises.",
          eligibility: "All Indian citizens with a viable business plan.",
        },
        {
          name: "Artisan Credit Card (ACC) Scheme",
          offeredBy: "Ministry of Textiles",
          description:
            "Provides timely credit to artisans for investment and working capital.",
          eligibility: "Artisans in the textile sector.",
        },
        {
          name: "Stand-Up India Scheme",
          offeredBy: "Govt. of India",
          description:
            "Facilitates bank loans between ₹10 lakh and ₹1 Crore to SC/ST or Women entrepreneurs.",
          eligibility: "SC/ST and/or Women entrepreneurs.",
        },
      ];

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
        throw new Error(
          "The AI returned an invalid format for the funding report."
        );
      }

      const report = JSON.parse(jsonString);
      await AIReportService.saveReport('funding', report, userId);
      res.json(report);
    } catch (error) {
      console.error("AI funding report error:", error);
      res
        .status(500)
        .json({ message: "Server error while generating funding report" });
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
    const tools = [
      {
        functionDeclarations: [
          {
            name: "getArtisanPerformanceDashboard",
            description:
              "Get key performance indicators for the artisan, like total sales, product views, and top products.",
            parameters: { type: "OBJECT", properties: {} },
          },
          {
            name: "getPlatformUpdates",
            description:
              "Retrieves internal platform updates for the artisan, including the latest market trends, new funding opportunities, and community highlights.",
            parameters: { type: "OBJECT", properties: {} },
          },
          {
            name: "searchInternetForLocalEvents",
            description:
              "Searches the internet for real-time, local events like handicraft workshops, markets, or exhibitions based on a query and a location.",
            parameters: {
              type: "OBJECT",
              properties: {
                query: {
                  type: "STRING",
                  description:
                    "The specific search term, e.g., 'pottery workshops' or 'textile fairs'.",
                },
                location: {
                  type: "STRING",
                  description:
                    "The city or region to search in, e.g., 'New Delhi' or 'Rajasthan'.",
                },
              },
              required: ["query", "location"],
            },
          },
        ],
      },
    ];

    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      tools,
    });

    const personaInstructions = {
      role: "user",
      parts: [
        {
          text: `
                System Instruction: You are 'Kala', a friendly, encouraging, and insightful AI assistant for artisans on the KalaGhar platform. 
                Your goal is to provide comprehensive, easy-to-understand updates and advice.
                When you present data, synthesize it into a natural, human-like paragraph.
                Do not just list out the raw data.
                Always start your response by directly addressing the user's request.
                *** VERY IMPORTANT: Your final output must be a single, valid, parsable JSON object and nothing else.
                The JSON object must have this exact structure: { "reply": "Your full text response here.", "language": "The B-47 language code of your response, e.g., 'en-US' for English or 'hi-IN' for Hindi." }
            `,
        },
      ],
    };

    // This part of your code for fetching history is already correct
    let history = await ConversationService.getHistory(userId);
    if (!history) {
        history = [personaInstructions]; // Start a new history if one doesn't exist
    }

    const chat = model.startChat({ history });

    const result = await chat.sendMessage(prompt);
    const response = result.response;

    const functionCalls = response.functionCalls();

    if (functionCalls && functionCalls.length > 0) {
      const call = functionCalls[0];
      let functionResponse;

      console.log(`AI is calling tool: ${call.name}`);

      if (call.name === "getArtisanPerformanceDashboard") {
        const products = await ProductService.findMany({ artisan: userId });
        const orders = await OrderService.findMany({
          "items.artisan": userId,
          status: "delivered",
        });
        const totalSales = orders.reduce(
          (sum, o) => sum + (o.pricing.total || 0),
          0
        );
        const dashboardData = {
          totalSales: `$${totalSales.toFixed(2)}`,
          totalProducts: products.length,
          totalOrders: orders.length,
        };
        functionResponse = {
          name: call.name,
          content: {
            result: `Performance Summary: ${JSON.stringify(dashboardData)}`,
          },
        };
      } else if (call.name === "getPlatformUpdates") {
        const updates = await getInternalPlatformUpdates(userId);
        functionResponse = {
          name: call.name,
          content: { result: `Platform Updates: ${JSON.stringify(updates)}` },
        };
      } else if (call.name === "searchInternetForLocalEvents") {
        const { query, location } = call.args;
        const events = await searchWebForEvents(query, location);
        functionResponse = {
          name: call.name,
          content: {
            result: `External Events Found: ${JSON.stringify(events)}`,
          },
        };
      } else {
        functionResponse = {
          name: call.name,
          content: { result: "Sorry, I can't do that yet." },
        };
      }

      const result2 = await chat.sendMessage(JSON.stringify(functionResponse));
      const finalResponse = await result2.response;
      console.log("RAW AI Response (with function call):", finalResponse.text());
      const newHistoryAfterFunctionCall = await chat.getHistory();
      await ConversationService.saveHistory(userId, newHistoryAfterFunctionCall);
      const aiJsonReply = extractJson(finalResponse.text());
      res.json(JSON.parse(aiJsonReply));
    } else {
      console.log("RAW AI Response (direct reply):", response.text());
      const newHistory = await chat.getHistory();
      await ConversationService.saveHistory(userId, newHistory);
      const aiJsonReply = extractJson(response.text());
      res.json(JSON.parse(aiJsonReply));
    }
  } catch (error) {
    console.error("AI Assistant error:", error);
    res.status(500).json({
      message: "The AI assistant is having trouble. Please try again.",
    });
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
