import { Request, Response } from "express";
import { buscarTodasCriancas } from "../database/criancaQueries";
import { Crianca } from "../types";
import { pool } from "../database";
import { verificarExistenciaResponsavel } from "../database/criancaQueries";
import {
  validarCPFDaCrianca,
  validarDoenca,
  validarRestricao,
  validarTurma,
} from "../utils/validadores";

export class CriancaController {
  // Buscar todas
  buscarTodas = async (req: Request, res: Response): Promise<Response> => {
    try {
      const criancas = await buscarTodasCriancas();
      return res.status(200).json(criancas);
    } catch (e) {
      console.error(`Erro ao buscar crianças: ${e}`);
      return res.status(500).json({ message: "Erro ao buscar crianças." });
    }
  };

  // Cadastrar
  cadastrarCrianca = async (
    req: Request<{}, {}, Partial<Crianca>>,
    res: Response
  ): Promise<Response> => {
    const {
      nome,
      data_nascimento,
      tipo_sanguineo,
      id_doenca,
      id_restricao,
      id_turma,
      cpf,
      rg,
      fk_cpf_responsavel,
      relacionamento_1,
      cpf_responsavel_2,
      relacionamento_2,
      sexo,
    } = req.body;

    // Validação de campos obrigatórios
    if (
      !nome ||
      !data_nascimento ||
      !fk_cpf_responsavel ||
      !relacionamento_1 ||
      !sexo
    ) {
      return res.status(400).json({ error: "Campos obrigatórios ausentes." });
    }

    const responsavel1Existe = await verificarExistenciaResponsavel(
      fk_cpf_responsavel
    );
    if (!responsavel1Existe) {
      return res
        .status(400)
        .json({
          error: "O primeiro responsável informado não existe no sistema.",
        });
    }

    if (cpf_responsavel_2) {
      const responsavel2Existe = await verificarExistenciaResponsavel(
        cpf_responsavel_2
      );
      if (!responsavel2Existe) {
        return res
          .status(400)
          .json({
            error: "O segundo responsável informado não existe no sistema.",
          });
      }
    }

    if (id_doenca && !(await validarDoenca(id_doenca, res))) return res;
    if (id_restricao && !(await validarRestricao(id_restricao, res)))
      return res;
    if (cpf && !validarCPFDaCrianca(cpf, res)) return res;
    if (id_turma && !(await validarTurma(id_turma, res))) return res;

    try {
      const query = `
        INSERT INTO crianca (nome, data_nascimento, tipo_sanguineo, id_doenca, id_restricao, id_turma, cpf, rg, fk_cpf_responsavel, relacionamento_1, cpf_responsavel_2, relacionamento_2, sexo)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;
      await pool.query(query, [
        nome,
        data_nascimento,
        tipo_sanguineo,
        id_doenca || null,
        id_restricao || null,
        id_turma || null,
        cpf || null,
        rg || null,
        fk_cpf_responsavel,
        relacionamento_1,
        cpf_responsavel_2 || null,
        relacionamento_2 || null,
        sexo,
      ]);

      return res
        .status(201)
        .json({ message: "Criança cadastrada com sucesso!" });
    } catch (e) {
      return res.status(500).json({ message: "Erro ao cadastrar criança." });
    }
  };
}
