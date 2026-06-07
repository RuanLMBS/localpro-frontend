import { useState } from 'react'
import { Modal, Field, NativeSelect, StatusBadge, Badge } from '../components/ui'
import { STATUS, CATEGORIAS, CLIENTES } from '../data'

function isoToBR(iso) {
  if (!iso) return ''
  const [y, m, d] = iso.split('-')
  return `${d}/${m}/${y}`
}

export function CheckOutModal({ item, onClose, onConfirm }) {
  const [cliente, setCliente] = useState('')
  const [data, setData] = useState('')
  const ready = cliente && data
  return (
    <Modal title="Check-out — Saída de equipamento" subtitle="Vincule o ativo a um cliente e defina a devolução" onClose={onClose}
      footer={<>
        <button className="btn ghost" onClick={onClose}>Cancelar</button>
        <button className="btn primary" disabled={!ready} style={ready ? {} : { opacity: .5 }} onClick={() => onConfirm(item.id, { cliente, devolucao: isoToBR(data) })}>Confirmar check-out</button>
      </>}>
      <div className="field"><label>Equipamento</label></div>
      <div className="eqbox">
        <div><div className="nm">{item.nome}</div><div className="id">#{item.id}</div></div>
        <StatusBadge status={STATUS.DISPONIVEL} />
      </div>
      <p className="note">Apenas equipamentos com status “Disponível” podem sair (RN01).</p>
      <NativeSelect label="Cliente" value={cliente} onChange={(e) => setCliente(e.target.value)} placeholder="Selecione o cliente" options={CLIENTES.filter((c) => c.ativo).map((c) => c.nome)} />
      <Field label="Data prevista de devolução" type="date" value={data} onChange={(e) => setData(e.target.value)} />
      <p className="note">Cliente e data de devolução são obrigatórios (RN02).</p>
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
        <button className="btn primary" onClick={() => onConfirm(item.id, { comAvaria: avaria, avaria: obs })}>Confirmar devolução</button>
      </>}>
      <div className="field"><label>Equipamento</label></div>
      <div className="eqbox">
        <div><div className="nm">{item.nome}</div><div className="id">#{item.id}</div></div>
        <StatusBadge status={STATUS.ALUGADO} />
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
      <p className="note">A triagem define o novo status do ativo (RN03).</p>
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
          onClick={() => onConfirm({ nome, categoria: cat, id: pat || `EQ-${Math.floor(1000 + Math.random() * 9000)}`, diaria: Number(diaria) || 0 })}>Cadastrar equipamento</button>
      </>}>
      <Field label="Nome do equipamento" placeholder="Ex: Betoneira 400L" value={nome} onChange={(e) => setNome(e.target.value)} />
      <NativeSelect label="Categoria" value={cat} onChange={(e) => setCat(e.target.value)} placeholder="Selecione a categoria" options={CATEGORIAS} />
      <div className="row2">
        <Field label="Nº de patrimônio" placeholder="EQ-0000" value={pat} onChange={(e) => setPat(e.target.value)} />
        <Field label="Valor da diária (R$)" placeholder="0,00" inputMode="numeric" value={diaria} onChange={(e) => setDiaria(e.target.value)} />
      </div>
      <div className="field"><label>Status inicial</label><div><Badge label="Disponível" color="green" /></div></div>
    </Modal>
  )
}
