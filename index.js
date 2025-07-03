import express from "express";
import cors from "cors";
import fs from "fs";
import path from "path";

const app = express();
app.use(cors());

const __dirname = path.resolve();

const dataPath = path.join(__dirname, "questions.json");
const questions = JSON.parse(fs.readFileSync(dataPath, "utf8"));

app.get("/questions", (req, res) => {
  res.json(questions);
});

app.get("/questions/:club", (req, res) => {
  const club = req.params.club.toLowerCase();

  const clubMapping = {
    "sao-paulo": "sao_paulo",
    "atletico-mineiro": "atletico_mineiro"
  };

  const key = clubMapping[club] || club;

  if (key === "gerais" && questions.gerais) {
    return res.json(questions.gerais);
  }

  if (questions[key]) {
    return res.json(questions[key]);
  }

  return res.status(404).json({ error: "Clube não encontrado" });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`API rodando na porta ${port}`);
});
