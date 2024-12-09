import { RowDataPacket } from "mysql2";
import { pool } from "../database";
import { Aula } from "../types";

export const buscarAulasPorCpfProfessor = async (cpf: string): Promise<Aula[]> => {
  const query = "SELECT * FROM aula WHERE cpf_professor = ?";
  const [rows] = await pool.query<RowDataPacket[]>(query, [cpf]);
  return rows as Aula[];
};