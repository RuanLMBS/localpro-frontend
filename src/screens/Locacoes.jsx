import { useState, useEffect } from 'react'
import { Topbar, Badge, Icon } from '../components/ui'
import api from '../services/api'

const TABS = ['Todas', 'No prazo', 'Atrasadas']

export default function Locacoes({ onAction }) {
  const [locacoes, setLocacoes] = useState([])
  const [tab, setTab] = useState('Todas')
  const [q, setQ] = useState('')

  useEffect(() => {
    api.get('/locacoes/ativas').then(res => setLocacoes(res.data))
  }, [])

  const getPrazo = (dataDevolucao) => {
    const hoje = new Date();
    const data = new Date(dataDevolucao);
    if (data < hoje) return { label: 'Atrasado', color: 'red' };
    return { label: 'No prazo', color: 'green' };
  }

  const list = locacoes.filter((loc) => {
    const p = getPrazo(loc.data_prevista_devolucao)
    const okT = tab === 'Todas' || (tab === 'Atrasadas' ? p.color === 'red' : p.color === 'green')
    const okQ = !q || loc.equipamento?.nome?.toLowerCase().includes(q.toLowerCase())
    return okT && okQ
  })

  return (
    <div className="main">
      <Topbar title="Locações ativas" subtitle="Acompanhe prazos e devoluções em aberto">
        <div className="search">
          <Icon.search width={17} height={17} />
          <input placeholder="Buscar…" value={q} onChange={(e) => setQ(e.target.value)} />
        </div>
        <button className="btn primary"><Icon.plus width={16} height={16} /> Nova locação</button>
      </Topbar>
      
      <div className="content">
        <div className="panel">
          <div className="panel-head">
            <div className="tabs">
              {TABS.map((tt) => (
                <button key={tt} className={`tab ${tab === tt ? 'active' : ''}`} onClick={() => setTab(tt)}>{tt}</button>
              ))}
            </div>
            <div className="grow" />
            <button className="sort-btn"><Icon.sort width={15} height={15} /> Ordenar</button>
          </div>
          
          <table className="table">
            <thead>
              <tr><th>Equipamento</th><th>Cliente</th><th>Saída</th><th>Devolução</th><th>Prazo</th><th className="right">Ações</th></tr>
            </thead>
            <tbody>
              {list.map((loc) => {
                const p = getPrazo(loc.data_prevista_devolucao)
                return (
                  <tr key={loc.id}>
                    <td>
                      <div className="cell-strong">{loc.equipamento?.nome || `ID: ${loc.equipamento_id}`}</div>
                      <div className="cell-sub">#{loc.equipamento?.numero_patrimonio || '---'}</div>
                    </td>
                    <td>{loc.cliente?.nome_razao_social || `ID: ${loc.cliente_id}`}</td>
                    <td>{new Date(loc.data_saida).toLocaleDateString()}</td>
                    <td>{new Date(loc.data_prevista_devolucao).toLocaleDateString()}</td>
                    <td><Badge label={p.label} color={p.color} /></td>
                    <td className="right">
                      <button className="btn sm primary" onClick={() => onAction('checkin', loc)}>Check-in</button>
                    </td>
                  </tr>
                )
              })}
              {list.length === 0 && <tr><td colSpan={6}><div className="empty">Nenhuma locação encontrada.</div></td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}