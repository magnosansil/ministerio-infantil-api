import { Router } from "express";
import { ResponsavelController } from "../controllers/responsavelController";
import { CriancaController } from "../controllers/criancaController";
import { ProfessorController } from "../controllers/professorController";

const responsavelCtrl = new ResponsavelController();
const criancaCtrl = new CriancaController();
const professorCtrl = new ProfessorController();

export const responsavelRouter = Router();
export const criancaRouter = Router();
export const professorRouter = Router();

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
