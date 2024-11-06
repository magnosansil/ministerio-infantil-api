import {
  verificarExistenciaCpfCrianca,
  verificarExistenciaCpfResponsavel,
  verificarExistenciaDoenca,
  verificarExistenciaRestricao,
  verificarExistenciaTurma,
} from "../database/criancaQueries";
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
  body: Partial<Responsavel>,
  res: Response
): boolean => {
  const { cpf, nome, telefone, data_nascimento, rg, cep, endereco, sexo } =
    body;

  if (
    !cpf ||
    !nome ||
    !telefone ||
    !data_nascimento ||
    !rg ||
    !cep ||
    !endereco ||
    !sexo
  ) {
    res
      .status(400)
      .json({ error: "Todos os campos obrigatórios estão ausentes." });
    return false;
  }

  return true;
};

export const validarDoenca = async (
  id_doenca: number,
  res: Response
): Promise<boolean> => {
  const existeDoenca = await verificarExistenciaDoenca(id_doenca);
  if (!existeDoenca) {
    res
      .status(400)
      .json({ error: "A doença informada não existe no sistema." });
    return false;
  }
  return true;
};

export const validarRestricao = async (
  id_restricao: number,
  res: Response
): Promise<boolean> => {
  const existeRestricao = await verificarExistenciaRestricao(id_restricao);
  if (!existeRestricao) {
    res
      .status(400)
      .json({ error: "A restrição informada não existe no sistema." });
    return false;
  }
  return true;
};

export const validarCPFDaResponsavel = async (cpf: string, res: Response): Promise<boolean> => {
  if (cpf && !validarCPF(cpf)) {
    res.status(400).json({ error: "CPF do responsável inválido." });
    return false;
  }

  const cpfResponsavelExiste = await verificarExistenciaCpfResponsavel(cpf);
  if (cpfResponsavelExiste) {
    res.status(400).json({ error: "CPF já cadastrado como responsável." });
    return false;
  }

  const cpfCriancaExiste = await verificarExistenciaCpfCrianca(cpf);
  if (cpfCriancaExiste) {
    res.status(400).json({ error: "CPF não pode ser o mesmo de uma criança." });
    return false;
  }

  return true;
};

export const validarCPFDaCrianca = async (
  cpf: string,
  res: Response
): Promise<boolean> => {
  if (cpf && !validarCPF(cpf)) {
    res.status(400).json({ error: "CPF da criança inválido." });
    return false;
  }

  const cpfCriancaExiste = await verificarExistenciaCpfCrianca(cpf);
  if (cpfCriancaExiste) {
    res.status(400).json({ error: "CPF da criança já está cadastrado." });
    return false;
  }

  const cpfResponsavelExiste = await verificarExistenciaCpfResponsavel(cpf);
  if (cpfResponsavelExiste) {
    res
      .status(400)
      .json({
        error: "CPF da criança não pode ser o mesmo de um responsável.",
      });
    return false;
  }

  return true;
};

export const validarTurma = async (
  id_turma: number,
  res: Response
): Promise<boolean> => {
  const existeTurma = await verificarExistenciaTurma(id_turma);
  if (!existeTurma) {
    res.status(400).json({ error: "A turma informada não existe no sistema." });
    return false;
  }
  return true;
};
