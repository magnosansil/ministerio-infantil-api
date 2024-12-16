import { Request, Response } from "express";
import { buscarTodasRestricoes, buscarRestricaoPorId } from "../database/restricaoQueries";

export class RestricaoController {
  // Buscar Todas
  buscarTodas = async (req: Request, res: Response): Promise<Response> => {
    try {
      const restricoes = await buscarTodasRestricoes();
      return res.status(200).json(restricoes);
    } catch (e) {
      console.error(e);
      return res.status(500).json({ message: "Erro ao buscar restrições." });
    }
  };
  // Buscar por ID
  buscarPorId = async (
    req: Request<{ id: number }>,
    res: Response
  ): Promise<Response> => {
    const { id } = req.params;

    try {
      const restricao = await buscarRestricaoPorId(id);
      if (!restricao) {
        return res.status(404).json({ message: "Restrição não encontrada." });
      }
      return res.status(200).json(restricao);
    } catch (e) {
      console.error(`Erro ao buscar doença por ID: ${e}`);
      return res.status(500).json({ message: "Erro ao buscar restrições." });
    }
  };
}