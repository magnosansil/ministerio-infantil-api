import { Request, Response } from "express";
import {
  buscarCriancaPorId,
  buscarTodasCriancas,
  deletarCriancaPorId,
} from "../database/criancaQueries";
import { Crianca } from "../types";
import { pool } from "../database";
import { verificarExistenciaResponsavel } from "../database/criancaQueries";
import {
  validarCPFDaCrianca,
  validarDoenca,
  validarRestricao,
  validarTurma,
} from "../utils/validadores";
import { validarCPF } from "../utils/validarCPF";

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

  // Buscar por id
  buscarPorId = async (
    req: Request<{ id: string }>,
    res: Response
  ): Promise<Response> => {
    const { id } = req.params;

    try {
      const crianca = await buscarCriancaPorId(Number(id));
      if (!crianca) {
        return res.status(404).json({ message: "Criança não encontrada." });
      }
      return res.status(200).json(crianca);
    } catch (e) {
      console.error(`Erro ao buscar criança por id: ${e}`);
      return res.status(500).json({ message: "Erro ao buscar criança." });
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
      return res.status(400).json({
        error: "O primeiro responsável informado não existe no sistema.",
      });
    }

    if (cpf_responsavel_2) {
      const responsavel2Existe = await verificarExistenciaResponsavel(
        cpf_responsavel_2
      );
      if (!responsavel2Existe) {
        return res.status(400).json({
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

  // Deletar
  deletarCrianca = async (
    req: Request<{ id: string }>,
    res: Response
  ): Promise<Response> => {
    const { id } = req.params;

    try {
      const criancaExcluida = await deletarCriancaPorId(Number(id));

      if (!criancaExcluida) {
        return res.status(404).json({ message: "Criança não encontrada." });
      }

      return res.status(200).json({ message: "Criança excluída com sucesso!" });
    } catch (e) {
      return res.status(500).json({ message: "Erro ao excluir criança." });
    }
  };

  // Atualizar
  atualizarCrianca = async (
    req: Request<{ id: string }, {}, Partial<Crianca>>,
    res: Response
  ): Promise<Response> => {
    const { id } = req.params;
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

    try {
      const crianca = await buscarCriancaPorId(Number(id));
      if (!crianca) {
        return res.status(404).json({ message: "Criança não encontrada." });
      }

      if (crianca.cpf && cpf && crianca.cpf !== cpf) {
        return res
          .status(400)
          .json({ error: "Não é permitido alterar o CPF." });
      }

      if (cpf && !crianca.cpf && !(await validarCPFDaCrianca(cpf, res))) {
        return res;
      }

      if (
        (cpf_responsavel_2 && !relacionamento_2) ||
        (!cpf_responsavel_2 && relacionamento_2)
      ) {
        return res.status(400).json({
          error:
            "Se fornecer 'cpf_responsavel_2', é obrigatório fornecer 'relacionamento_2' e vice-versa.",
        });
      }

      if (id_doenca && !(await validarDoenca(id_doenca, res))) return res;
      if (id_restricao && !(await validarRestricao(id_restricao, res)))
        return res;
      if (id_turma && !(await validarTurma(id_turma, res))) return res;

      const updates: string[] = [];
      const values: any[] = [];

      if (nome) updates.push("nome = ?"), values.push(nome);
      if (data_nascimento)
        updates.push("data_nascimento = ?"), values.push(data_nascimento);
      if (tipo_sanguineo)
        updates.push("tipo_sanguineo = ?"), values.push(tipo_sanguineo);
      if (id_doenca) updates.push("id_doenca = ?"), values.push(id_doenca);
      if (id_restricao)
        updates.push("id_restricao = ?"), values.push(id_restricao);
      if (id_turma) updates.push("id_turma = ?"), values.push(id_turma);
      if (rg) updates.push("rg = ?"), values.push(rg);
      if (fk_cpf_responsavel)
        updates.push("fk_cpf_responsavel = ?"), values.push(fk_cpf_responsavel);
      if (relacionamento_1)
        updates.push("relacionamento_1 = ?"), values.push(relacionamento_1);
      if (cpf_responsavel_2)
        updates.push("cpf_responsavel_2 = ?"), values.push(cpf_responsavel_2);
      if (relacionamento_2)
        updates.push("relacionamento_2 = ?"), values.push(relacionamento_2);
      if (sexo) updates.push("sexo = ?"), values.push(sexo);
      if (cpf !== undefined) updates.push("cpf = ?"), values.push(cpf);

      if (updates.length === 0) {
        return res.status(400).json({ error: "Nenhum campo para atualizar." });
      }

      const updateQuery = `UPDATE crianca SET ${updates.join(
        ", "
      )} WHERE id = ?`;
      values.push(id);
      await pool.query(updateQuery, values);

      return res
        .status(200)
        .json({ message: "Dados da criança atualizados com sucesso!" });
    } catch (e) {
      return res
        .status(500)
        .json({ message: "Erro ao atualizar dados da criança." });
    }
  };
}
