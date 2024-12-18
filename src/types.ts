export interface Responsavel {
  cpf: string;
  nome: string;
  telefone: string;
  data_nascimento: Date;
  rg: string;
  cep: string;
  endereco: string;
  sexo: "M" | "F" | "Outro";
  email?: string | null;
}
export interface Crianca {
  id: number;
  nome: string;
  data_nascimento: Date;
  tipo_sanguineo?: string | null;
  id_doenca?: number | null;
  id_restricao?: number | null;
  id_turma?: number | null;
  cpf?: string | null;
  rg?: string | null;
  fk_cpf_responsavel: string;
  relacionamento_1: string;
  cpf_responsavel_2?: string | null;
  relacionamento_2?: string | null;
  sexo: "M" | "F" | "Outro";
}

export interface Professor {
  cpf: string;
  nome: string;
  telefone: string;
  rg: string;
  data_nascimento: Date;
  cep: string;
  endereco: string;
  sexo: "M" | "F" | "Outro";
}

export interface Turma {
  id_turma: number;
  idade_minima: number;
  idade_maxima: number;
  quantidade: number;
  cpf_professor?: string;
}

export interface Aula {
  data: Date;
  flag_presenca?: 1 | 0;
  cpf_professor: string;
  id_assunto: number;
  id_turma: number;
}

export interface Restricao {
  id_restricao: number;
  nome: string;
  tipo: string;
}

export interface Doenca {
  id_doenca: number;
  nome: string;
  tipo: string;
}
