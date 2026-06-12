# LocaPro — App web/desktop (React + Vite)

Versão desktop do MVP do LocaPro: gestão de inventário de locadora com sidebar,
tabelas e fluxos de **Check-out**, **Check-in** e manutenção.

## Rodar

```bash
npm install
npm run dev
```

## Telas

- **Login / Cadastro** — layout split (painel de marca + formulário).
- **Inventário (dashboard)** — KPIs no topo, busca, filtro por status e tabela de equipamentos.
- **Detalhe do equipamento** — informações + histórico de movimentações (timeline).
- **Clientes** — tabela com CNPJ, contato, nº de equipamentos ativos e status.
- **Locações** — tabela com prazo (no prazo / vence hoje / atrasado).
- **Manutenção** — fila de reparos com dias parados.
- **Relatórios** — placeholder.
- **Modais**: Check-out, Check-in (triagem de avaria) e Novo equipamento.

## Regras de negócio

- **RN01** — só equipamentos `Disponível` vão para Check-out.
- **RN02** — Check-out exige cliente + data de devolução.
- **RN03** — a triagem do Check-in define o novo status (sem avaria → `Disponível`,
  com avaria → `Em manutenção`).

Os fluxos alteram o estado de verdade; KPIs, Locações e Manutenção recalculam sozinhos.

## Estrutura

```
src/
  App.jsx              estado global, navegação, handlers das RN
  data.js              dados mock + helpers (status, prazo, dias parados)
  styles.css           tema dark + layout desktop
  components/ui.jsx    logo, ícones, badge, campos, modal, sidebar, topbar, KPI
  screens/             Login, Cadastro, Inventario, Detalhe, Clientes,
                       Locacoes, Manutencao, Relatorios, modals
```

Dados mock em memória (sem backend). Para integrar uma API, troque `data.js` e os handlers em `App.jsx`.
