import { useEffect, useMemo, useState } from "react";
import { commandApi } from "./api/commandApi.js";
import { queryApi } from "./api/queryApi.js";
import { EventLog } from "./components/EventLog.jsx";
import { MovementTable } from "./components/MovementTable.jsx";
import { ProductForm } from "./components/ProductForm.jsx";
import { ProductTable } from "./components/ProductTable.jsx";
import { SaleForm } from "./components/SaleForm.jsx";
import { StockInForm } from "./components/StockInForm.jsx";
import { StockTable } from "./components/StockTable.jsx";
import { TransferForm } from "./components/TransferForm.jsx";

const branches = ["Taquara", "Porto Alegre", "Novo Hamburgo"];

export default function App() {
  const [products, setProducts] = useState([]);
  const [stock, setStock] = useState([]);
  const [movements, setMovements] = useState([]);
  const [events, setEvents] = useState([]);
  const [notice, setNotice] = useState("Sistema pronto para demonstracao.");
  const [loading, setLoading] = useState(false);

  const totalStock = useMemo(
    () => stock.reduce((sum, item) => sum + item.quantity, 0),
    [stock]
  );

  async function refreshReadModels() {
    const [productsResponse, stockResponse, movementsResponse, eventsResponse] = await Promise.all([
      queryApi.get("/products"),
      queryApi.get("/stock"),
      queryApi.get("/movements"),
      queryApi.get("/events")
    ]);

    setProducts(productsResponse.data);
    setStock(stockResponse.data);
    setMovements(movementsResponse.data);
    setEvents(eventsResponse.data);
  }

  async function runCommand(label, command) {
    try {
      setLoading(true);
      await command();
      setNotice(`${label} enviado. A leitura sera atualizada pelo sync-service.`);
      setTimeout(refreshReadModels, 1000);
    } catch (error) {
      setNotice(error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    refreshReadModels().catch(() => setNotice("Aguardando servicos ficarem disponiveis."));
    const interval = setInterval(() => {
      refreshReadModels().catch(() => {});
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <main>
      <header className="topbar">
        <div>
          <h1>Controle de Estoque Distribuido</h1>
          <p>Microservicos, CQRS, EDA, RabbitMQ e consistencia eventual.</p>
        </div>
        <div className="stats">
          <span>{products.length} produtos</span>
          <span>{totalStock} itens</span>
          <span>{events.length} eventos</span>
        </div>
      </header>

      <section className="notice" data-loading={loading}>{notice}</section>

      <section className="forms">
        <ProductForm onSubmit={(data) => runCommand("Cadastro de produto", () => commandApi.post("/products", data))} />
        <StockInForm branches={branches} products={products} onSubmit={(data) => runCommand("Entrada de estoque", () => commandApi.post("/stock/in", data))} />
        <SaleForm branches={branches} products={products} onSubmit={(data) => runCommand("Venda", () => commandApi.post("/sales", data))} />
        <TransferForm branches={branches} products={products} onSubmit={(data) => runCommand("Transferencia", () => commandApi.post("/transfers", data))} />
      </section>

      <section className="dashboard">
        <StockTable stock={stock} />
        <ProductTable products={products} />
        <MovementTable movements={movements} />
        <EventLog events={events} />
      </section>
    </main>
  );
}
