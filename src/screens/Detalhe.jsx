import { StatusBadge } from '../components/ui'
import { STATUS } from '../data'

function historyFor(e) {
  const first =
    e.status === STATUS.ALUGADO
      ? { ev: 'Check-out', date: e.saida, desc: `Vinculado a ${e.cliente} · devolução ${(e.devolucao || '').slice(0, 5)}`, color: 'var(--violet)' }
      : e.status === STATUS.MANUTENCAO
        ? { ev: 'Em manutenção', date: e.manutencaoDesde, desc: `${e.avaria} · bloqueado para reparo`, color: 'var(--amber)' }
        : { ev: 'Disponível', date: '24/05/2026', desc: 'Pronto para nova locação', color: 'var(--green)' }
  return [
    first,
    { ev: 'Check-in', date: '24/05/2026', desc: 'Devolvido sem avarias · status → Disponível', color: 'var(--green)' },
    { ev: 'Em manutenção', date: '10/05/2026', desc: 'Avaria detectada na inspeção · bloqueado', color: 'var(--amber)' },
    { ev: 'Check-out', date: '02/05/2026', desc: 'Vinculado a Obras Bahia Ltda', color: 'var(--violet)' },
  ]
}
function action(e) {
  if (e.status === STATUS.DISPONIVEL) return { label: 'Registrar Check-out', type: 'checkout' }
  if (e.status === STATUS.ALUGADO) return { label: 'Registrar Check-in', type: 'checkin' }
  return { label: 'Concluir reparo', type: 'concluir' }
}

export default function Detalhe({ equipamento: e, onBack, onAction }) {
  if (!e) return null
  const hist = historyFor(e)
  const act = action(e)
  return (
    <div className="main">
      <div className="content">
        <div className="breadcrumb">
          <a onClick={onBack}>Inventário</a>
          <span className="sep">/</span>
          <span className="cur">{e.nome}</span>
        </div>

        <div className="detail-head">
          <div>
            <div className="dh-title">
              <h2>{e.nome}</h2>
              <StatusBadge status={e.status} />
            </div>
            <div className="dh-sub">#{e.id} · Categoria: {e.categoria}</div>
          </div>
          <div className="dh-actions">
            <button className="btn ghost">Editar</button>
            <button className="btn primary" onClick={() => onAction(act.type, e)}>{act.label}</button>
          </div>
        </div>

        <div className="detail-grid">
          <div className="panel" style={{ padding: '6px 20px' }}>
            <div style={{ padding: '16px 0 6px' }}><p className="section-title" style={{ margin: 0 }}>Informações do ativo</p></div>
            <Kv k="Nº de patrimônio" v={e.id} />
            <Kv k="Categoria" v={e.categoria} />
            <Kv k="Valor da diária" v={`R$ ${e.diaria},00`} />
            <Kv k="Status atual" v={e.status} vc="var(--violet)" />
            {e.cliente && <Kv k="Cliente responsável" v={e.cliente} />}
            {e.saida && <Kv k="Saída em" v={e.saida} />}
            {e.devolucao && <Kv k="Devolução prevista" v={e.devolucao} vc="var(--amber)" />}
            {e.avaria && <Kv k="Avaria" v={e.avaria} vc="var(--amber)" />}
          </div>

          <div className="panel" style={{ padding: 20 }}>
            <p className="section-title">Histórico de movimentações</p>
            <div className="timeline">
              {hist.map((it, i) => (
                <div className="tl" key={i}>
                  <div className="gut">
                    <span className="d" style={{ borderColor: it.color }} />
                    {i < hist.length - 1 && <span className="ln" />}
                  </div>
                  <div className="bd">
                    <div className="tp"><span className="ev">{it.ev}</span><span className="dt">{it.date}</span></div>
                    <div className="ds">{it.desc}</div>
                  </div>
                </div>
              ))}
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
