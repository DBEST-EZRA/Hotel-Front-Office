import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaSearch,
  FaSignOutAlt,
  FaTimes,
  FaTrashAlt,
  FaEye,
  FaEyeSlash,
  FaShoppingCart,
  FaUser,
} from "react-icons/fa";
import "./Dashboard.css";

const Dashboard = () => {
  // 🔧 Dummy Data
  const categories = [
    "Starters",
    "Main Course",
    "Desserts",
    "Drinks",
    "Specials",
  ];
  const foods = [
    { id: "F001", name: "Chicken Biryani", rate: 250, category: "Starters" },
    { id: "F002", name: "Grilled Fish", rate: 400, category: "Starters" },
    { id: "F003", name: "Chapati", rate: 20, category: "Starters" },
    { id: "F004", name: "Soda", rate: 70, category: "Drinks" },
  ];

  const [selectedCategory, setSelectedCategory] = useState(categories[0]);
  const [cart, setCart] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [billNo, setBillNo] = useState("");
  const navigate = useNavigate();
  const [user, setUser] = useState({ name: "User" });
  const [visible, setVisible] = useState(false);
  const toggleVisibility = () => setVisible((prev) => !prev);

  useEffect(() => {
    const storedUser = sessionStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  useEffect(() => {
    const generateBillNo = () => {
      const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
      let result = "";
      for (let i = 0; i < 6; i++) {
        result += characters.charAt(
          Math.floor(Math.random() * characters.length)
        );
      }
      return result;
    };
    setBillNo(generateBillNo());
  }, []);

  const handleFoodClick = (food) => {
    setCart((prevCart) => {
      const existing = prevCart.find((item) => item.id === food.id);
      if (existing) {
        return prevCart.map((item) =>
          item.id === food.id ? { ...item, qty: item.qty + 1 } : item
        );
      }
      return [...prevCart, { ...food, qty: 1 }];
    });
  };

  const removeCartItem = (id) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== id));
  };

  const clearCart = () => {
    setCart([]);
  };

  const filteredFoods = foods.filter(
    (f) =>
      f.category === selectedCategory &&
      f.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const total = cart.reduce((sum, item) => sum + item.rate * item.qty, 0);

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <div className="dashboard-container">
      {/* Left: Categories */}
      <div className="left-section">
        <h5 className="section-title">Categories</h5>
        <div className="category-list">
          {categories.map((cat, index) => (
            <div
              key={index}
              className={`category-card ${
                selectedCategory === cat ? "active" : ""
              }`}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </div>
          ))}
        </div>
      </div>

      {/* Middle: Food List + Search + Summary Cards */}
      <div className="middle-section">
        <div className="summary-cards">
          {/* Daily Sales */}
          <div className="summary-card">
            <h6>Daily Sales</h6>
            <div className="flex items-center gap-2">
              <p className={visible ? "" : "blurred"}>KES 0</p>
              <span onClick={toggleVisibility} style={{ cursor: "pointer" }}>
                {visible ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
          </div>

          {/* Pending Bills */}
          <div className="summary-card">
            <h6>Pending Bills</h6>
            <p>0</p>
          </div>

          {/* Bookings (no blur) */}
          <div className="summary-card">
            <h6>Bookings</h6>
            <p>0</p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="search-bar">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder={`Search in ${selectedCategory}...`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <FaTimes className="clear-icon" onClick={() => setSearchTerm("")} />
          )}
        </div>

        {/* Food Table */}
        <div className="food-list">
          {filteredFoods.length === 0 ? (
            <p className="no-foods">No foods found in {selectedCategory}</p>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Food</th>
                  <th>Rate</th>
                  <th>ID</th>
                </tr>
              </thead>
              <tbody>
                {filteredFoods.map((food) => (
                  <tr key={food.id} onClick={() => handleFoodClick(food)}>
                    <td style={{ padding: "12px" }}>{food.name}</td>
                    <td style={{ padding: "12px" }}>{food.rate}</td>
                    <td style={{ padding: "12px" }}>{food.id}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Right: Cart */}
      <div className="right-section">
        <div className="d-flex gap-2 user-info">
          <FaUser /> <span>{user?.name || "User"}</span>
          <span
            onClick={handleLogout}
            style={{ cursor: "pointer", color: "red" }}
          >
            <FaSignOutAlt style={{ marginLeft: "8px", color: "red" }} /> Logout
          </span>
        </div>

        <div className="cart-section">
          <h5>
            <FaShoppingCart /> Cart
          </h5>
          <div className="cart-items">
            {cart.length === 0 && (
              <p className="text-muted small">No items added</p>
            )}
            {cart.map((item) => (
              <div key={item.id} className="cart-item">
                <span>
                  {item.name} x {item.qty}
                </span>
                <span>KES {item.rate * item.qty}</span>
                <FaTrashAlt
                  className="delete-icon"
                  onClick={() => removeCartItem(item.id)}
                />
              </div>
            ))}
          </div>
        </div>

        <div className="cart-summary">
          <small>Bill No: #{billNo}</small>
          <h2>
            <b>Total: KES {total}</b>
          </h2>
          <button
            style={{ height: "50px" }}
            className="btn btn-primary w-100 mb-2"
          >
            Checkout
          </button>
          <div className="d-flex gap-2">
            <button className="btn btn-secondary flex-fill">Hold Bill</button>
            <button className="btn btn-danger flex-fill" onClick={clearCart}>
              Clear Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
