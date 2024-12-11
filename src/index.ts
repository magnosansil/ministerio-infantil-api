import express from "express";
import {
  responsavelRouter,
  criancaRouter,
  professorRouter,
  turmaRouter,
} from "./routes/routes";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use("/responsavel", responsavelRouter);
app.use("/crianca", criancaRouter);
app.use("/professor", professorRouter);
app.use("/turma", turmaRouter);

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
