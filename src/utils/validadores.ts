import { Responsavel } from "../types";
import { validarCPF } from "./validarCPF";
import { Response } from "express";

export const verificarCPF = (cpf: string, res: Response): boolean => {
  if (!validarCPF(cpf)) {
    res.status(400).json({ error: "CPF inválido." });
    return false;
  }
  return true;
};

export const validarCamposResponsavel = (
  body: Responsavel,
  res: Response
): boolean => {
  const { cpf, nome, telefone, relacionamento, idade } = body;

  if (!cpf || !nome || !telefone || !relacionamento || !idade) {
    res.status(400).json({ error: "Todos os campos são obrigatórios." });
    return false;
  }
  return true;
};
