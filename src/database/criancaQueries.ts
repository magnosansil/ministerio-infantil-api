import { pool } from "../database";
import { RowDataPacket } from "mysql2";
import { Crianca } from "../types";

export const buscarTodasCriancas = async (): Promise<Crianca[]> => {
  const query = "SELECT * FROM crianca";
  const [rows] = await pool.query<RowDataPacket[]>(query);
  return rows as Crianca[];
};

export const verificarExistenciaResponsavel = async (
  cpf: string
): Promise<boolean> => {
  const query = "SELECT 1 FROM responsavel WHERE cpf = ?";
  const [rows] = await pool.query<RowDataPacket[]>(query, [cpf]);
  return rows.length > 0;
};

export const verificarExistenciaTurma = async (
  idTurma: number
): Promise<boolean> => {
  const query = "SELECT 1 FROM turma WHERE id_turma = ?";
  const [rows] = await pool.query<RowDataPacket[]>(query, [idTurma]);
  return rows.length > 0;
};

export const verificarExistenciaDoenca = async (
  id_doenca: number
): Promise<boolean> => {
  const [rows] = await pool.query<RowDataPacket[]>(
    "SELECT 1 FROM doencas WHERE id_doenca = ?",
    [id_doenca]
  );
  return rows.length > 0;
};

export const verificarExistenciaRestricao = async (
  id_restricao: number
): Promise<boolean> => {
  const [rows] = await pool.query<RowDataPacket[]>(
    "SELECT 1 FROM restricao WHERE id_restricao = ?",
    [id_restricao]
  );
  return rows.length > 0;
};

export const verificarExistenciaCpfCrianca = async (
  cpf: string
): Promise<boolean> => {
  const [rows] = await pool.query<RowDataPacket[]>(
    "SELECT 1 FROM crianca WHERE cpf = ?",
    [cpf]
  );
  return rows.length > 0;
};

export const verificarExistenciaCpfResponsavel = async (
  cpf: string
): Promise<boolean> => {
  const [rows] = await pool.query<RowDataPacket[]>(
    "SELECT 1 FROM responsavel WHERE cpf = ?",
    [cpf]
  );
  return rows.length > 0;
};
