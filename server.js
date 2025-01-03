import { CohereClientV2 } from "cohere-ai";
import dotenv from "dotenv";
import express from "express";
import cors from "cors";

dotenv.config();
const app = express();
const port = 3000;

app.use(express.json());
// Configurar CORS para permitir solo el origen específico
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "https://coffe-ai.vercel.app");
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === "OPTIONS") {
    return res.sendStatus(204);
  }
  next();
});

const cohereClient = new CohereClientV2({
  token: process.env.COHERE_API_KEY,
});

// Ruta para interactuar con la IA
app.post("/api/coffe", async (req, res) => {
  const { prompt } = req.body;
  try {
    const response = await cohereClient.chat({
      model: "command-r-plus",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    const messageText = response.message.content[0].text;
    res.json({ message: messageText });
  } catch (error) {
    console.error("Error al realizar la solicitud a Cohere:", error);
    res.status(500).json({ error: "Error al procesar la solicitud" });
  }
});

app.listen(port, () => {
  console.log(`Servidor backend corriendo en http://localhost:${port}`);
});
