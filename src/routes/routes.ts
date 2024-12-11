import { Router } from "express";
import { ResponsavelController } from "../controllers/responsavelController";
import { CriancaController } from "../controllers/criancaController";
import { ProfessorController } from "../controllers/professorController";
import { TurmaController } from "../controllers/turmaController";

const responsavelCtrl = new ResponsavelController();
const criancaCtrl = new CriancaController();
const professorCtrl = new ProfessorController();
const turmaCtrl = new TurmaController();

export const responsavelRouter = Router();
export const criancaRouter = Router();
export const professorRouter = Router();
export const turmaRouter = Router();

// Cadastrar
responsavelRouter.post("/cadastrar", responsavelCtrl.cadastrarResponsavel);
// Buscar todos
responsavelRouter.get("/todos", responsavelCtrl.buscarTodosResponsaveis);
// Buscar por CPF
responsavelRouter.get("/:cpf", responsavelCtrl.buscarResponsavelPorCPF);
// Excluir
responsavelRouter.delete("/:cpf", responsavelCtrl.excluirResponsavel);
// Atualizar (PATCH)
responsavelRouter.patch("/:cpf", responsavelCtrl.atualizarResponsavel);

// Cadastrar
criancaRouter.post("/cadastrar", criancaCtrl.cadastrarCrianca);
// Buscar todas
criancaRouter.get("/todos", criancaCtrl.buscarTodas);
// Buscar por ID
criancaRouter.get("/:id", criancaCtrl.buscarPorId);
// Deletar
criancaRouter.delete("/:id", criancaCtrl.deletarCrianca);
// Atualizar
criancaRouter.patch("/:id", criancaCtrl.atualizarCrianca);

// Cadastrar
professorRouter.post("/cadastrar", professorCtrl.cadastrarProfessor);
// Buscar todos
professorRouter.get("/todos", professorCtrl.buscarTodos);
// Buscar por CPF
professorRouter.get("/:cpf", professorCtrl.buscarPorCPF);
// Deletar
professorRouter.delete("/:cpf", professorCtrl.deletarProfessor);
// Atualizar
professorRouter.patch("/:cpf", professorCtrl.atualizarProfessor);

// Cadastrar
turmaRouter.post("/cadastrar", turmaCtrl.cadastrarTurma);
// Buscar todas
turmaRouter.get("/todos", turmaCtrl.buscarTodas);
// Buscar por ID
turmaRouter.get("/:id", turmaCtrl.buscarPorId);
// Deletar
turmaRouter.delete("/:id", turmaCtrl.deletarTurma);
// Atualizar
turmaRouter.patch("/:id", turmaCtrl.atualizarTurma);