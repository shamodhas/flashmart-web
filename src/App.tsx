import { useState, useEffect } from "react"
import axios from "axios"
import "./App.css"

// --- TYPES (Domain Models) ---
interface Product {
  id: number
  name: string
  price: number
  stock: number
}

// --- CONFIGURATION ---
const API_URL = "http://localhost:8080"

// --- MAIN APP COMPONENT ---
function App() {
  // Auth State
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("token")
  )
  const [role, setRole] = useState<string | null>(localStorage.getItem("role"))

  // App State
  const [products, setProducts] = useState<Product[]>([])
  const [error, setError] = useState("")

  // Initial Data Load
  useEffect(() => {
    fetchProducts()
  }, [])

  // --- API ACTIONS ---
  const fetchProducts = async () => {
    try {
      const res = await axios.get(`${API_URL}/products`)
      setProducts(res.data)
    } catch (err) {
      console.error("Failed to fetch products")
    }
  }

  const logout = () => {
    setToken(null)
    setRole(null)
    localStorage.clear()
    setError("")
  }

  // --- RENDER LOGIC ---
  return (
    <div className="container">
      <header className="header">
        <h1>FlashMart Pro ⚡</h1>
        {token ? (
          <div className="user-info">
            <span>
              Role: <strong>{role?.toUpperCase()}</strong>
            </span>
            <button onClick={logout} className="btn-logout">
              Logout
            </button>
          </div>
        ) : (
          <span className="guest-tag">Guest Mode</span>
        )}
      </header>

      {error && <div className="error-banner">{error}</div>}

      <div className="main-layout">
        {/* LEFT COLUMN: Auth & Admin Panel */}
        <div className="sidebar">
          {!token ? (
            <AuthForm
              setToken={setToken}
              setRole={setRole}
              setError={setError}
            />
          ) : (
            role === "admin" && (
              <AdminPanel
                token={token}
                onSuccess={fetchProducts}
                setError={setError}
              />
            )
          )}
        </div>

        {/* RIGHT COLUMN: Product Grid */}
        <div className="content">
          <h2>Marketplace</h2>
          <div className="product-grid">
            {products.map((p) => (
              <ProductCard
                key={p.id}
                product={p}
                token={token}
                role={role}
                onUpdate={fetchProducts}
                setError={setError}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// --- SUB-COMPONENT: LOGIN/REGISTER ---
function AuthForm({ setToken, setRole, setError }: any) {
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    const endpoint = isLogin ? "/login" : "/register"

    try {
      const res = await axios.post(`${API_URL}${endpoint}`, { email, password })

      if (isLogin) {
        // Save JWT and Role
        localStorage.setItem("token", res.data.token)
        localStorage.setItem("role", res.data.role)
        setToken(res.data.token)
        setRole(res.data.role)
      } else {
        alert("Registration Successful! Please Login.")
        setIsLogin(true)
      }
    } catch (err: any) {
      setError(err.response?.data?.error || "Authentication Failed")
    }
  }

  return (
    <div className="card auth-card">
      <h3>{isLogin ? "Login" : "Register"}</h3>
      <form onSubmit={handleSubmit}>
        <input
          placeholder="Email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          placeholder="Password"
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit" className="btn-primary">
          {isLogin ? "Login" : "Register"}
        </button>
      </form>
      <p className="switch-auth" onClick={() => setIsLogin(!isLogin)}>
        {isLogin ? "Need an account? Register" : "Have an account? Login"}
      </p>
    </div>
  )
}

// --- SUB-COMPONENT: ADMIN PANEL ---
function AdminPanel({ token, onSuccess, setError }: any) {
  const [name, setName] = useState("")
  const [price, setPrice] = useState("")
  const [stock, setStock] = useState("")

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await axios.post(
        `${API_URL}/products`,
        { name, price: Number(price), stock: Number(stock) },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      onSuccess()
      setName("")
      setPrice("")
      setStock("")
    } catch (err: any) {
      setError("Failed to add product: " + err.response?.data?.error)
    }
  }

  return (
    <div className="card admin-card">
      <h3>👑 Admin Tools</h3>
      <form onSubmit={handleAdd}>
        <input
          placeholder="Product Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <div className="row">
          <input
            placeholder="Price"
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
          <input
            placeholder="Stock"
            type="number"
            value={stock}
            onChange={(e) => setStock(e.target.value)}
          />
        </div>
        <button type="submit" className="btn-admin">
          Add Product
        </button>
      </form>
    </div>
  )
}

// --- SUB-COMPONENT: PRODUCT CARD ---
function ProductCard({ product, token, role, onUpdate, setError }: any) {
  const handleBuy = async () => {
    if (!token) return alert("Please Login to Buy!")
    try {
      await axios.post(
        `${API_URL}/buy/${product.id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      )
      onUpdate()
    } catch (err: any) {
      alert(err.response?.data?.error || "Purchase Failed")
    }
  }

  const handleDelete = async () => {
    if (!confirm("Are you sure?")) return
    try {
      await axios.delete(`${API_URL}/products/${product.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      onUpdate()
    } catch (err: any) {
      setError("Delete failed")
    }
  }

  return (
    <div
      className={`card product-card ${
        product.stock === 0 ? "out-of-stock" : ""
      }`}
    >
      <div className="card-header">
        <h4>{product.name}</h4>
        <span className="price">${product.price}</span>
      </div>
      <div className="stock-info">
        Stock: <strong>{product.stock}</strong>
      </div>

      <div className="actions">
        <button
          onClick={handleBuy}
          disabled={product.stock === 0}
          className="btn-buy"
        >
          {product.stock === 0 ? "Sold Out" : "Buy Now"}
        </button>

        {role === "admin" && (
          <button onClick={handleDelete} className="btn-delete">
            🗑
          </button>
        )}
      </div>
    </div>
  )
}

export default App
