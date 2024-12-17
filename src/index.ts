import express from "express";
import {
  responsavelRouter,
  criancaRouter,
  professorRouter,
  turmaRouter,
  doencaRouter,
  restricaoRouter,
} from "./routes/routes";
import dotenv from "dotenv";

dotenv.config();

const app = express();

const cors = require('cors');
app.use(cors());
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use("/responsavel", responsavelRouter);
app.use("/crianca", criancaRouter);
app.use("/professor", professorRouter);
app.use("/turma", turmaRouter);
app.use("/doenca", doencaRouter);
app.use("/restricao", restricaoRouter);

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
