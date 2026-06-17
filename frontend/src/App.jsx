import { useEffect, useMemo, useState } from "react"
import { commandApi } from "./api/commandApi.js"
import { queryApi } from "./api/queryApi.js"
import { Dashboard } from "./components/Dashboard.jsx"
import { EventLog } from "./components/EventLog.jsx"
import { MovementTable } from "./components/MovementTable.jsx"
import { ProductForm } from "./components/ProductForm.jsx"
import { ProductTable } from "./components/ProductTable.jsx"
import { SaleForm } from "./components/SaleForm.jsx"
import { StockInForm } from "./components/StockInForm.jsx"
import { StockTable } from "./components/StockTable.jsx"
import { TransferForm } from "./components/TransferForm.jsx"
import { StockQuery } from "./components/StockQuery.jsx"
import { TransferHistory } from "./components/TransferHistory.jsx"
import { BranchForm } from "./components/BranchForm.jsx"
import { BranchList } from "./components/BranchList.jsx"

const TABS = [
  { id: "dashboard", label: "Dashboard", icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-4 0a1 1 0 01-1-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 01-1 1" },
  { id: "products", label: "Produtos", icon: "M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" },
  { id: "stock-mov", label: "Estoque", icon: "M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" },
  { id: "transfer", label: "Transferir", icon: "M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" },
  { id: "stock-query", label: "Consultar", icon: "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" },
  { id: "history", label: "Histórico", icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" },
  { id: "branches", label: "Filiais", icon: "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" },
]

export default function App() {
  const [activeTab, setActiveTab] = useState("dashboard")
  const [products, setProducts] = useState([])
  const [stock, setStock] = useState([])
  const [movements, setMovements] = useState([])
  const [events, setEvents] = useState([])
  const [branches, setBranches] = useState([])
  const [stockTypes, setStockTypes] = useState([])
  const [notice, setNotice] = useState("Sistema pronto para demonstração.")
  const [loading, setLoading] = useState(false)

  const totalStock = useMemo(
    () => stock.reduce((sum, item) => sum + item.quantity, 0),
    [stock]
  )

  async function refreshReadModels() {
    const [productsRes, stockRes, movementsRes, eventsRes, branchesRes, typesRes] = await Promise.all([
      queryApi.get("/products"),
      queryApi.get("/stock"),
      queryApi.get("/movements"),
      queryApi.get("/events"),
      queryApi.get("/branches"),
      queryApi.get("/stock-types"),
    ])

    setProducts(productsRes.data)
    setStock(stockRes.data)
    setMovements(movementsRes.data)
    setEvents(eventsRes.data)
    setBranches(branchesRes.data)
    setStockTypes(typesRes.data)
  }

  async function runCommand(label, command) {
    try {
      setLoading(true)
      await command()
      setNotice(`${label} enviado. A leitura será atualizada pelo sync-service.`)
      setTimeout(refreshReadModels, 1000)
    } catch (error) {
      setNotice(error.response?.data?.message || error.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    refreshReadModels().catch(() => setNotice("Aguardando serviços ficarem disponíveis."))
    const interval = setInterval(() => {
      refreshReadModels().catch(() => {})
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  const branchNames = branches.map((b) => b.name)

  return (
    <div className="app-layout">
      <header className="topbar">
        <div className="topbar-brand">
          <div className="topbar-logo">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          </div>
          <div>
            <h1>Controle de Estoque</h1>
            <p>CQRS • EDA • Microsserviços</p>
          </div>
        </div>
        <div className="topbar-stats">
          <span>{products.length} produtos</span>
          <span>{totalStock} itens</span>
          <span>{branches.length} filiais</span>
        </div>
      </header>

      <nav className="tabs">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            className={`tab ${activeTab === tab.id ? "active" : ""}`}
            onClick={() => setActiveTab(tab.id)}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d={tab.icon} />
            </svg>
            {tab.label}
          </button>
        ))}
      </nav>

      <section className="notice" data-loading={loading}>
        {notice}
      </section>

      <main className="content">
        {activeTab === "dashboard" && (
          <Dashboard
            products={products}
            stock={stock}
            movements={movements}
            events={events}
            branches={branches}
          />
        )}

        {activeTab === "products" && (
          <div className="page-layout">
            <div className="page-sidebar">
              <ProductForm stockTypes={stockTypes} onSubmit={(data) => runCommand("Cadastro de produto", () => commandApi.post("/products", data))} />
            </div>
            <div className="page-main">
              <ProductTable products={products} stockTypes={stockTypes} />
            </div>
          </div>
        )}

        {activeTab === "stock-mov" && (
          <div className="page-layout">
            <div className="page-sidebar">
              <StockInForm branches={branchNames} products={products} onSubmit={(data) => runCommand("Entrada de estoque", () => commandApi.post("/stock/in", data))} />
              <SaleForm branches={branchNames} products={products} onSubmit={(data) => runCommand("Venda", () => commandApi.post("/sales", data))} />
            </div>
            <div className="page-main">
              <StockTable stock={stock} />
              <MovementTable movements={movements} />
            </div>
          </div>
        )}

        {activeTab === "transfer" && (
          <div className="page-layout">
            <div className="page-sidebar">
              <TransferForm branches={branchNames} products={products} onSubmit={(data) => runCommand("Transferência", () => commandApi.post("/transfers", data))} />
            </div>
            <div className="page-main">
              <StockTable stock={stock} />
            </div>
          </div>
        )}

        {activeTab === "stock-query" && (
          <StockQuery stockTypes={stockTypes} />
        )}

        {activeTab === "history" && (
          <TransferHistory stockTypes={stockTypes} products={products} branches={branches} />
        )}

        {activeTab === "branches" && (
          <div className="page-layout">
            <div className="page-sidebar">
              <BranchForm onSubmit={(data) => runCommand("Cadastro de filial", () => commandApi.post("/branches", data))} />
            </div>
            <div className="page-main">
              <BranchList branches={branches} />
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
