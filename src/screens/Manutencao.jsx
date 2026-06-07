import { Topbar, Badge, Icon } from '../components/ui'
import { STATUS, diasParado } from '../data'

export default function Manutencao({ equipamentos, onAction }) {
  const list = equipamentos.filter((e) => e.status === STATUS.MANUTENCAO)
  return (
    <div className="main">
      <Topbar title="Manutenção" subtitle="Ativos bloqueados aguardando reparo">
        <div className="search">
          <Icon.search width={17} height={17} />
          <input placeholder="Buscar…" />
        </div>
      </Topbar>
      <div className="content">
        <div className="panel">
          <div className="panel-head">
            <div className="tabs"><button className="tab active">Em manutenção</button></div>
            <div className="grow" />
            <button className="sort-btn"><Icon.sort width={15} height={15} /> Ordenar</button>
          </div>
          <table className="table">
            <thead>
              <tr><th>Equipamento</th><th>Avaria</th><th>Entrou em</th><th>Dias parado</th><th className="right">Ações</th></tr>
            </thead>
            <tbody>
              {list.map((e) => {
                const dias = diasParado(e.manutencaoDesde)
                return (
                  <tr key={e.id}>
                    <td><div className="cell-strong">{e.nome}</div><div className="cell-sub">#{e.id}</div></td>
                    <td>{e.avaria}</td>
                    <td>{e.manutencaoDesde}</td>
                    <td><Badge label={`${dias} dias`} color={dias > 15 ? 'red' : 'amber'} /></td>
                    <td className="right"><button className="btn sm primary" onClick={() => onAction('concluir', e)}>Concluir reparo</button></td>
                  </tr>
                )
              })}
              {list.length === 0 && <tr><td colSpan={5}><div className="empty">Nenhum equipamento em manutenção.</div></td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
