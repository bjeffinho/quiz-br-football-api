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

app.get("/", (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="pt-BR">
      <head>
        <meta charset="UTF-8" />
        <title>API - Quiz Futebol BR</title>
        <style>
          body {
            background-color:rgb(0, 24, 0);
            font-family: 'Segoe UI', sans-serif;
            padding: 40px;
            text-align: center;
            color: #f0f0f0;
          }
          h1 {
            color: #d4edda;
            font-size: 32px;
          }
          p {
            font-size: 18px;
            margin-bottom: 10px;
          }
          a {
            color: #90ee90;
            text-decoration: none;
            font-weight: bold;
          }
          a:hover {
            text-decoration: underline;
          }
          code {
            background-color:rgb(79, 133, 102);
            padding: 4px 8px;
            border-radius: 4px;
            font-family: monospace;
            color: #ffffff;
          }
          .info {
            margin-top: 20px;
          }
          footer {
            margin-top: 50px;
            font-size: 14px;
            color: #cccccc;
          }
        </style>
      </head>
      <body>
        <h1>API de Quiz de Futebol Brasileiro</h1>
        <p>Seja bem-vindo! Esta é uma API open source com perguntas sobre futebol brasileiro e seus principais clubes.</p>

        <div class="info">
          <p>🔗 Perguntas gerais: <a href="/questions">/questions</a></p>
          <p>⚽ Para acessar as perguntas por time: <code>/questions/palmeiras</code>, <code>/questions/flamengo</code>, <code>/questions/corinthians</code>, etc.</p>
          <p>Código no GitHub: <a href="https://github.com/bjeffinho/quiz-br-football-api" target="_blank">/bjeffinho/quiz-br-football-api</a></p>
        </div>

        <footer>
          <p>Criado por <a href="https://www.linkedin.com/in/jeff-brandao/" target="_blank">Jefferson Brandão - Desenvolvedor Fullstack</a></p>
        </footer>
      </body>
    </html>
  `);
});



const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`API rodando na porta ${port}`);
});
