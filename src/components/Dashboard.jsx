import React, { useEffect, useState } from "react";
import {
  FaSearch,
  FaTimes,
  FaTrashAlt,
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

  const filteredFoods = foods.filter(
    (f) =>
      f.category === selectedCategory &&
      f.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const total = cart.reduce((sum, item) => sum + item.rate * item.qty, 0);

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
          <div className="summary-card">
            <h6>Daily Sales</h6>
            <p>KES 0</p>
          </div>
          <div className="summary-card">
            <h6>Pending Bills</h6>
            <p>0</p>
          </div>
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
                    <td>{food.name}</td>
                    <td>{food.rate}</td>
                    <td>{food.id}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Right: Cart */}
      <div className="right-section">
        <div className="user-info">
          <FaUser /> <span>John Doe (Cashier)</span>
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
          <h1>Total: KES {total}</h1>
          <button className="btn btn-success w-100 mb-2">Checkout</button>
          <button className="btn btn-secondary w-100">Hold Bill</button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
