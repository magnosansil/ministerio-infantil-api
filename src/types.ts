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
