import { useState } from 'react'
import { LogoMark, Field, Icon } from '../components/ui'
import api from '../services/api'


export default function Cadastro({ onEnter, onGoLogin }) {
  const [aceito, setAceito] = useState(true)
  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [nomeLocadora, setNomeLocadora] = useState('')
  const [senha, setSenha] = useState('')
  const [confirmarSenha, setConfirmarSenha] = useState('')

  const handleCadastro = async(e) => {
    e.preventDefault()

    if (!aceito) {
      alert("É preciso aceitar os termos de uso para continuar")
      return
    }

    if (senha !== confirmarSenha) {
      alert("As senhas não são iguais!")
      return
    }

    try {
      await api.post('/auth/registrar', {
        nome: nome,
        email: email,
        nome_locadora: nomeLocadora,
        senha: senha
      })

      onGoLogin()
    } catch (error) {
      if(error.response && error.response.data) {
        alert(error.response.data.detail)
      } else {
        alert("Erro ao conectar com o servidor")
      }
      console.error(error)
    }

  }
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
        <form className="form" onSubmit={handleCadastro}>
          <div className="f-head">
            <h2>Criar sua conta</h2>
            <p>Leva menos de um minuto para começar</p>
          </div>
          
          <Field 
            label="Nome completo" 
            placeholder="Seu nome" 
            value={nome}
            onChange={(e) => setNome(e.target.value)}
          />
          <Field 
            label="E-mail" 
            type="email" 
            placeholder="voce@locadora.com.br" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Field 
            label="Nome da locadora" 
            placeholder="Ex: Andrade Locações" 
            value={nomeLocadora}
            onChange={(e) => setNomeLocadora(e.target.value)}
          />
          <div className="row2">
            <Field 
              label="Senha" 
              type="password" 
              placeholder="••••••••" 
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
            />
            <Field 
              label="Confirmar senha" 
              type="password" 
              placeholder="••••••••" 
              value={confirmarSenha}
              onChange={(e) => setConfirmarSenha(e.target.value)}
            />
          </div>
          
          <label className="check" onClick={() => setAceito((v) => !v)}>
            <span className={`box ${aceito ? 'on' : ''}`}>{aceito && <Icon.check width={12} height={12} />}</span>
            <span>Li e aceito os termos de uso e a política de privacidade.</span>
          </label>
          
          {/* CORREÇÃO 2: Botão transformado em type="submit" */}
          <button type="submit" className="btn primary block">Criar conta</button>
          
          <div className="form-foot">
            Já tem conta? <a onClick={onGoLogin}>Entrar</a>
          </div>
        </form>
      </div>
    </div>
  )
}
