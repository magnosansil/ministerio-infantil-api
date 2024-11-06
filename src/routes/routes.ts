import { Router } from "express";
import { ResponsavelController } from "../controllers/responsavelController";
import { CriancaController } from "../controllers/criancaController";

const responsavelCtrl = new ResponsavelController();
const criancaCtrl = new CriancaController();

export const responsavelRouter = Router();
export const criancaRouter = Router();

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
