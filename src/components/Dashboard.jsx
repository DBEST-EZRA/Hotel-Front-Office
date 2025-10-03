import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import useNetworkStatus from "../hooks/useNetworkStatus";
import {
  FaSearch,
  FaSignOutAlt,
  FaTimes,
  FaTrashAlt,
  FaShoppingCart,
  FaUserCircle,
  FaPause,
  FaRedo,
  FaTrash,
  FaPrint,
  FaSync,
  FaGift,
  FaShare,
  FaCreditCard,
  FaRegClock,
  FaUtensils,
} from "react-icons/fa";
import "./Dashboard.css";

const Dashboard = () => {
  useNetworkStatus();
  const [cart, setCart] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [billNo, setBillNo] = useState("");
  const navigate = useNavigate();
  const [user, setUser] = useState({ name: "User" });
  const [currentDateTime, setCurrentDateTime] = useState("");
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [refresh, setRefresh] = useState(0);
  const storedUser = sessionStorage.getItem("user");
  const storeId = storedUser ? JSON.parse(storedUser).storeid : null;

  useEffect(() => {
    const storedUser = sessionStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  // New

  useEffect(() => {
    if (!storeId) return;

    const fetchCategories = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/categories?storeid=${storeId}`
        );
        // console.log("Categories fetched:", res.data);
        setCategories(res.data);
        if (res.data.length > 0) {
          setSelectedCategory(res.data[0].category);
        }
      } catch (err) {
        console.error("Error fetching categories:", err.message);
      } finally {
        setLoading(false);
      }
    };

    const fetchInventory = async () => {
      setLoadingProducts(true);
      try {
        // Get user from session storage
        const storedUser = sessionStorage.getItem("user");
        if (!storedUser) throw new Error("User not found in sessionStorage");

        const user = JSON.parse(storedUser);
        const storeId = user.storeid;

        if (!storeId) throw new Error("Store ID missing");

        // ✅ Use axios with params (safer & cleaner)
        const { data } = await axios.get("http://localhost:5000/inventory", {
          params: { storeId },
        });

        setProducts(data);
      } catch (error) {
        console.error("Error fetching inventory:", error.message);
        setProducts([]); // fallback to empty list
      }
      setLoadingProducts(false);
    };

    fetchCategories();
    fetchInventory();
  }, [storeId, refresh]);

  const handleRefresh = () => {
    setRefresh((prev) => prev + 1);
    toast.success("Data refreshed successfully!", {
      progress: undefined, // uses default animated progress bar
    });
  };

  // Time Display

  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      const options = {
        weekday: "long", // Friday
        day: "numeric", // 3
        hour: "2-digit", // 10
        minute: "2-digit", // 57
        second: "2-digit", // 08
        hour12: true, // AM/PM format
      };
      setCurrentDateTime(now.toLocaleString("en-US", options));
    };

    updateDateTime(); // initial load
    const interval = setInterval(updateDateTime, 1000);
    return () => clearInterval(interval);
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
    toast.info("Cart cleared", {
      position: "top-right",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      theme: "colored",
    });
  };

  const filteredFoods = products.filter(
    (f) =>
      (!selectedCategory || f.category === selectedCategory) &&
      f.item.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const total = cart.reduce((sum, item) => sum + item.rate * item.qty, 0);

  const handleLogout = () => {
    sessionStorage.removeItem("accessToken");
    sessionStorage.removeItem("user");
    navigate("/");
  };

  return (
    <div className="dashboard-container">
      {/* Left: Categories */}
      <div className="left-section">
        <h5 className="section-title">Categories</h5>
        <div className="category-list">
          {loading ? (
            <div className="d-flex justify-content-center p-3">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : categories.length === 0 ? (
            <p className="no-categories">No categories found</p>
          ) : (
            categories.map((cat) => (
              <div
                key={cat.id}
                className={`category-card ${
                  selectedCategory === cat.category ? "active" : ""
                }`}
                onClick={() => setSelectedCategory(cat.category)}
              >
                {cat.category}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Middle: Food List + Search + Summary Cards */}
      {/* Middle: Food List + Search + Action Buttons */}
      <div className="middle-section">
        {/* Top Buttons */}
        <div className="top-buttons">
          <button className="btn-action">DINE IN</button>
          <button className="btn-action">TAKE AWAY</button>
          <button className="btn-action">HOME DELIVERY</button>
          <button className="btn-action">SCAN BARCODE</button>
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
          {loadingProducts && (
            <div className="d-flex justify-content-center p-3">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          )}
          {filteredFoods.length === 0 && !loadingProducts ? (
            <p className="no-foods">No foods found in {selectedCategory}</p>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Food</th>
                  <th>Rate</th>
                  <th>Description</th>
                </tr>
              </thead>
              <tbody>
                {filteredFoods.map((food) => (
                  <tr key={food.id} onClick={() => handleFoodClick(food)}>
                    <td style={{ padding: "12px" }}>{food.item}</td>
                    <td style={{ padding: "12px" }}>{food.rate}</td>
                    <td style={{ padding: "12px" }}>{food.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Lower Big Buttons */}
        <div className="bottom-buttons">
          <button className="btn-big green">
            <FaPause /> Hold Bill
          </button>
          <button className="btn-big orange">
            <FaRedo /> Recall Bill
          </button>
          <button className="btn-big grey" onClick={clearCart}>
            <FaTrash /> Clear Cart
          </button>
          <button className="btn-big red">
            <FaPrint /> Reprint
          </button>
          <button className="btn-big blue" onClick={handleRefresh}>
            <FaSync /> Refresh
          </button>
          <button className="btn-big purple">
            <FaGift /> Voucher
          </button>
          <button className="btn-big blue">
            <FaRegClock /> Pending Bills
          </button>
          <button className="btn-big grey">
            <FaUtensils /> Menu Items
          </button>
        </div>
      </div>

      {/* Right: Cart */}
      <div className="right-section">
        <div className="d-flex gap-3 user-info align-items-center">
          {/* User Info */}
          <div className="d-flex align-items-center gap-2">
            <FaUserCircle size={20} />
            <span>{user?.name || "User"}</span>
          </div>

          {/* Logout */}
          <span
            onClick={handleLogout}
            style={{ cursor: "pointer", color: "red" }}
            className="d-flex align-items-center gap-1"
          >
            <FaSignOutAlt /> Logout
          </span>

          {/* Day, Date & Time */}
          <span>{currentDateTime}</span>
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
                  {item.item} x {item.qty}
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
            className="btn btn-primary w-100 mb-2 d-flex align-items-center justify-content-center gap-2"
          >
            <FaShare /> Send Order
          </button>

          <button
            style={{ height: "50px", background: "#092a6dff", color: "white" }}
            className="btn w-100 mb-2 d-flex align-items-center justify-content-center gap-2"
          >
            <FaCreditCard /> Checkout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
