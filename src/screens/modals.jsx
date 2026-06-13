import { useState, useEffect } from 'react'
import { Modal, Field, NativeSelect, StatusBadge, Badge } from '../components/ui'
import api from '../services/api'

const CATEGORIAS_FIXAS = ['Projetor','Tela de Projeção','Notebook','Mini PC','Geral']

export function CheckOutModal({ item, onClose, onConfirm }) {
  const [clientes, setClientes] = useState([]);
  const [clienteId, setClienteId] = useState('');
  const [data, setData] = useState('');

  useEffect(() => {
    api.get('/clientes/')
       .then(res => setClientes(res.data.filter(c => c.ativo)))
       .catch(err => console.error("Erro ao buscar clientes", err));
  }, []);

  const ready = clienteId && data;

  return (
    <Modal title="Check-out — Saída de equipamento" subtitle="Vincule o ativo a um cliente e defina a devolução" onClose={onClose}
      footer={<>
        <button className="btn ghost" onClick={onClose}>Cancelar</button>
        <button className="btn primary" disabled={!ready} style={ready ? {} : { opacity: .5 }} onClick={() => onConfirm(item.id, { cliente_id: clienteId, data_prevista_devolucao: data })}>Confirmar check-out</button>
      </>}>
      <div className="field"><label>Equipamento</label></div>
      <div className="eqbox">
        <div><div className="nm">{item.nome}</div><div className="id">#{item.numero_patrimonio || item.id}</div></div>
        <StatusBadge status="Disponível" />
      </div>
      <p className="note">Apenas equipamentos com status “Disponível” podem sair.</p>

      <div className="field">
        <label>Cliente</label>
        <select 
          className={`nselect ${clienteId ? '' : 'placeholder'}`} 
          value={clienteId} 
          onChange={(e) => setClienteId(e.target.value)}
        >
          <option value="" disabled>Selecione o cliente</option>
          {clientes.map(c => (
            <option key={c.id} value={c.id}>{c.nome_razao_social}</option>
          ))}
        </select>
      </div>
      
      <Field label="Data prevista de devolução" type="date" value={data} onChange={(e) => setData(e.target.value)} />
      <p className="note">Cliente e data de devolução são obrigatórios.</p>
    </Modal>
  )
}

export function CheckInModal({ item, onClose, onConfirm }) {
  const [avaria, setAvaria] = useState(false)
  const [obs, setObs] = useState('')
  
  return (
    <Modal title="Check-in — Devolução de equipamento" subtitle="Faça a triagem de avarias para definir o novo status" onClose={onClose}
      footer={<>
        <button className="btn ghost" onClick={onClose}>Cancelar</button>
        <button 
            className="btn primary" 
            onClick={() => onConfirm((item.locacao_id || item.id), { com_avaria: avaria, descricao_avaria: obs })}
          >
        Confirmar devolução
      </button>
      </>}>
      <div className="field"><label>Equipamento</label></div>
      <div className="eqbox">
        <div><div className="nm">{item.equipamento?.nome || item.nome}</div><div className="id">#{item.equipamento?.numero_patrimonio || item.numero_patrimonio}</div></div>
        <StatusBadge status="Alugado" />
      </div>
      <div className="field"><label>O equipamento apresenta avaria?</label></div>
      <div className={`option ${!avaria ? 'on' : ''}`} onClick={() => setAvaria(false)}>
        <span className="radio" />
        <div className="t"><div className="tt">Sem avarias</div><div className="dd">Retorna direto ao estoque ativo</div></div>
        <Badge label="Disponível" color="green" />
      </div>
      <div className={`option ${avaria ? 'on' : ''}`} onClick={() => setAvaria(true)}>
        <span className="radio" />
        <div className="t"><div className="tt">Com avaria detectada</div><div className="dd">Bloqueia o item para reparo</div></div>
        <Badge label="Em manutenção" color="amber" />
      </div>
      <p className="note">A triagem define o novo status do ativo.</p>
      <Field label="Observações (opcional)" placeholder="Descreva o estado do equipamento…" value={obs} onChange={(e) => setObs(e.target.value)} />
    </Modal>
  )
}

