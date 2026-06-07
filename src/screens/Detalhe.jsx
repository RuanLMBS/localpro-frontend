import { useState, useEffect } from 'react'
import { StatusBadge } from '../components/ui'
import api from '../services/api'

const STATUS = {
  DISPONIVEL: 'Disponível',
  ALUGADO: 'Alugado',
  MANUTENCAO: 'Em Manutenção'
};

function action(e) {
  if (e.status_equipamento === STATUS.DISPONIVEL) return { label: 'Registrar Check-out', type: 'checkout' }
  if (e.status_equipamento === STATUS.ALUGADO) return { label: 'Registrar Check-in', type: 'checkin' }
  return { label: 'Concluir reparo', type: 'concluir' }
}

export default function Detalhe({ equipamento: e, onBack, onAction }) {
  const [historico, setHistorico] = useState([])
  const [carregando, setCarregando] = useState(true)

  useEffect(() => {
    async function carregarHistorico() {
      if (!e || !e.id) return;
      
      setCarregando(true);
      try {
        const response = await api.get(`/equipamentos/${e.id}/historico`);
        setHistorico(response.data);
      } catch (error) {
        console.error("Erro ao buscar o histórico:", error);
        setHistorico([]); 
      } finally {
        setCarregando(false);
      }
    }

    carregarHistorico();
  }, [e]);
  if (!e) return null
  
  const act = action(e)
  
  return (
    <div className="main">
      <div className="content">
        <div className="breadcrumb">
          <a onClick={onBack} style={{ cursor: 'pointer' }}>Inventário</a>
          <span className="sep">/</span>
          <span className="cur">{e.nome}</span>
        </div>

        <div className="detail-head">
          <div>
            <div className="dh-title">
              <h2>{e.nome}</h2>
              <StatusBadge status={e.status_equipamento} />
            </div>
            <div className="dh-sub">Patrimônio: {e.numero_patrimonio} · Categoria: {e.categoria || 'Geral'}</div>
          </div>
          <div className="dh-actions">
            <button className="btn ghost">Editar</button>
            <button className="btn primary" onClick={() => onAction(act.type, e)}>{act.label}</button>
          </div>
        </div>

        <div className="detail-grid">
          <div className="panel" style={{ padding: '6px 20px' }}>
            <div style={{ padding: '16px 0 6px' }}><p className="section-title" style={{ margin: 0 }}>Informações do ativo</p></div>
            
            <Kv k="Nº de patrimônio" v={e.numero_patrimonio} />
            <Kv k="Categoria" v={e.categoria || 'Não definida'} />
            <Kv k="Valor da diária" v={`R$ ${e.valor_diaria}`} />
            <Kv k="Status atual" v={e.status_equipamento} vc="var(--violet)" />
            
            {e.cliente && <Kv k="Cliente responsável" v={e.cliente} />}
            {e.data_saida && <Kv k="Saída em" v={e.data_saida} />}
            {e.data_prevista_devolucao && <Kv k="Devolução prevista" v={e.data_prevista_devolucao} vc="var(--amber)" />}
            {e.descricao_avaria && <Kv k="Avaria" v={e.descricao_avaria} vc="var(--amber)" />}
          </div>

          <div className="panel" style={{ padding: 20 }}>
            <p className="section-title">Histórico de movimentações</p>
            <div className="timeline">
              {carregando ? (
                <div style={{ padding: '20px', color: '#888' }}>Carregando histórico...</div>
              ) : historico.length === 0 ? (
                <div style={{ padding: '20px', color: '#888' }}>Nenhuma movimentação registrada.</div>
              ) : (
                historico.map((it, i) => (
                  <div className="tl" key={i}>
                    <div className="gut">
                      <span className="d" style={{ borderColor: it.color }} />
                      {i < historico.length - 1 && <span className="ln" />}
                    </div>
                    <div className="bd">
                      <div className="tp"><span className="ev">{it.ev}</span><span className="dt">{it.date}</span></div>
                      <div className="ds">{it.desc}</div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function Kv({ k, v, vc }) {
  return <div className="kv"><span className="k">{k}</span><span className="v" style={vc ? { color: vc } : undefined}>{v}</span></div>
}