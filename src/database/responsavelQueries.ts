import { pool } from "../database";
import { RowDataPacket } from "mysql2";
import { Responsavel } from "../types";

// Verificar associação do responsável com uma criança
export const verificarAssociacaoComCrianca = async (cpf: string): Promise<boolean> => {
  const query = "SELECT COUNT(*) AS count FROM crianca WHERE fk_cpf_responsavel = ?";
  const [rows] = await pool.query<RowDataPacket[]>(query, [cpf]);
  const [{ count }] = rows as { count: number }[];
  return count > 0;
};

// Verificar existência do CPF
export const buscarResponsavelPorCpf = async (cpf: string): Promise<Responsavel | null> => {
  const query = "SELECT * FROM responsavel WHERE cpf = ?";
  const [rows] = await pool.query<RowDataPacket[]>(query, [cpf]);
  return rows.length > 0 ? (rows[0] as Responsavel) : null;
};