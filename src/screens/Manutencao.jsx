import { useState, useEffect } from 'react'
import { Topbar, Badge, Icon } from '../components/ui'
import api from '../services/api'

export default function Manutencao({ onAction }) {
  const [manutencoes, setManutencoes] = useState([])

  useEffect(() => {
    api.get('/manutencao/ativas')
      .then(res => setManutencoes(res.data))
      .catch(err => console.error("Erro ao carregar manutenções:", err))
  }, [])

  return (
    <div className="main">
      <Topbar title="Manutenções" subtitle="Equipamentos em reparo">
        <button className="btn primary"><Icon.plus width={16} height={16} /> Nova ordem</button>
      </Topbar>

      <div className="content">
        <div className="panel">
          <table className="table">
            <thead>
              <tr><th>Equipamento</th><th>Avaria</th><th>Entrada</th><th className="right">Ações</th></tr>
            </thead>
            <tbody>
              {manutencoes.map((m) => (
                <tr key={m.id}>
                  <td>
                    <div className="cell-strong">{m.equipamento?.nome}</div>
                    <div className="cell-sub">#{m.equipamento?.numero_patrimonio}</div>
                  </td>
                  <td>{m.descricao_avaria}</td>
                  <td>{m.data_entrada ? new Date(m.data_entrada).toLocaleDateString() : '-'}</td>
                  <td className="right">
                    <button className="btn sm ghost" onClick={() => onAction('concluir', m)}>Concluir Reparo</button>
                  </td>
                </tr>
              ))}
              {manutencoes.length === 0 && (
                <tr><td colSpan={4}><div className="empty">Nenhuma manutenção em aberto.</div></td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}