import { Request, Response } from "express";
import { buscarTodasTurmas, buscarTurmaPorId } from "../database/turmaQueries";
import { buscarProfessorPorCPF } from "../database/professorQueries";
import { pool } from "../database";
import { buscarAulasPorIdTurma } from "../database/aulaQueries";

export class TurmaController {
  // Buscar Todas
  buscarTodas = async (req: Request, res: Response): Promise<Response> => {
    try {
      const professores = await buscarTodasTurmas();
      return res.status(200).json(professores);
    } catch (e) {
      console.error(e);
      return res.status(500).json({ message: "Erro ao buscar turmas." });
    }
  };
  // Buscar por ID
  buscarPorId = async (
    req: Request<{ id: number }>,
    res: Response
  ): Promise<Response> => {
    const { id } = req.params;

    try {
      const turma = await buscarTurmaPorId(id);
      if (!turma) {
        return res.status(404).json({ message: "Turma não encontrada." });
      }
      return res.status(200).json(turma);
    } catch (e) {
      console.error(`Erro ao buscar turma por ID: ${e}`);
      return res.status(500).json({ message: "Erro ao buscar turma." });
    }
  };

  //Cadastrar
  cadastrarTurma = async (req: Request, res: Response): Promise<Response> => {
    const { idade_minima, idade_maxima, quantidade, cpf_professor } = req.body;

    if (!idade_minima || !idade_maxima || !quantidade) {
      return res.status(400).json({
        message:
          "Os campos idade_minima, idade_maxima e quantidade são obrigatórios.",
      });
    }

    if (cpf_professor) {
      const professor = await buscarProfessorPorCPF(cpf_professor);
      if (!professor) {
        return res
          .status(400)
          .json({ message: "Professor com o CPF fornecido não encontrado." });
      }
    }

    try {
      const query = `
        INSERT INTO turma (idade_minima, idade_maxima, quantidade, cpf_professor)
        VALUES (?, ?, ?, ?)
      `;

      await pool.query(query, [
        idade_minima,
        idade_maxima,
        quantidade,
        cpf_professor || null,
      ]);

      return res.status(201).json({ message: "Turma cadastrada com sucesso!" });
    } catch (e) {
      console.error(`Erro ao cadastrar turma: ${e}`);
      return res.status(500).json({ message: "Erro ao cadastrar turma." });
    }
  };

  // Deletar
  deletarTurma = async (req: Request, res: Response): Promise<Response> => {
    const { id } = req.params;
    try {
      const turma = await buscarTurmaPorId(Number(id));
      if (!turma) {
        return res.status(404).json({ message: "Turma não encontrada." });
      }
      const aulasAssociadas = await buscarAulasPorIdTurma(id);
      if (aulasAssociadas.length > 0) {
        return res.status(400).json({
          error:
            "Erro ao deletar turma: Ela está associada a uma ou mais aulas.",
        });
      }
      const query = `DELETE FROM turma WHERE id_turma = ?`;

      await pool.query(query, [id]);

      return res.status(200).json({ message: "Turma deletada com sucesso!" });
    } catch (e) {
      console.error(`Erro ao deletar turma por ID: ${e}`);
      return res.status(500).json({ message: "Erro ao deletar turma." });
    }
  };

  // Atualizar
  atualizarTurma = async (
    req: Request<{ id: number }>,
    res: Response
  ): Promise<Response> => {
    const { id } = req.params;
    const { idade_minima, idade_maxima, quantidade, cpf_professor } = req.body;

    try {
      const turma = await buscarTurmaPorId(Number(id));
      if (!turma) {
        return res.status(404).json({ message: "Turma não encontrada." });
      }

      if (
        idade_minima !== undefined &&
        idade_maxima !== undefined &&
        idade_minima > idade_maxima
      ) {
        return res.status(400).json({
          message: "Idade mínima não pode ser maior que a idade máxima.",
        });
      }

      if (cpf_professor) {
        const professor = await buscarProfessorPorCPF(cpf_professor);
        if (!professor) {
          return res
            .status(400)
            .json({ message: "Professor com o CPF fornecido não encontrado." });
        }
      }

      const query = `
        UPDATE turma
        SET 
          idade_minima = COALESCE(?, idade_minima),
          idade_maxima = COALESCE(?, idade_maxima),
          quantidade = COALESCE(?, quantidade),
          cpf_professor = COALESCE(?, cpf_professor)
        WHERE id_turma = ?
      `;

      await pool.query(query, [
        idade_minima,
        idade_maxima,
        quantidade,
        cpf_professor || null,
        id,
      ]);

      return res.status(200).json({ message: "Turma atualizada com sucesso!" });
    } catch (e) {
      console.error(`Erro ao atualizar turma: ${e}`);
      return res.status(500).json({ message: "Erro ao atualizar turma." });
    }
  };
}
