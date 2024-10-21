// Função necessária para fazer a verificação do formato de CPF e evitar que possíveis formatos fora do padrão brasileiro de CPF sejam inseridos no banco de dados.

export const validarCPF = (cpf: string): boolean => {
  // Remove caracteres não numéricos (pontos, traços)
  cpf = cpf.replace(/[^\d]+/g, "");

  // Verifica se o CPF tem 11 dígitos
  if (cpf.length !== 11) return false;

  // Verifica se todos os dígitos são iguais, o que torna o CPF inválido
  if (/^(\d)\1+$/.test(cpf)) return false;

  // Cálculo dos dígitos verificadores
  let soma;
  let resto;

  // Verifica o primeiro dígito verificador
  soma = 0;
  for (let i = 1; i <= 9; i++) {
    soma += parseInt(cpf.substring(i - 1, i)) * (11 - i);
  }
  resto = (soma * 10) % 11;
  if (resto === 10 || resto === 11) resto = 0;
  if (resto !== parseInt(cpf.substring(9, 10))) return false;

  // Verifica o segundo dígito verificador
  soma = 0;
  for (let i = 1; i <= 10; i++) {
    soma += parseInt(cpf.substring(i - 1, i)) * (12 - i);
  }
  resto = (soma * 10) % 11;
  if (resto === 10 || resto === 11) resto = 0;
  if (resto !== parseInt(cpf.substring(10, 11))) return false;

  return true;
};
