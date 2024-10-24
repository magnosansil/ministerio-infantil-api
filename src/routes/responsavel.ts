import { Router } from "express";
import {
  atualizarResponsavel,
  buscarResponsavelPorCPF,
  buscarTodosResponsaveis,
  cadastrarResponsavel,
  excluirResponsavel,
} from "../controllers/responsavelController";

export const responsavelRouter = Router();

// Cadastrar
responsavelRouter.post("/cadastrar", cadastrarResponsavel);
// Buscar todos
responsavelRouter.get("/todos", buscarTodosResponsaveis);
// Buscar por CPF
responsavelRouter.get('/:cpf', buscarResponsavelPorCPF);
// Excluir
responsavelRouter.delete('/:cpf', excluirResponsavel);
// Atualizar (PATCH)
responsavelRouter.patch("/:cpf", atualizarResponsavel);