import { useState } from 'react'
import { LogoMark, Field, Icon } from '../components/ui'
import api from '../services/api'

export default function Login({ onEnter, onGoCadastro }) {
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [remember, setRemember] = useState(false)

  const handleLogin = async(e) => {
    e.preventDefault();

    try {
      const formData = new URLSearchParams();
      formData.append('username', email.trim());
      formData.append('password', senha);
      
      const response = await api.post('/auth/login', formData, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }); 

      const token = response.data.access_token;
      localStorage.setItem('@LocalPro:token', token);

      onEnter()
    } catch(error) {
      alert("Email ou Senha Inválidos!")
      console.error("Erro no login: ", error)
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
          <h2>Rastreabilidade total dos seus ativos.</h2>
          <p>Saiba exatamente onde está cada equipamento, com qual cliente e em que status — sem planilha, em tempo real.</p>
        </div>
        <div className="b-foot">© 2026 LocaPro</div>
      </div>
      <div className="form-panel">
        <form className="form" onSubmit={handleLogin}>
          <div className="f-head">
            <h2>Entrar na sua conta</h2>
            <p>Acesse o painel de gestão do inventário</p>
          </div>
          <Field 
            label="E-mail" 
            type="email" 
            placeholder="voce@locadora.com.br" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required
          />
          <Field 
            label="Senha" 
            type="password" 
            placeholder="••••••••" 
            value={senha} 
            onChange={(e) => setSenha(e.target.value)} 
            required
          />
          <div className="remember-row">
            <label className="lbl" onClick={() => setRemember((v) => !v)}>
              <span className={`cbox ${remember ? 'on' : ''}`}>{remember && <Icon.check width={12} height={12} />}</span>
              Lembrar de mim
            </label>
          </div>
          <button type="submit" className="btn primary block">Entrar</button>
          <div className="form-foot">
            Ainda não tem conta? <a onClick={onGoCadastro} style={{ cursor: 'pointer' }}>Cadastre-se</a>
          </div>
        </form>
      </div>
    </div>
  )
}
