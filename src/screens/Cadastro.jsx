import { useState } from 'react'
import { LogoMark, Field, Icon } from '../components/ui'

export default function Cadastro({ onEnter, onGoLogin }) {
  const [aceito, setAceito] = useState(true)
  return (
    <div className="auth-split">
      <div className="brand-panel">
        <div className="glow" />
        <div className="b-top">
          <LogoMark size={34} />
          <span className="name">LocaPro</span>
        </div>
        <div className="b-msg">
          <h2>Comece a controlar seu inventário.</h2>
          <p>Cadastre sua locadora e tenha rastreabilidade total dos equipamentos — saídas, devoluções e status em tempo real.</p>
        </div>
        <div className="b-foot">© 2026 LocaPro</div>
      </div>
      <div className="form-panel">
        <div className="form">
          <div className="f-head">
            <h2>Criar sua conta</h2>
            <p>Leva menos de um minuto para começar</p>
          </div>
          <Field label="Nome completo" placeholder="Seu nome" />
          <Field label="E-mail" type="email" placeholder="voce@locadora.com.br" />
          <Field label="Nome da locadora" placeholder="Ex: Andrade Locações" />
          <div className="row2">
            <Field label="Senha" type="password" placeholder="••••••••" />
            <Field label="Confirmar senha" type="password" placeholder="••••••••" />
          </div>
          <label className="check" onClick={() => setAceito((v) => !v)}>
            <span className={`box ${aceito ? 'on' : ''}`}>{aceito && <Icon.check width={12} height={12} />}</span>
            <span>Li e aceito os termos de uso e a política de privacidade.</span>
          </label>
          <button className="btn primary block" onClick={onEnter}>Criar conta</button>
          <div className="form-foot">
            Já tem conta? <a onClick={onGoLogin}>Entrar</a>
          </div>
        </div>
      </div>
    </div>
  )
}
