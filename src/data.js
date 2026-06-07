// LocaPro — dados mock e helpers de domínio.
// "Hoje" fixo para os cálculos de prazo baterem com os dados de exemplo.
export const TODAY = new Date(2026, 5, 5) // 05/06/2026

export const STATUS = {
  DISPONIVEL: 'Disponível',
  ALUGADO: 'Alugado',
  MANUTENCAO: 'Em manutenção',
}

export const STATUS_COLOR = {
  [STATUS.DISPONIVEL]: 'green',
  [STATUS.ALUGADO]: 'violet',
  [STATUS.MANUTENCAO]: 'amber',
}

export const CATEGORIAS = [
  'Construção',
  'Energia',
  'Ferramentas',
  'Acesso',
  'Pneumática',
  'Elétrica',
]

export const EQUIPAMENTOS = [
  { id: 'EQ-0142', nome: 'Betoneira 400L', categoria: 'Construção', status: STATUS.ALUGADO, cliente: 'Construtora Andrade', saida: '30/05/2026', devolucao: '12/06/2026', diaria: 85 },
  { id: 'EQ-0210', nome: 'Andaime Tubular 1,5m', categoria: 'Construção', status: STATUS.DISPONIVEL, diaria: 25 },
  { id: 'EQ-0087', nome: 'Gerador 5 kVA', categoria: 'Energia', status: STATUS.MANUTENCAO, diaria: 120, manutencaoDesde: '10/05/2026', avaria: 'Falha no motor de partida' },
  { id: 'EQ-0301', nome: 'Compactador de Solo', categoria: 'Construção', status: STATUS.ALUGADO, cliente: 'Obras Bahia Ltda', saida: '25/05/2026', devolucao: '05/06/2026', diaria: 95 },
  { id: 'EQ-0156', nome: 'Martelete Demolidor', categoria: 'Ferramentas', status: STATUS.DISPONIVEL, diaria: 45 },
  { id: 'EQ-0420', nome: 'Plataforma Elevatória', categoria: 'Acesso', status: STATUS.ALUGADO, cliente: 'Eventos Salvador', saida: '01/06/2026', devolucao: '15/06/2026', diaria: 210 },
  { id: 'EQ-0099', nome: 'Compressor de Ar', categoria: 'Pneumática', status: STATUS.DISPONIVEL, diaria: 70 },
  { id: 'EQ-0188', nome: 'Lixadeira Industrial', categoria: 'Ferramentas', status: STATUS.MANUTENCAO, diaria: 55, manutencaoDesde: '28/05/2026', avaria: 'Disco danificado · troca' },
  { id: 'EQ-0233', nome: 'Furadeira de Impacto', categoria: 'Ferramentas', status: STATUS.ALUGADO, cliente: 'Construrium S.A.', saida: '20/05/2026', devolucao: '03/06/2026', diaria: 40 },
  { id: 'EQ-0271', nome: 'Serra Circular', categoria: 'Ferramentas', status: STATUS.ALUGADO, cliente: 'Construrium S.A.', saida: '28/05/2026', devolucao: '11/06/2026', diaria: 60 },
  { id: 'EQ-0044', nome: 'Compressor Antigo', categoria: 'Pneumática', status: STATUS.MANUTENCAO, diaria: 50, manutencaoDesde: '01/06/2026', avaria: 'Vazamento de ar comprimido' },
]

export const CLIENTES = [
  { nome: 'Construtora Andrade', cnpj: '12.345.678/0001-90', contato: 'contato@andrade.com.br', ativos: 3, ativo: true },
  { nome: 'Obras Bahia Ltda', cnpj: '98.765.432/0001-21', contato: '(71) 99876-5432', ativos: 2, ativo: true },
  { nome: 'Eventos Salvador', cnpj: '45.678.912/0001-33', contato: 'financeiro@eventossa.com', ativos: 1, ativo: true },
  { nome: 'Reforma Já ME', cnpj: '33.221.144/0001-05', contato: '(71) 98123-4567', ativos: 0, ativo: false },
  { nome: 'Construrium S.A.', cnpj: '11.999.888/0001-77', contato: 'compras@construrium.com', ativos: 5, ativo: true },
]

// dd/mm/yyyy -> Date
export function parseBR(str) {
  if (!str) return null
  const [d, m, y] = str.split('/').map(Number)
  return new Date(y, m - 1, d)
}

export function formatBR(date) {
  const d = String(date.getDate()).padStart(2, '0')
  const m = String(date.getMonth() + 1).padStart(2, '0')
  return `${d}/${m}/${date.getFullYear()}`
}

function daysBetween(a, b) {
  return Math.round((a - b) / 86400000)
}

// Retorna { label, color } do prazo de uma devolução prevista.
export function prazoFor(devolucao) {
  const date = parseBR(devolucao)
  if (!date) return { label: '—', color: 'muted' }
  const diff = daysBetween(date, TODAY)
  if (diff < 0) return { label: 'Atrasado', color: 'red' }
  if (diff === 0) return { label: 'Vence hoje', color: 'amber' }
  return { label: 'No prazo', color: 'green' }
}

export function diasParado(desde) {
  const date = parseBR(desde)
  if (!date) return 0
  return Math.max(0, daysBetween(TODAY, date))
}

// KPIs derivados da lista atual de equipamentos.
export function resumo(equipamentos) {
  const by = (s) => equipamentos.filter((e) => e.status === s).length
  return {
    total: equipamentos.length,
    disponiveis: by(STATUS.DISPONIVEL),
    alugados: by(STATUS.ALUGADO),
    manutencao: by(STATUS.MANUTENCAO),
  }
}
