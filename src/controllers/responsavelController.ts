import { Request, Response } from "express";
import { Responsavel } from "../types";
import { pool } from "../database";
import { validarCPF } from "../utils/validarCPF";
import { QueryResult } from "mysql2";

// Cadastrar
export const cadastrarResponsavel = async (
  req: Request<{}, {}, Responsavel>,
  res: Response
): Promise<Response> => {
  const { cpf, nome, telefone, relacionamento, idade } = req.body;

  if (!cpf || !nome || !telefone || !relacionamento || !idade) {
    return res.status(400).json({ error: "Todos os campos são obrigatórios." });
  }

  if (!validarCPF(cpf)) {
    return res.status(400).json({ error: "CPF inválido." });
  }

  try {
    const query =
      "INSERT INTO responsavel (cpf, nome, telefone, relacionamento, idade) VALUES (?, ?, ?, ?, ?)";
    await pool.query(query, [cpf, nome, telefone, relacionamento, idade]);

    return res
      .status(201)
      .json({ message: "Responsável cadastrado com sucesso!" });
  } catch (e: any) {
    if (e.code === "ER_DUP_ENTRY") {
      return res.status(409).json({ error: "CPF já cadastrado." });
    }
    return res.status(500).json({ message: "Erro ao cadastrar responsável!" });
  }
};

// Buscar todos
export const buscarTodosResponsaveis = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const [rows] = await pool.query("SELECT * FROM responsavel");

    return res.status(200).json(rows);
  } catch (e) {
    return res.status(500).json({ message: "Erro ao buscar responsáveis." });
  }
};

// Buscar por CPF
export const buscarResponsavelPorCPF = async (
  req: Request<{ cpf: string }>,
  res: Response
): Promise<Response> => {
  const { cpf } = req.params;

  if (!validarCPF(cpf)) {
    return res.status(400).json({ error: "CPF inválido." });
  }

  try {
    const query = "SELECT * FROM responsavel WHERE cpf = ?";
    const [results]: [QueryResult, any] = await pool.query(query, [cpf]);
    const rows = results as Responsavel[];

    if (rows.length === 0) {
      return res.status(404).json({ message: "Responsável não encontrado." });
    }

    return res.status(200).json(rows[0]);
  } catch (e) {
    console.error(`Erro ao buscar responsável: ${e}`);
    return res.status(500).json({ message: "Erro ao buscar responsável." });
  }
};

// Excluir
export const excluirResponsavel = async (
  req: Request<{ cpf: string }>,
  res: Response
): Promise<Response> => {
  const { cpf } = req.params;

  if (!validarCPF(cpf)) {
    return res.status(400).json({ error: "CPF inválido." });
  }

  try {
    const query = "DELETE FROM responsavel WHERE cpf = ?";
    const [result] = await pool.query(query, [cpf]);

    if ((result as any).affectedRows === 0) {
      return res.status(404).json({ message: "Responsável não encontrado." });
    }

    return res.status(200).json({ message: "Responsável excluído com sucesso!" });
  } catch (e) {
    console.error(`Erro ao excluir responsável: ${e}`);
    return res.status(500).json({ message: "Erro ao excluir responsável." });
  }
};
