import { Request, Response } from "express";
import { buscarTodasDoencas, buscarDoencaPorId } from "../database/doencaQueries";

export class DoencaController {
  // Buscar Todas
  buscarTodas = async (req: Request, res: Response): Promise<Response> => {
    try {
      const doencas = await buscarTodasDoencas();
      return res.status(200).json(doencas);
    } catch (e) {
      console.error(e);
      return res.status(500).json({ message: "Erro ao buscar doenças." });
    }
  };
  // Buscar por ID
  buscarPorId = async (
    req: Request<{ id: number }>,
    res: Response
  ): Promise<Response> => {
    const { id } = req.params;

    try {
      const doenca = await buscarDoencaPorId(id);
      if (!doenca) {
        return res.status(404).json({ message: "Doença não encontrada." });
      }
      return res.status(200).json(doenca);
    } catch (e) {
      console.error(`Erro ao buscar doença por ID: ${e}`);
      return res.status(500).json({ message: "Erro ao buscar doença." });
    }
  };
}