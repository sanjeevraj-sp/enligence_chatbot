const express = require("express");
const cors = require("cors");
const { OpenAI } = require("openai"); 
require("dotenv").config();
const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();
app.use(express.json());
app.use(cors())

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, 
});

app.post("/api/chat", async (req, res) => {
  const { userInput } = req.body;
  console.log(`User Input => ${userInput}`);

  try {
    // const response = await openai.chat.completions.create({
    //   model: 'gpt-3.5-turbo',
    //   messages: [{ role: 'user', content: userInput }],
    //   max_tokens: 200,
    //   temperature: 0.9,
    // });

    // res.json({ message: response.choices[0].message.content.trim() });

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = userInput;

    const result = await model.generateContent(prompt);
    res.send(result.response.text())
    console.log(result.response.text());
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).send("Something went wrong.");
  }
});

app.listen(5000, () => {
  console.log("Server is running on port 5000");
});
