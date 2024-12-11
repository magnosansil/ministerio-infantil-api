import { Request, Response } from "express";
import {
  buscarProfessorPorCPF,
  buscarTodosProfessores,
} from "../database/professorQueries";
import { pool } from "../database";
import { validarCPFProfessor, verificarCPF } from "../utils/validadores";
import { buscarTurmaPorId } from "../database/turmaQueries";
import { buscarAulasPorCpfProfessor } from "../database/aulaQueries";

export class ProfessorController {
  // Buscar todos
  buscarTodos = async (req: Request, res: Response): Promise<Response> => {
    try {
      const professores = await buscarTodosProfessores();
      return res.status(200).json(professores);
    } catch (e) {
      console.error(e);
      return res.status(500).json({ message: "Erro ao buscar professores." });
    }
  };

  // Buscar por CPF
  buscarPorCPF = async (
    req: Request<{ cpf: string }>,
    res: Response
  ): Promise<Response> => {
    const { cpf } = req.params;
    if (!verificarCPF(cpf, res)) return res;

    try {
      const professor = await buscarProfessorPorCPF(cpf);
      if (!professor) {
        return res.status(404).json({ message: "Professor não encontrado." });
      }
      return res.status(200).json(professor);
    } catch (e) {
      console.error(`Erro ao buscar professor por CPF: ${e}`);
      return res.status(500).json({ message: "Erro ao buscar professor." });
    }
  };

  // Cadastrar
  cadastrarProfessor = async (
    req: Request,
    res: Response
  ): Promise<Response> => {
    const {
      cpf,
      nome,
      telefone,
      rg,
      sexo,
      cep,
      endereco,
      data_nascimento,
      id_turma,
    } = req.body;

    if (!verificarCPF(cpf, res)) return res;

    if (!(await validarCPFProfessor(cpf, res))) return res;

    if (id_turma) {
      const turma = await buscarTurmaPorId(id_turma);
      if (!turma) {
        return res.status(400).json({ message: "Turma não encontrada." });
      }
    }

    if (
      !cpf ||
      !nome ||
      !telefone ||
      !rg ||
      !sexo ||
      !cep ||
      !endereco ||
      !data_nascimento
    ) {
      return res.status(400).json({ message: "Campos obrigatórios ausentes." });
    }

    try {
      const query = `
      INSERT INTO professor (cpf, nome, telefone, rg, sexo, cep, endereco, data_nascimento, id_turma)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

      await pool.query(query, [
        cpf,
        nome,
        telefone,
        rg,
        sexo,
        cep,
        endereco,
        data_nascimento,
        id_turma || null,
      ]);

      return res
        .status(201)
        .json({ message: "Professor cadastrado com sucesso!" });
    } catch (e: any) {
      console.error(`Erro ao cadastrar professor: ${e}`);
      return res.status(e.code === "ER_DUP_ENTRY" ? 409 : 500).json({
        error:
          e.code === "ER_DUP_ENTRY"
            ? "CPF já cadastrado."
            : "Erro ao cadastrar professor.",
      });
    }
  };

  // Deletar
  deletarProfessor = async (
    req: Request<{ cpf: string }>,
    res: Response
  ): Promise<Response> => {
    const { cpf } = req.params;

    if (!verificarCPF(cpf, res)) return res;

    try {
      const professor = await buscarProfessorPorCPF(cpf);
      if (!professor) {
        return res.status(404).json({ message: "Professor não encontrado." });
      }
      const aulasAssociadas = await buscarAulasPorCpfProfessor(cpf);
      if (aulasAssociadas.length > 0) {
        return res.status(400).json({
          error:
            "Erro ao deletar professor: Ele está associado a uma ou mais aulas.",
        });
      }
      const query = `DELETE FROM professor WHERE cpf = ?`;

      await pool.query(query, [cpf]);

      return res
        .status(200)
        .json({ message: "Professor deletado com sucesso!" });
    } catch (e) {
      console.error(`Erro ao deletar professor por CPF: ${e}`);
      return res.status(500).json({ message: "Erro ao deletar professor." });
    }
  };

  // Atualizar
  atualizarProfessor = async (
    req: Request<{ cpf: string }>,
    res: Response
  ): Promise<Response> => {
    const { cpf } = req.params;
    const {
      nome,
      telefone,
      rg,
      sexo,
      cep,
      endereco,
      data_nascimento,
      id_turma,
    } = req.body;

    if (!verificarCPF(cpf, res)) return res;

    try {
      const professor = await buscarProfessorPorCPF(cpf);
      if (!professor) {
        return res.status(404).json({ message: "Professor não encontrado." });
      }

      if (id_turma) {
        const turma = await buscarTurmaPorId(id_turma);
        if (!turma) {
          return res.status(400).json({ message: "Turma não encontrada." });
        }
      }

      const query = `
      UPDATE professor
      SET
        nome = ?, telefone = ?, rg = ?, sexo = ?, cep = ?, endereco = ?, data_nascimento = ?, id_turma = ?
      WHERE cpf = ?
    `;

      await pool.query(query, [
        nome || professor.nome,
        telefone || professor.telefone,
        rg || professor.rg,
        sexo || professor.sexo,
        cep || professor.cep,
        endereco || professor.endereco,
        data_nascimento || professor.data_nascimento,
        id_turma || professor.id_turma,
        cpf,
      ]);

      return res
        .status(200)
        .json({ message: "Professor atualizado com sucesso!" });
    } catch (e) {
      console.error(`Erro ao atualizar professor: ${e}`);
      return res.status(500).json({ message: "Erro ao atualizar professor." });
    }
  };
}
