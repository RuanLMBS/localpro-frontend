import { useState } from 'react'
import { Sidebar } from './components/ui'
import { EQUIPAMENTOS, CLIENTES, STATUS, TODAY, formatBR } from './data'
import Login from './screens/Login'
import Cadastro from './screens/Cadastro'
import Inventario from './screens/Inventario'
import Detalhe from './screens/Detalhe'
import Clientes from './screens/Clientes'
import Locacoes from './screens/Locacoes'
import Manutencao from './screens/Manutencao'
import Relatorios from './screens/Relatorios'
import { CheckOutModal, CheckInModal, NovoEquipamentoModal } from './screens/modals'

export default function App() {
  const [auth, setAuth] = useState('login') // 'login' | 'cadastro' | null
  const [route, setRoute] = useState('inventario')
  const [detailId, setDetailId] = useState(null)
  const [modal, setModal] = useState(null) // { type, item }
  const [equip, setEquip] = useState(EQUIPAMENTOS)

  const today = formatBR(TODAY)
  const update = (id, patch) => setEquip((list) => list.map((e) => (e.id === id ? { ...e, ...patch } : e)))

  function onAction(type, item) {
    if (type === 'checkout') setModal({ type: 'checkout', item })
    else if (type === 'checkin') setModal({ type: 'checkin', item })
    else if (type === 'concluir') update(item.id, { status: STATUS.DISPONIVEL, avaria: undefined, manutencaoDesde: undefined })
  }
  function confirmCheckout(id, { cliente, devolucao }) {
    update(id, { status: STATUS.ALUGADO, cliente, devolucao, saida: today }); setModal(null)
  }
  function confirmCheckin(id, { comAvaria, avaria }) {
    if (comAvaria) update(id, { status: STATUS.MANUTENCAO, manutencaoDesde: today, avaria: avaria || 'Avaria não especificada', cliente: undefined, devolucao: undefined, saida: undefined })
    else update(id, { status: STATUS.DISPONIVEL, cliente: undefined, devolucao: undefined, saida: undefined })
    setModal(null)
  }
  function addEquip(payload) {
    setEquip((list) => [{ ...payload, status: STATUS.DISPONIVEL }, ...list]); setModal(null)
  }

  if (auth === 'login') return <Login onEnter={() => setAuth(null)} onGoCadastro={() => setAuth('cadastro')} />
  if (auth === 'cadastro') return <Cadastro onEnter={() => setAuth(null)} onGoLogin={() => setAuth('login')} />

  const detalheItem = detailId ? equip.find((e) => e.id === detailId) : null
  const nav = (k) => { setDetailId(null); setRoute(k) }

  let screen
  if (detalheItem) screen = <Detalhe equipamento={detalheItem} onBack={() => setDetailId(null)} onAction={onAction} />
  else if (route === 'inventario' || route === 'dashboard') screen = <Inventario equipamentos={equip} onOpenDetalhe={setDetailId} onAction={onAction} onNovo={() => setModal({ type: 'novo' })} />
  else if (route === 'clientes') screen = <Clientes clientes={CLIENTES} equipamentos={equip} />
  else if (route === 'locacoes') screen = <Locacoes equipamentos={equip} onAction={onAction} />
  else if (route === 'manutencao') screen = <Manutencao equipamentos={equip} onAction={onAction} />
  else screen = <Relatorios />

  return (
    <div className="app-shell">
      <Sidebar active={detalheItem ? 'inventario' : route} onNav={nav} />
      {screen}
      {modal?.type === 'checkout' && <CheckOutModal item={modal.item} onClose={() => setModal(null)} onConfirm={confirmCheckout} />}
      {modal?.type === 'checkin' && <CheckInModal item={modal.item} onClose={() => setModal(null)} onConfirm={confirmCheckin} />}
      {modal?.type === 'novo' && <NovoEquipamentoModal onClose={() => setModal(null)} onConfirm={addEquip} />}
    </div>
  )
}
