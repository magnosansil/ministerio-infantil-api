import { RowDataPacket } from "mysql2";
import { pool } from "../database";
import { Doenca } from "../types";

export const buscarTodasDoencas = async (): Promise<Doenca[]> => {
  const query = "SELECT * FROM doencas";
  const [doencas] = await pool.query<RowDataPacket[]>(query);
  return doencas as Doenca[];
};

export const buscarDoencaPorId = async (id: number): Promise<Doenca | null> => {
  const query = "SELECT * FROM doencas WHERE id_doenca = ?";
  const [doenca] = await pool.query<RowDataPacket[]>(query, [id]);
  return doenca.length > 0 ? (doenca[0] as Doenca) : null;
};
