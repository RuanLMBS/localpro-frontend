import { useState } from 'react'
import { Topbar, Badge, Icon } from '../components/ui'
import { STATUS, prazoFor } from '../data'

const TABS = ['Todas', 'No prazo', 'Atrasadas']

export default function Locacoes({ equipamentos, onAction }) {
  const [tab, setTab] = useState('Todas')
  const alugados = equipamentos.filter((e) => e.status === STATUS.ALUGADO)
  const list = alugados.filter((e) => {
    if (tab === 'Todas') return true
    const p = prazoFor(e.devolucao)
    return tab === 'Atrasadas' ? p.color === 'red' : p.color !== 'red'
  })

  return (
    <div className="main">
      <Topbar title="Locações ativas" subtitle="Acompanhe prazos e devoluções em aberto">
        <div className="search">
          <Icon.search width={17} height={17} />
          <input placeholder="Buscar…" />
        </div>
        <button className="btn primary"><Icon.plus width={16} height={16} /> Nova locação</button>
      </Topbar>
      <div className="content">
        <div className="panel">
          <div className="panel-head">
            <div className="tabs">
              {TABS.map((tt) => <button key={tt} className={`tab ${tab === tt ? 'active' : ''}`} onClick={() => setTab(tt)}>{tt}</button>)}
            </div>
            <div className="grow" />
            <button className="sort-btn"><Icon.sort width={15} height={15} /> Ordenar</button>
          </div>
          <table className="table">
            <thead>
              <tr><th>Equipamento</th><th>Cliente</th><th>Saída</th><th>Devolução</th><th>Prazo</th><th className="right">Ações</th></tr>
            </thead>
            <tbody>
              {list.map((e) => {
                const p = prazoFor(e.devolucao)
                return (
                  <tr key={e.id}>
                    <td><div className="cell-strong">{e.nome}</div><div className="cell-sub">#{e.id}</div></td>
                    <td>{e.cliente}</td>
                    <td>{e.saida}</td>
                    <td>{e.devolucao}</td>
                    <td><Badge label={p.label} color={p.color} /></td>
                    <td className="right"><button className="btn sm primary" onClick={() => onAction('checkin', e)}>Check-in</button></td>
                  </tr>
                )
              })}
              {list.length === 0 && <tr><td colSpan={6}><div className="empty">Nenhuma locação nesta categoria.</div></td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
