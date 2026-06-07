import { useState, useEffect } from 'react'
import { Topbar, Badge, Icon } from '../components/ui'
import api from '../services/api' // Nosso canal de comunicação com o backend

const TABS = ['Todos', 'Ativos', 'Inativos']

export default function Clientes() {
  const [clientesAPI, setClientesAPI] = useState([])
  
  const [tab, setTab] = useState('Todos')
  const [q, setQ] = useState('')

  useEffect(() => {
    async function carregarClientes() {
      try {
        const response = await api.get('/clientes/');
        setClientesAPI(response.data);
      } catch (error) {
        console.error("Erro ao buscar clientes:", error);
        alert("Erro ao carregar a lista de clientes.");
      }
    }
    carregarClientes();
  }, []); 

  const list = clientesAPI.filter((c) => {
    const okT = tab === 'Todos' || (tab === 'Ativos' ? c.ativo : !c.ativo)
    const okQ = !q || c.nome_razao_social.toLowerCase().includes(q.toLowerCase())
    return okT && okQ
  })

  return (
    <div className="main">
      <Topbar title="Clientes" subtitle="Gerencie quem aluga seus equipamentos">
        <div className="search">
          <Icon.search width={17} height={17} />
          <input placeholder="Buscar cliente…" value={q} onChange={(e) => setQ(e.target.value)} />
        </div>
        <button className="btn primary"><Icon.plus width={16} height={16} /> Novo cliente</button>
      </Topbar>
      <div className="content">
        <div className="panel">
          <div className="panel-head">
            <div className="tabs">
              {TABS.map((tt) => (
                <button key={tt} className={`tab ${tab === tt ? 'active' : ''}`} onClick={() => setTab(tt)}>
                  {tt}
                </button>
              ))}
            </div>
            <div className="grow" />
            <button className="sort-btn"><Icon.sort width={15} height={15} /> Ordenar</button>
          </div>
          <table className="table">
            <thead>
              <tr>
                <th>Cliente</th>
                <th>Contato</th>
                <th>Equip. ativos</th>
                <th>Status</th>
                <th className="right">Ações</th>
              </tr>
            </thead>
            <tbody>
              {list.map((c) => (
                <tr key={c.id}>
                  <td>
                    <div className="cell-strong">{c.nome_razao_social}</div>
                    <div className="cell-sub">CNPJ {c.cnpj}</div>
                  </td>
                  <td>{c.telefone_contato || c.email_contato || '-'}</td>
                  <td><span className="dash">-</span></td>
                  
                  <td><Badge label={c.ativo ? 'Ativo' : 'Inativo'} color={c.ativo ? 'green' : 'muted'} /></td>
                  <td className="right"><button className="btn sm ghost">Ver</button></td>
                </tr>
              ))}
              
              {list.length === 0 && (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center', padding: '2rem', color: '#888' }}>
                    Nenhum cliente encontrado.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}