import { RowDataPacket } from "mysql2";
import { pool } from "../database";
import { Professor } from "../types";

export const buscarTodosProfessores = async (): Promise<Professor[]> => {
  const query = "SELECT * FROM professor";
  const [professores] = await pool.query<RowDataPacket[]>(query);
  return professores as Professor[];
};

export const buscarProfessorPorCPF = async (cpf: string): Promise<Professor | null> => {
  const query = "SELECT * FROM professor WHERE cpf = ?";
  const [professor] = await pool.query<RowDataPacket[]>(query, [cpf]);
  return professor.length > 0 ? (professor[0] as Professor) : null;
};