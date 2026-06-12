import { useState } from 'react'
import { Sidebar } from './components/ui'
import { CLIENTES } from './data' 
import api from './services/api' 
import Login from './screens/Login'
import Cadastro from './screens/Cadastro'
import Inventario from './screens/Inventario'
import Detalhe from './screens/Detalhe'
import Clientes from './screens/Clientes'
import Locacoes from './screens/Locacoes'
import Manutencao from './screens/Manutencao'
import Relatorios from './screens/Relatorios'
import { CheckOutModal, CheckInModal, NovoEquipamentoModal, NovoClienteModal, VerClienteModal } from './screens/modals'

export default function App() {
  const [auth, setAuth] = useState(() => {
    const token = localStorage.getItem('@LocalPro:token');
    return token ? null : 'login';
});
  const [route, setRoute] = useState('inventario')
  const [detailItem, setDetailItem] = useState(null)
  const [modal, setModal] = useState(null)

  const [refreshKey, setRefreshKey] = useState(0)
  const triggerRefresh = () => setRefreshKey(old => old + 1)

  const handleLogout = () => {
    console.log("O botão de sair foi clicado!");
    localStorage.removeItem('@LocalPro:token');
    delete api.defaults.headers.common['Authorization'];
    setAuth('login');
  };

  async function onAction(type, item) {
    if (type === 'checkout') setModal({ type: 'checkout', item })
    else if (type === 'checkin') setModal({ type: 'checkin', item })
    else if (type === 'concluir') {
      try {
        const idCerto = item.manutencao_id || item.id;
        await api.put(`/manutencao/${idCerto}/concluir`);
        triggerRefresh() 
      } catch (error) {
        console.error(error)
        alert("Erro ao concluir manutenção.")
      }
    }
  }

  async function confirmCheckout(id, payload) {
    try {
      await api.post('/locacoes/checkout', {
        equipamento_id: id,
        cliente_id: payload.cliente_id,
        data_prevista_devolucao: payload.data_prevista_devolucao
      })
      setModal(null)
      triggerRefresh()
    } catch (error) {
      console.error(error)
      alert("Erro ao realizar check-out.")
    }
  }

  async function confirmCheckin(locacaoId, payload) {
    try {
      await api.post(`/locacoes/${locacaoId}/checkin`, {
        com_avaria: payload.com_avaria,
        descricao_avaria: payload.descricao_avaria
      })
      setModal(null)
      triggerRefresh()
    } catch (error) {
      console.error(error)
      alert("Erro ao realizar devolução.")
    }
  }

  async function addEquip(payload) {
    try {
      await api.post('/equipamentos/', payload)
      setModal(null)
      triggerRefresh()
    } catch (error) {
      console.error(error)
      alert("Erro ao cadastrar equipamento.")
    }
  }

  async function addCliente(payload) {
  try {
    await api.post('/clientes/', payload)
    
    setModal(null)
    
    triggerRefresh() 
    alert("Cliente cadastrado com sucesso!")
  } catch (error) {
    console.error(error)
    alert("Erro ao cadastrar cliente. Verifique se o CNPJ já não está cadastrado.")
  }
}
  if (auth === 'login') return <Login onEnter={() => setAuth(null)} onGoCadastro={() => setAuth('cadastro')} />
  if (auth === 'cadastro') return <Cadastro onEnter={() => setAuth(null)} onGoLogin={() => setAuth('login')} />

  const nav = (k) => { setDetailItem(null); setRoute(k) }

  let screen
  if (detailItem) {
    screen = <Detalhe key={`det-${refreshKey}`} equipamento={detailItem} onBack={() => setDetailItem(null)} onAction={onAction} />
  } else if (route === 'inventario' || route === 'dashboard') {
    screen = <Inventario key={`inv-${refreshKey}`} onOpenDetalhe={setDetailItem} onAction={onAction} onNovo={() => setModal({ type: 'novo' })} />
  } else if (route === 'locacoes') {
    screen = <Locacoes key={`loc-${refreshKey}`} onAction={onAction} />
  } else if (route === 'manutencao') {
    screen = <Manutencao key={`man-${refreshKey}`} onAction={onAction} />
  } else if (route === 'clientes') {
    screen = <Clientes key={`cli-${refreshKey}`} onNovo={() => setModal({ type: 'novo_cliente' })} onVerCliente={(cliente) => setModal({type: 'ver_cliente', item:cliente})}/>
  } else {
    screen = <Relatorios />
  }

  return (
    <div className="app-shell">
      <Sidebar active={detailItem ? 'inventario' : route} onNav={nav} onLogout={handleLogout}/>
      {screen}
      
      {modal?.type === 'checkout' && <CheckOutModal item={modal.item} onClose={() => setModal(null)} onConfirm={confirmCheckout} />}
      {modal?.type === 'checkin' && <CheckInModal item={modal.item} onClose={() => setModal(null)} onConfirm={confirmCheckin} />}
      {modal?.type === 'novo' && <NovoEquipamentoModal onClose={() => setModal(null)} onConfirm={addEquip} />}
      {modal?.type === 'novo_cliente' && <NovoClienteModal onClose={() => setModal(null)} onConfirm={addCliente} />}
      {modal?.type === 'ver_cliente' && <VerClienteModal item={modal.item} onClose={() => setModal(null)} />}
    </div>
  )
}