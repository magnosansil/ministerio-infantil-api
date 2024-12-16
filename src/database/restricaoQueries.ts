import { RowDataPacket } from "mysql2";
import { pool } from "../database";
import { Restricao } from "../types";

export const buscarTodasRestricoes = async (): Promise<Restricao[]> => {
  const query = "SELECT * FROM restricao";
  const [retricoes] = await pool.query<RowDataPacket[]>(query);
  return retricoes as Restricao[];
};

export const buscarRestricaoPorId = async (
  id: number
): Promise<Restricao | null> => {
  const query = "SELECT * FROM restricao WHERE id_restricao = ?";
  const [restricao] = await pool.query<RowDataPacket[]>(query, [id]);
  return restricao.length > 0 ? (restricao[0] as Restricao) : null;
};
