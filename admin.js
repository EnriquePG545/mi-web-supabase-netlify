const DEMO_USER = "admin";
const DEMO_PASSWORD = "puesto325";
const AUTH_KEY = "puesto325_admin_logged_in";
const INVENTORY_KEY = "puesto325_inventory";
const SALES_KEY = "puesto325_sales";
const LOGS_KEY = "puesto325_logs";

const initialInventory = [
  { name: "Arroz extra", category: "Arroz", format: "Saco 49 kg", stock: 18, price: 185 },
  { name: "Azucar rubia", category: "Azucar", format: "Saco 50 kg", stock: 12, price: 172 },
  { name: "Lenteja", category: "Menestras", format: "Por kilo", stock: 80, price: 6.5 },
  { name: "Frejol canario", category: "Menestras", format: "Por kilo", stock: 55, price: 8.9 },
  { name: "Cafe molido", category: "Cafe", format: "Paquete", stock: 34, price: 12 },
  { name: "Galletas surtidas", category: "Galletas", format: "Caja", stock: 22, price: 38 },
];

const initialSales = [
  { date: currentDate(), product: "Arroz extra", quantity: 1, total: 185 },
  { date: currentDate(), product: "Lenteja", quantity: 4, total: 26 },
  { date: currentDate(), product: "Galletas surtidas", quantity: 2, total: 76 },
];

const initialLogs = [
  { date: currentDateTime(), type: "Sistema", detail: "Panel administrativo iniciado con datos de ejemplo." },
];

const loginView = document.querySelector("#login-view");
const dashboard = document.querySelector("#dashboard");
const loginForm = document.querySelector("#login-form");
const loginMessage = document.querySelector("#login-message");
const logoutButton = document.querySelector("#logout-button");
const productForm = document.querySelector("#product-form");
const saleForm = document.querySelector("#sale-form");

function currentDate() {
  return new Date().toISOString().slice(0, 10);
}

function currentDateTime() {
  return new Date().toLocaleString("es-PE", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function money(value) {
  return `S/ ${Number(value).toFixed(2)}`;
}

function readData(key, fallback) {
  const stored = localStorage.getItem(key);
  if (!stored) {
    localStorage.setItem(key, JSON.stringify(fallback));
    return fallback;
  }

  try {
    return JSON.parse(stored);
  } catch {
    localStorage.setItem(key, JSON.stringify(fallback));
    return fallback;
  }
}

function writeData(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function addLog(type, detail) {
  const logs = readData(LOGS_KEY, initialLogs);
  logs.unshift({ date: currentDateTime(), type, detail });
  writeData(LOGS_KEY, logs.slice(0, 50));
}

function showDashboard() {
  loginView.classList.add("hidden");
  dashboard.classList.remove("hidden");
  renderAll();
}

function showLogin() {
  dashboard.classList.add("hidden");
  loginView.classList.remove("hidden");
}

function renderAll() {
  const inventory = readData(INVENTORY_KEY, initialInventory);
  const sales = readData(SALES_KEY, initialSales);
  const logs = readData(LOGS_KEY, initialLogs);

  renderInventory(inventory);
  renderSales(sales);
  renderLogs(logs);
  renderStats(inventory, sales);
}

function renderStats(inventory, sales) {
  const productCount = inventory.length;
  const totalStock = inventory.reduce((sum, item) => sum + Number(item.stock || 0), 0);
  const totalSales = sales.reduce((sum, sale) => sum + Number(sale.total || 0), 0);

  document.querySelector("#stat-products").textContent = productCount;
  document.querySelector("#stat-stock").textContent = totalStock;
  document.querySelector("#stat-sales").textContent = money(totalSales);
}

function renderInventory(items) {
  const table = document.querySelector("#inventory-table");
  table.innerHTML = items
    .map(
      (item) => `
        <tr>
          <td>${escapeHtml(item.name)}</td>
          <td>${escapeHtml(item.category)}</td>
          <td>${escapeHtml(item.format)}</td>
          <td>${Number(item.stock)}</td>
          <td>${money(item.price)}</td>
        </tr>
      `,
    )
    .join("");
}

function renderSales(items) {
  const table = document.querySelector("#sales-table");
  table.innerHTML = items
    .map(
      (sale) => `
        <tr>
          <td>${escapeHtml(sale.date)}</td>
          <td>${escapeHtml(sale.product)}</td>
          <td>${Number(sale.quantity)}</td>
          <td>${money(sale.total)}</td>
        </tr>
      `,
    )
    .join("");
}

function renderLogs(items) {
  const table = document.querySelector("#logs-table");
  table.innerHTML = items
    .map(
      (log) => `
        <tr>
          <td>${escapeHtml(log.date)}</td>
          <td>${escapeHtml(log.type)}</td>
          <td>${escapeHtml(log.detail)}</td>
        </tr>
      `,
    )
    .join("");
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

loginForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const form = new FormData(loginForm);
  const username = String(form.get("username") || "").trim();
  const password = String(form.get("password") || "").trim();

  if (username === DEMO_USER && password === DEMO_PASSWORD) {
    sessionStorage.setItem(AUTH_KEY, "true");
    loginMessage.textContent = "";
    addLog("Ingreso", "Se inicio sesion en el panel admin.");
    showDashboard();
    return;
  }

  loginMessage.textContent = "Usuario o contrasena incorrectos.";
});

logoutButton.addEventListener("click", () => {
  sessionStorage.removeItem(AUTH_KEY);
  addLog("Salida", "Se cerro sesion en el panel admin.");
  showLogin();
});

productForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const form = new FormData(productForm);
  const product = {
    name: String(form.get("name") || "").trim(),
    category: String(form.get("category") || "").trim(),
    format: String(form.get("format") || "").trim(),
    stock: Number(form.get("stock") || 0),
    price: Number(form.get("price") || 0),
  };

  const inventory = readData(INVENTORY_KEY, initialInventory);
  inventory.unshift(product);
  writeData(INVENTORY_KEY, inventory);
  addLog("Inventario", `Se agrego ${product.name} al inventario.`);
  productForm.reset();
  renderAll();
});

saleForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const form = new FormData(saleForm);
  const sale = {
    date: String(form.get("date") || currentDate()),
    product: String(form.get("product") || "").trim(),
    quantity: Number(form.get("quantity") || 0),
    total: Number(form.get("total") || 0),
  };

  const sales = readData(SALES_KEY, initialSales);
  sales.unshift(sale);
  writeData(SALES_KEY, sales);
  addLog("Venta", `Se registro venta de ${sale.product} por ${money(sale.total)}.`);
  saleForm.reset();
  saleForm.elements.date.value = currentDate();
  renderAll();
});

document.querySelectorAll(".tab-button").forEach((button) => {
  button.addEventListener("click", () => {
    const tab = button.dataset.tab;

    document.querySelectorAll(".tab-button").forEach((item) => item.classList.remove("active"));
    document.querySelectorAll(".tab-panel").forEach((panel) => panel.classList.remove("active"));

    button.classList.add("active");
    document.querySelector(`#tab-${tab}`).classList.add("active");
  });
});

if (saleForm) {
  saleForm.elements.date.value = currentDate();
}

if (sessionStorage.getItem(AUTH_KEY) === "true") {
  showDashboard();
} else {
  showLogin();
}