export function NovoEquipamentoModal({ onClose, onConfirm }) {
  const [nome, setNome] = useState('')
  const [cat, setCat] = useState('')
  const [pat, setPat] = useState('')
  const [diaria, setDiaria] = useState('')
  
  const ready = nome && cat
  
  return (
    <Modal title="Novo equipamento" subtitle="Cadastre um ativo no inventário" onClose={onClose}
      footer={<>
        <button className="btn ghost" onClick={onClose}>Cancelar</button>
        <button className="btn primary" disabled={!ready} style={ready ? {} : { opacity: .5 }}
          onClick={() => onConfirm({ 
            nome: nome, 
            categoria: cat, 
            numero_patrimonio: pat || `EQ-${Math.floor(1000 + Math.random() * 9000)}`, 
            valor_diaria: Number(diaria) || 0 
          })}>Cadastrar equipamento</button>
      </>}>
      <Field label="Nome do equipamento" placeholder="Ex: Projetor" value={nome} onChange={(e) => setNome(e.target.value)} />
      <NativeSelect label="Categoria" value={cat} onChange={(e) => setCat(e.target.value)} placeholder="Selecione a categoria" options={CATEGORIAS_FIXAS} />
      <div className="row2">
        <Field label="Nº de patrimônio" placeholder="EQ-0000" value={pat} onChange={(e) => setPat(e.target.value)} />
        <Field label="Valor da diária (R$)" placeholder="0,00" inputMode="numeric" value={diaria} onChange={(e) => setDiaria(e.target.value)} />
      </div>
      <div className="field"><label>Status inicial</label><div><Badge label="Disponível" color="green" /></div></div>
    </Modal>
  )
}

export function NovoClienteModal({ onClose, onConfirm }) {
  const [nome, setNome] = useState('')
  const [cnpj, setCnpj] = useState('')
  const [email, setEmail] = useState('')
  const [telefone, setTelefone] = useState('')
  
  const ready = nome && cnpj
  
  return (
    <Modal title="Novo cliente" subtitle="Cadastre uma nova empresa ou pessoa para locação" onClose={onClose}
      footer={<>
        <button className="btn ghost" onClick={onClose}>Cancelar</button>
        <button className="btn primary" disabled={!ready} style={ready ? {} : { opacity: .5 }}
          onClick={() => onConfirm({ 
            nome_razao_social: nome, 
            cnpj: cnpj, 
            email_contato: email, 
            telefone_contato: telefone,
            ativo: true
          })}>Cadastrar cliente</button>
      </>}>
      
      <Field label="Nome ou Razão Social" placeholder="Ex: Construtora Silva" value={nome} onChange={(e) => setNome(e.target.value)} />
      <Field label="CNPJ" placeholder="00.000.000/0000-00" value={cnpj} onChange={(e) => setCnpj(e.target.value)} />
      
      <div className="row2">
        <Field label="E-mail" type="email" placeholder="contato@empresa.com" value={email} onChange={(e) => setEmail(e.target.value)} />
        <Field label="Telefone" placeholder="(00) 00000-0000" value={telefone} onChange={(e) => setTelefone(e.target.value)} />
      </div>
    </Modal>
  )
}

export function VerClienteModal({ item, onClose }) {
  if (!item) return null;

  return (
    <Modal 
      title="Detalhes do Cliente" 
      subtitle="Informações de cadastro e contato" 
      onClose={onClose}
      footer={
        <button className="btn ghost" onClick={onClose}>
          Fechar
        </button>
      }
    >
      {/* Container simples para agrupar as informações */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        
        <div>
          <div className="field"><label>Nome / Razão Social</label></div>
          <div style={{ fontSize: '1.1rem', fontWeight: '500' }}>{item.nome_razao_social}</div>
        </div>

        <div>
          <div className="field"><label>CNPJ</label></div>
          <div>{item.cnpj}</div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div>
            <div className="field"><label>Email</label></div>
            <div>{item.email_contato || '-'}</div>
          </div>
          <div>
            <div className="field"><label>Telefone</label></div>
            <div>{item.telefone_contato || '-'}</div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div>
            <div className="field"><label>Status</label></div>
            <Badge label={item.ativo ? 'Ativo' : 'Inativo'} color={item.ativo ? 'green' : 'muted'} />
          </div>
          <div>
            <div className="field"><label>Equipamentos Alugados</label></div>
            <div style={{ fontWeight: '600' }}>{item.equipamentos_ativos || 0} unidades</div>
          </div>
        </div>

      </div>
    </Modal>
  )
}