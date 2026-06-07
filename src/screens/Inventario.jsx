import { useState, useEffect } from 'react'
import { Topbar, Kpi, StatusBadge, Icon } from '../components/ui'
import api from '../services/api'

// Mantemos as constantes aqui para não depender de arquivos externos
const FILTERS = ['Todos', 'Disponível', 'Alugado', 'Em Manutenção']

function actionFor(status) {
  if (status === 'Disponível') return { label: 'Check-out', type: 'checkout', primary: true }
  if (status === 'Alugado') return { label: 'Check-in', type: 'checkin', primary: false }
  return { label: 'Concluir', type: 'concluir', primary: false }
}

export default function Inventario({ onOpenDetalhe, onAction, onNovo }) {
  const [data, setData] = useState({ total: 0, disponiveis: 0, alugados: 0, manutencao: 0, equipamentos: [] })
  const [filter, setFilter] = useState('Todos')
  const [q, setQ] = useState('')

  useEffect(() => {
    api.get('/equipamentos/resumo').then(res => setData(res.data))
  }, [])

  const list = data.equipamentos.filter((e) => {
    const okF = filter === 'Todos' || e.status_equipamento === filter
    const okQ = !q || (e.nome + e.numero_patrimonio).toLowerCase().includes(q.toLowerCase())
    return okF && okQ
  })

  return (
    <div className="main">
      <Topbar title="Inventário" subtitle="Rastreabilidade total dos seus ativos em tempo real">
        <div className="search">
          <Icon.search width={17} height={17} />
          <input placeholder="Buscar equipamento ou ID…" value={q} onChange={(e) => setQ(e.target.value)} />
        </div>
        <button className="btn primary" onClick={onNovo}><Icon.plus width={16} height={16} /> Novo equipamento</button>
      </Topbar>

      <div className="content">
        <div className="kpi-row">
          <Kpi label="Total de equipamentos" value={data.total} hint="Cadastrados na base" color="var(--blue)" />
          <Kpi label="Disponíveis" value={data.disponiveis} hint="Prontos para locação" color="var(--green)" />
          <Kpi label="Alugados" value={data.alugados} hint="Com clientes ativos" color="var(--violet)" />
          <Kpi label="Em manutenção" value={data.manutencao} hint="Bloqueados por avaria" color="var(--amber)" />
        </div>

        <div className="panel">
          <div className="panel-head">
            <div className="tabs">
              {FILTERS.map((f) => (
                <button key={f} className={`tab ${filter === f ? 'active' : ''}`} onClick={() => setFilter(f)}>{f}</button>
              ))}
            </div>
            <div className="grow" />
            <button className="sort-btn"><Icon.sort width={15} height={15} /> Ordenar</button>
          </div>
          <table className="table">
            <thead>
              <tr>
                <th>Equipamento</th><th>Categoria</th><th>Status</th><th>Cliente</th><th>Devolução</th><th className="right">Ações</th>
              </tr>
            </thead>
            <tbody>
              {list.map((e) => {
                const act = actionFor(e.status_equipamento)
                return (
                  <tr key={e.id}>
                    <td>
                      <div className="cell-name" onClick={() => onOpenDetalhe(e)}>
                        <div className="cell-strong">{e.nome}</div>
                        <div className="cell-sub">#{e.numero_patrimonio}</div>
                      </div>
                    </td>
                    <td>{e.categoria}</td>
                    <td><StatusBadge status={e.status_equipamento} /></td>
                    <td>{e.cliente || <span className="dash">—</span>}</td>
                    <td>{e.data_prevista_devolucao || <span className="dash">—</span>}</td>
                    <td className="right">
                      <button className={`btn sm ${act.primary ? 'primary' : 'ghost'}`} onClick={() => onAction(act.type, e)}>{act.label}</button>
                    </td>
                  </tr>
                )
              })}
              {list.length === 0 && (
                <tr><td colSpan={6}><div className="empty">Nenhum equipamento encontrado.</div></td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}