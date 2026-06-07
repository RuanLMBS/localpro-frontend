import { Topbar, Icon } from '../components/ui'

export default function Relatorios() {
  return (
    <div className="main">
      <Topbar title="Relatórios" subtitle="Indicadores e exportações" />
      <div className="content">
        <div className="panel">
          <div className="empty" style={{ padding: 80 }}>
            <Icon.chart width={28} height={28} />
            <div style={{ marginTop: 12, fontSize: 14, color: 'var(--sub)' }}>Relatórios em breve.</div>
            <div style={{ marginTop: 4 }}>Taxa de ocupação, faturamento por equipamento e atrasos.</div>
          </div>
        </div>
      </div>
    </div>
  )
}
