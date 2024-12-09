import { RowDataPacket } from "mysql2";
import { pool } from "../database";
import { Turma } from "../types";

export const buscarTurmaPorId = async (id: number): Promise<Turma | null> => {
  const query = "SELECT * FROM turma WHERE id_turma = ?";
  const [turma] = await pool.query<RowDataPacket[]>(query, [id]);
  return turma.length > 0 ? (turma[0] as Turma) : null; 
};