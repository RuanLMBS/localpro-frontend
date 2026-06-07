import { STATUS_COLOR } from '../data'
import avatar from '../avatar'

/* ---------- Logo ---------- */
export function LogoMark({ size = 30 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" aria-hidden>
      <defs>
        <linearGradient id="locapro-lg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#A78BFA" />
          <stop offset="1" stopColor="#6D28D9" />
        </linearGradient>
      </defs>
      <rect width="32" height="32" rx="9" fill="url(#locapro-lg)" />
      <rect x="9.5" y="9.5" width="13" height="13" rx="3" stroke="#fff" strokeWidth="2" />
      <line x1="9.5" y1="14.5" x2="22.5" y2="14.5" stroke="#fff" strokeWidth="2" />
    </svg>
  )
}
export function Logo({ size = 30 }) {
  return (
    <div className="brand">
      <LogoMark size={size} />
      <span className="name">LocaPro</span>
    </div>
  )
}

/* ---------- Icons ---------- */
const I = (p) => ({ width: 18, height: 18, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.8, strokeLinecap: 'round', strokeLinejoin: 'round', ...p })
export const Icon = {
  box: (p) => <svg {...I(p)}><path d="M21 8 12 3 3 8v8l9 5 9-5V8Z" /><path d="m3 8 9 5 9-5M12 13v8" /></svg>,
  users: (p) => <svg {...I(p)}><circle cx="9" cy="8" r="3.2" /><path d="M3 20c0-3 2.7-5 6-5s6 2 6 5M16 11a3 3 0 1 0 0-6M21 20c0-2.3-1.2-3.7-3-4.4" /></svg>,
  clip: (p) => <svg {...I(p)}><rect x="5" y="4" width="14" height="17" rx="2" /><path d="M9 4V2h6v2M9 11h6M9 15h6" /></svg>,
  wrench: (p) => <svg {...I(p)}><path d="M14.7 6.3a4 4 0 0 0-5.4 5l-6 6 2.4 2.4 6-6a4 4 0 0 0 5-5.4l-2.3 2.3-2.1-2.1 2.4-2.2Z" /></svg>,
  chart: (p) => <svg {...I(p)}><path d="M4 20V10M10 20V4M16 20v-7M22 20H2" /></svg>,
  search: (p) => <svg {...I(p)}><circle cx="11" cy="11" r="7" /><path d="m20 20-3-3" /></svg>,
  plus: (p) => <svg {...I(p)}><path d="M12 5v14M5 12h14" /></svg>,
  chevron: (p) => <svg {...I(p)}><path d="m6 9 6 6 6-6" /></svg>,
  check: (p) => <svg {...I({ strokeWidth: 2.4, ...p })}><path d="M20 6 9 17l-5-5" /></svg>,
  back: (p) => <svg {...I(p)}><path d="m15 18-6-6 6-6" /></svg>,
  sort: (p) => <svg {...I(p)}><path d="M11 5h10M11 9h7M11 13h4M3 17l3 3 3-3M6 6v14" /></svg>,
  x: (p) => <svg {...I(p)}><path d="M18 6 6 18M6 6l12 12" /></svg>,
}

/* ---------- Badge ---------- */
export function Badge({ label, color = 'muted' }) {
  return <span className={`badge ${color}`}><span className="bdot" />{label}</span>
}
export function StatusBadge({ status }) {
  return <Badge label={status} color={STATUS_COLOR[status] || 'muted'} />
}

/* ---------- Fields ---------- */
export function Field({ label, ...rest }) {
  return (
    <div className="field">
      {label && <label>{label}</label>}
      <input className="input" {...rest} />
    </div>
  )
}
export function Select({ label, value, placeholder, onClick }) {
  return (
    <div className="field">
      {label && <label>{label}</label>}
      <button type="button" className={`selectbox ${value ? '' : 'placeholder'}`} onClick={onClick}>
        {value || placeholder}
        <Icon.chevron width={16} height={16} />
      </button>
    </div>
  )
}

/* ---------- Modal ---------- */
export function Modal({ title, subtitle, children, footer, onClose }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-head">
          <div>
            <h3>{title}</h3>
            {subtitle && <p>{subtitle}</p>}
          </div>
          <button className="modal-close" onClick={onClose} aria-label="Fechar"><Icon.x width={18} height={18} /></button>
        </div>
        <div className="modal-body">{children}</div>
        {footer && <div className="modal-foot">{footer}</div>}
      </div>
    </div>
  )
}

export function NativeSelect({ label, value, onChange, placeholder, options }) {
  return (
    <div className="field">
      {label && <label>{label}</label>}
      <select className={`nselect ${value ? '' : 'placeholder'}`} value={value} onChange={onChange}>
        {placeholder && <option value="" disabled>{placeholder}</option>}
        {options.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  )
}

/* ---------- Sidebar ---------- */
const NAV = [
  { key: 'dashboard', label: 'Dashboard' },
  { key: 'inventario', label: 'Inventário' },
  { key: 'clientes', label: 'Clientes' },
  { key: 'locacoes', label: 'Locações' },
  { key: 'manutencao', label: 'Manutenção' },
  { key: 'relatorios', label: 'Relatórios' },
]
export function Sidebar({ active, onNav }) {
  return (
    <aside className="sidebar">
      <Logo size={30} />
      <div className="nav-label">Principal</div>
      <nav className="nav">
        {NAV.map((n) => (
          <button key={n.key} className={`nav-item ${active === n.key ? 'active' : ''}`} onClick={() => onNav(n.key)}>
            <span className="nav-dot" />
            {n.label}
          </button>
        ))}
      </nav>
      <div className="nav-spacer" />
      <div className="user-card">
        <div className="av" style={{ backgroundImage: `url(${avatar})` }} />
        <div>
          <div className="nm">Louise Suarez</div>
          <div className="rl">Gestor</div>
        </div>
      </div>
    </aside>
  )
}

/* ---------- Topbar ---------- */
export function Topbar({ title, subtitle, children }) {
  return (
    <header className="topbar">
      <div className="titles">
        <h1>{title}</h1>
        {subtitle && <p>{subtitle}</p>}
      </div>
      <div className="grow" />
      {children}
    </header>
  )
}

/* ---------- KPI ---------- */
export function Kpi({ label, value, hint, color }) {
  return (
    <div className="kpi">
      <div className="top"><span className="dot" style={{ background: color }} /><span className="label">{label}</span></div>
      <div className="value">{value}</div>
      <div className="hint">{hint}</div>
    </div>
  )
}
