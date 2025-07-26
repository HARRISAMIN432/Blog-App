const express = require("express");
const router = express.Router();

router.post("/generate-blog", async (req, res) => {
  const { topic, subtitle } = req.body;
  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `Write a detailed blog post on: ${topic} and subtopic: ${subtitle}. 
                        Use HTML formatting only. 
                        Use <strong> instead of asterisks for bold text. 
                        Do not use Markdown or asterisks. Dont write \`\`\`html in the start additional and no empty line in the start text like html at the top 
                        and no \` symbol`,
                },
              ],
            },
          ],
        }),
      }
    );
    const data = await response.json();
    const generated = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!generated) throw new Error("No content generated");
    res.json({ success: true, content: generated });
  } catch (error) {
    console.error("Gemini Error:", error.message);
    res
      .status(500)
      .json({ success: false, message: "Failed to generate content" });
  }
});

module.exports = router;
