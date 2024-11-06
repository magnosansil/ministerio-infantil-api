import { Request, Response } from "express";
import { Responsavel } from "../types";
import { pool } from "../database";
import {
  verificarCPF,
  validarCamposResponsavel,
  validarCPFDaResponsavel,
} from "../utils/validadores";
import {
  verificarAssociacaoComCrianca,
  buscarResponsavel,
} from "../database/responsavelQueries";

export class ResponsavelController {
  // Cadastrar
  cadastrarResponsavel = async (
    req: Request<{}, {}, Responsavel>,
    res: Response
  ): Promise<Response> => {
    const {
      cpf,
      nome,
      telefone,
      data_nascimento,
      rg,
      cep,
      endereco,
      sexo,
      email,
    } = req.body;
    if (!(await validarCPFDaResponsavel(cpf, res))) return res;

    if (!validarCamposResponsavel(req.body, res) || !verificarCPF(cpf, res))
      return res;

    try {
      const query = `
        INSERT INTO responsavel (cpf, nome, telefone, data_nascimento, rg, cep, endereco, sexo, email)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;
      await pool.query(query, [
        cpf,
        nome,
        telefone,
        data_nascimento,
        rg,
        cep,
        endereco,
        sexo,
        email,
      ]);
      return res
        .status(201)
        .json({ message: "Responsável cadastrado com sucesso!" });
    } catch (e: any) {
      return res.status(e.code === "ER_DUP_ENTRY" ? 409 : 500).json({
        error:
          e.code === "ER_DUP_ENTRY"
            ? "CPF já cadastrado."
            : "Erro ao cadastrar responsável!",
      });
    }
  };

  // Buscar todos
  buscarTodosResponsaveis = async (
    req: Request,
    res: Response
  ): Promise<Response> => {
    try {
      const [rows] = await pool.query("SELECT * FROM responsavel");
      return res.status(200).json(rows);
    } catch (e) {
      return res.status(500).json({ message: "Erro ao buscar responsáveis." });
    }
  };

  // Buscar por CPF
  buscarResponsavelPorCPF = async (
    req: Request<{ cpf: string }>,
    res: Response
  ): Promise<Response> => {
    const { cpf } = req.params;
    if (!verificarCPF(cpf, res)) return res;

    try {
      const responsavel = await buscarResponsavel(cpf);
      if (!responsavel)
        return res.status(404).json({ message: "Responsável não encontrado." });
      return res.status(200).json(responsavel);
    } catch (e) {
      return res.status(500).json({ message: "Erro ao buscar responsável." });
    }
  };

  // Excluir
  excluirResponsavel = async (
    req: Request<{ cpf: string }>,
    res: Response
  ): Promise<Response> => {
    const { cpf } = req.params;
    if (!verificarCPF(cpf, res)) return res;

    try {
      if (await verificarAssociacaoComCrianca(cpf)) {
        return res.status(400).json({
          error:
            "Não é possível excluir o responsável, pois ele está associado a uma ou mais crianças.",
        });
      }

      const query = "DELETE FROM responsavel WHERE cpf = ?";
      const [result] = await pool.query(query, [cpf]);
      return res.status((result as any).affectedRows === 0 ? 404 : 200).json({
        message:
          (result as any).affectedRows === 0
            ? "Responsável não encontrado."
            : "Responsável excluído com sucesso!",
      });
    } catch (e) {
      return res.status(500).json({ message: "Erro ao excluir responsável." });
    }
  };

  // Atualizar
  atualizarResponsavel = async (
    req: Request<{ cpf: string }, {}, Partial<Responsavel>>,
    res: Response
  ): Promise<Response> => {
    const { cpf } = req.params;
    const { nome, telefone, data_nascimento, rg, cep, endereco, sexo, email } =
      req.body;

    if (!verificarCPF(cpf, res)) return res;

    try {
      const responsavel = await buscarResponsavel(cpf);
      if (!responsavel)
        return res.status(404).json({ message: "Responsável não encontrado." });

      const updates: string[] = [];
      const values: any[] = [];

      if (nome) updates.push("nome = ?"), values.push(nome);
      if (telefone) updates.push("telefone = ?"), values.push(telefone);
      if (data_nascimento)
        updates.push("data_nascimento = ?"), values.push(data_nascimento);
      if (rg) updates.push("rg = ?"), values.push(rg);
      if (cep) updates.push("cep = ?"), values.push(cep);
      if (endereco) updates.push("endereco = ?"), values.push(endereco);
      if (sexo) updates.push("sexo = ?"), values.push(sexo);
      if (email !== undefined)
        updates.push("email = ?"), values.push(email === null ? null : email);

      if (updates.length === 0)
        return res
          .status(400)
          .json({ error: "Nenhum campo foi fornecido para atualização." });

      const updateQuery = `UPDATE responsavel SET ${updates.join(
        ", "
      )} WHERE cpf = ?`;
      values.push(cpf);
      await pool.query(updateQuery, values);
      return res
        .status(200)
        .json({ message: "Dados do responsável atualizados com sucesso!" });
    } catch (e) {
      return res
        .status(500)
        .json({ message: "Erro ao atualizar responsável." });
    }
  };
}
