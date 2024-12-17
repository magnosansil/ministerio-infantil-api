import { Crianca } from "../types";

export const ordenarCrianca = (crianca: Crianca): Crianca => {
  return {
    id: crianca.id,
    nome: crianca.nome,
    cpf: crianca.cpf,
    rg: crianca.rg,
    data_nascimento: crianca.data_nascimento,
    tipo_sanguineo: crianca.tipo_sanguineo,
    id_doenca: crianca.id_doenca,
    id_restricao: crianca.id_restricao,
    id_turma: crianca.id_turma,
    fk_cpf_responsavel: crianca.fk_cpf_responsavel,
    relacionamento_1: crianca.relacionamento_1,
    cpf_responsavel_2: crianca.cpf_responsavel_2,
    relacionamento_2: crianca.relacionamento_2,
    sexo: crianca.sexo,
  };
};
