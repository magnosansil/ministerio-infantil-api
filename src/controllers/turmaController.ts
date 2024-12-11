import { Request, Response } from "express";
import { buscarTodasTurmas } from "../database/turmaQueries";

export class TurmaController {
  buscarTodas = async (req: Request, res: Response): Promise<Response> => {
    try {
      const professores = await buscarTodasTurmas();
      return res.status(200).json(professores);
    } catch (e) {
      console.error(e);
      return res.status(500).json({ message: "Erro ao buscar turmas." });
    }
  };
}
