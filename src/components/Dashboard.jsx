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
  const [loadingOrder, setLoadingOrder] = useState(false);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [refresh, setRefresh] = useState(0);
  const [pendingSales, setPendingSales] = useState([]);
  const [reprint, setReprint] = useState([]);
  const [loadingSales, setLoadingSales] = useState(false);
  const [loadingReprint, setLoadingReprint] = useState(false);
  const [loadingCheckoutId, setLoadingCheckoutId] = useState(null);
  const storedUser = sessionStorage.getItem("user");
  const storeId = storedUser ? JSON.parse(storedUser).storeid : null;
  const username = user?.name;

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
          `http://16.16.27.133:5000/categories?storeid=${storeId}`
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
        const { data } = await axios.get("http://16.16.27.133:5000/inventory", {
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

  useEffect(() => {
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

  //Function Start
  //Sending Order
  const handleSendOrder = async () => {
    if (cart.length === 0) {
      toast.error("No Food in Cart!", {
        progress: undefined, // uses default animated progress bar
      });
      return;
    }

    setLoadingOrder(true);

    // Build request body
    const payload = {
      billno: billNo,
      servedby: username,
      paymentstatus: "unpaid", // default
      total,
      paymentmethod: "",
      storeid: storeId,
      vat: 0,
      items: cart.map((item) => ({
        name: item.item,
        rate: item.rate,
        quantity: item.qty,
        vat: 0,
      })),
    };

    try {
      const res = await axios.post("http://16.16.27.133:5000/sales", payload);
      console.log("Sale recorded:", res.data);

      setCart([]);
      setBillNo(generateBillNo());
      toast.success("Order Sent Successfully!", {
        progress: undefined, // uses default animated progress bar
      });
    } catch (err) {
      console.error(err);
      setBillNo(generateBillNo());
      toast.error("Failed to Sent Order!", {
        progress: undefined, // uses default animated progress bar
      });
    } finally {
      setLoadingOrder(false); // stop loading
    }
  };

  // Pending Bills Checkout
  // Pending Bills Checkout
  // Pending Bills Checkout
  const handleCheckout = async (sale) => {
    try {
      setLoadingCheckoutId(sale.id);
      // Update payment status to "paid"
      await axios.put(`http://16.16.27.133:5000/sales/${sale.id}`, {
        billno: sale.billno,
        servedby: sale.servedby,
        paymentstatus: "paid", // mark as paid
        total: sale.total,
        paymentmethod: sale.paymentmethod || "Cash",
        storeid: sale.storeid,
        vat: sale.vat || 0,
      });

      // ✅ 2️⃣ Fetch store details
      const res = await axios.get("http://16.16.27.133:5000/stores", {
        params: { storeId },
      });

      if (!res.data || res.data.length === 0) {
        toast.error("Store details not found!");
        return;
      }

      const store = res.data[0];
      const now = new Date();

      // ✅ 3️⃣ Build receipt HTML
      const receiptWindow = window.open("", "PRINT", "height=600,width=400");

      const receiptHtml = `
      <html>
        <head>
          <title>Receipt</title>
          <style>
            @page { size: 80mm auto; margin: 0; }
            body {
              font-family: monospace;
              width: 80mm;
              margin: 0;
              padding: 10px;
              font-size: 12px;
            }
            .center { text-align: center; }
            .bold { font-weight: bold; }
            .line { border-top: 1px dashed #000; margin: 5px 0; }
            .totals { margin-top: 5px; }
            .item { display: flex; justify-content: space-between; }
            .small { font-size: 11px; }
            .cut { break-after: page; }
          </style>
        </head>
        <body>
          <div class="center bold">${store.name}</div>
          <div class="center small">${store.phone || ""} | ${
        store.email || ""
      }</div>
          <div class="line"></div>
          <div><b>Bill No:</b> ${sale.billno}</div>
          <div><b>Served By:</b> ${sale.servedby}</div>
          <div><b>Date:</b> ${now.toLocaleString()}</div>
          <div><b>Payment:</b> ${sale.paymentmethod || "Cash"}</div>
          <div class="line"></div>

          ${sale.sale_item
            .map(
              (item) => `
              <div class="item">
                <span>${item.name} x ${item.quantity}</span>
                <span>KES ${(item.rate * item.quantity).toFixed(2)}</span>
              </div>
            `
            )
            .join("")}

          <div class="line"></div>
          <div class="totals bold">
            <div class="item">
              <span>Total</span>
              <span>KES ${sale.total}</span>
            </div>
          </div>
          <div class="center small cut">Thank you for your business!</div>
        </body>
      </html>
    `;

      // ✅ 4️⃣ Print the receipt
      receiptWindow.document.write(receiptHtml);
      receiptWindow.document.close();
      receiptWindow.focus();
      receiptWindow.print();
      receiptWindow.close();

      // ✅ 5️⃣ Notify success
      toast.success("Checkout complete and receipt printed!");
    } catch (err) {
      console.error("Checkout error:", err);
      toast.error("Failed to complete checkout!");
    } finally {
      setLoadingCheckoutId(null);
    }
  };

  // Dashboard Checkout
  // Dashboard Checkout
  // Dashboard Checkout
  // Dashboard Checkout

  const handleCartCheckout = async () => {
    if (cart.length === 0) {
      toast.error("No items in cart!");
      return;
    }

    try {
      // 1️⃣ Fetch store details
      const res = await axios.get("http://16.16.27.133:5000/stores", {
        params: { storeId },
      });

      if (!res.data || res.data.length === 0) {
        toast.error("Store details not found!");
        return;
      }

      const store = res.data[0];
      const now = new Date();

      // 2️⃣ Build receipt HTML
      const receiptWindow = window.open("", "PRINT", "height=600,width=400");

      const receiptHtml = `
      <html>
        <head>
          <title>Receipt</title>
          <style>
            @page { size: 80mm auto; margin: 0; }
            body { font-family: monospace; width: 80mm; margin: 0; padding: 10px; font-size: 12px; }
            .center { text-align: center; }
            .bold { font-weight: bold; }
            .line { border-top: 1px dashed #000; margin: 5px 0; }
            .totals { margin-top: 5px; }
            .item { display: flex; justify-content: space-between; }
            .small { font-size: 11px; }
            .cut { break-after: page; } /* simulates auto-cut */
          </style>
        </head>
        <body>
          <div class="center bold">${store.name}</div>
          <div class="center small">${store.phone || ""} | ${
        store.email || ""
      }</div>
          <div class="line"></div>
          <div><b>Bill No:</b> ${billNo}</div>
          <div><b>Served By:</b> ${username}</div>
          <div><b>Date:</b> ${now.toLocaleString()}</div>
          <div><b>Payment:</b> ${"CASH"}</div>
          <div class="line"></div>

          ${cart
            .map(
              (item) => `
              <div class="item">
                <span>${item.item} x ${item.qty}</span>
                <span>KES ${(item.rate * item.qty).toFixed(2)}</span>
              </div>
            `
            )
            .join("")}

          <div class="line"></div>
          <div class="totals bold">
            <div class="item">
              <span>Total</span>
              <span>KES ${total.toFixed(2)}</span>
            </div>
          </div>
          <div class="center small cut">Thank you for your business!</div>
        </body>
      </html>
    `;

      // 3️⃣ Print
      receiptWindow.document.write(receiptHtml);
      receiptWindow.document.close();
      receiptWindow.focus();
      receiptWindow.print();
      receiptWindow.close();

      // 4️⃣ Reset cart after checkout
      handleSendOrder();
      setCart([]);
      setBillNo(generateBillNo());
    } catch (err) {
      console.error("Checkout error:", err);
      toast.error("Failed to generate receipt!");
    }
  };

  const filteredFoods = products.filter(
    (f) =>
      (!selectedCategory || f.category === selectedCategory) &&
      f.item.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const total = cart.reduce((sum, item) => sum + item.rate * item.qty, 0);

  // Fetching Pending Sales
  const fetchPendingSales = async () => {
    try {
      setLoadingSales(true);
      const res = await axios.get("http://16.16.27.133:5000/sales", {
        params: { storeid: storeId },
      });

      // filter by servedby === username
      const filtered = res.data.filter(
        (sale) => sale.servedby === username && sale.paymentstatus === "unpaid"
      );
      setPendingSales(filtered);
    } catch (err) {
      console.error("Error fetching sales:", err);
    } finally {
      setLoadingSales(false);
    }
  };

  // Fetching Sales for Receipt Reprint
  const handleReprint = async () => {
    try {
      setLoadingReprint(true);
      const res = await axios.get("http://16.16.27.133:5000/sales", {
        params: { storeid: storeId },
      });

      // filter by servedby === username
      const filtered = res.data.filter(
        (receipt) =>
          receipt.servedby === username && receipt.paymentstatus === "paid"
      );
      setReprint(filtered);
    } catch (err) {
      console.error("Error fetching sales:", err);
    } finally {
      setLoadingReprint(false);
    }
  };

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
          <button
            className="btn-big red"
            data-bs-toggle="modal"
            data-bs-target="#reprintModal"
            onClick={handleReprint}
          >
            <FaPrint /> Reprint
          </button>
          <button className="btn-big blue" onClick={handleRefresh}>
            <FaSync /> Refresh
          </button>
          <button className="btn-big purple">
            <FaGift /> Voucher
          </button>
          <button
            className="btn-big blue"
            data-bs-toggle="modal"
            data-bs-target="#pendingBillsModal"
            onClick={fetchPendingSales} // fetch on open
          >
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
            onClick={handleSendOrder}
            disabled={loadingOrder} // ✅ disable button while sending
          >
            {loadingOrder ? (
              <>
                <span
                  className="spinner-border spinner-border-sm"
                  role="status"
                  aria-hidden="true"
                ></span>
                Sending Order...
              </>
            ) : (
              <>
                <FaShare /> Send Order
              </>
            )}
          </button>

          <button
            style={{ height: "50px", background: "#092a6dff", color: "white" }}
            className="btn w-100 mb-2 d-flex align-items-center justify-content-center gap-2"
            onClick={handleCartCheckout}
          >
            <FaCreditCard /> Checkout
          </button>
        </div>
      </div>

      {/* // Pending Bills Modal */}

      <div
        className="modal fade"
        id="pendingBillsModal"
        tabIndex="-1"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-lg modal-dialog-scrollable">
          <div
            className="modal-content"
            style={{ backgroundColor: "#c2d3e4ff" }}
          >
            <div
              className="modal-header"
              style={{ backgroundColor: "#86b3e0ff" }}
            >
              <h5 className="modal-title fw-bold">Pending Bills</h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body" style={{ fontSize: "0.9rem" }}>
              {loadingSales ? (
                <div className="d-flex flex-column align-items-center justify-content-center py-5">
                  <div
                    className="spinner-border text-primary mb-3"
                    role="status"
                  >
                    <span className="visually-hidden">Loading...</span>
                  </div>
                  <p className="text-muted small">Fetching pending sales...</p>
                </div>
              ) : pendingSales.length === 0 ? (
                <p className="text-muted">No pending bills.</p>
              ) : (
                <div className="accordion" id="pendingBillsAccordion">
                  {pendingSales.map((sale, idx) => (
                    <div
                      className="accordion-item shadow-sm mb-3 rounded"
                      key={sale.id}
                      style={{ border: "1px solid #dee2e6" }}
                    >
                      <h2 className="accordion-header" id={`heading${idx}`}>
                        <button
                          className="accordion-button collapsed fw-bold"
                          type="button"
                          data-bs-toggle="collapse"
                          data-bs-target={`#collapse${idx}`}
                          aria-expanded="false"
                          aria-controls={`collapse${idx}`}
                          style={{
                            fontSize: "0.9rem",
                            backgroundColor: "#f1f3f5",
                            color: "#333",
                            minHeight: "60px",
                          }}
                        >
                          Bill No: {sale.billno} —{" "}
                          <span className="ms-2 text-primary">
                            Total: KES {sale.total}
                          </span>
                        </button>
                      </h2>
                      <div
                        id={`collapse${idx}`}
                        className="accordion-collapse collapse"
                        aria-labelledby={`heading${idx}`}
                        data-bs-parent="#pendingBillsAccordion"
                      >
                        <div className="accordion-body bg-white">
                          <ul className="list-group mb-3 small">
                            {sale.sale_item.map((item, i) => (
                              <li
                                key={i}
                                className="list-group-item d-flex justify-content-between align-items-center"
                                style={{ fontSize: "0.85rem" }}
                              >
                                <span className="fw-medium">
                                  {item.name} x {item.quantity}
                                </span>
                                <span className="text-muted">
                                  @ {item.rate}
                                </span>
                                <span className="fw-bold text-dark">
                                  KES {item.rate * item.quantity}
                                </span>
                              </li>
                            ))}
                          </ul>
                          <button
                            className="btn btn-primary w-100 d-flex align-items-center justify-content-center gap-2 fw-bold"
                            onClick={() => handleCheckout(sale)}
                            disabled={loadingCheckoutId === sale.id}
                          >
                            {loadingCheckoutId === sale.id ? (
                              <>
                                <div
                                  className="spinner-grow spinner-grow-sm text-light"
                                  role="status"
                                ></div>
                                Generating Receipt...
                              </>
                            ) : (
                              <>
                                <FaCreditCard /> Checkout
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* // Reprint Receipts Modal */}

      <div
        className="modal fade"
        id="reprintModal"
        tabIndex="-1"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-lg modal-dialog-scrollable">
          <div
            className="modal-content"
            style={{ backgroundColor: "#c2d3e4ff" }}
          >
            <div
              className="modal-header"
              style={{ backgroundColor: "#86b3e0ff" }}
            >
              <h5 className="modal-title fw-bold">Reprint Receipts</h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body" style={{ fontSize: "0.9rem" }}>
              {loadingReprint ? (
                <div className="d-flex flex-column align-items-center justify-content-center py-5">
                  <div
                    className="spinner-border text-primary mb-3"
                    role="status"
                  >
                    <span className="visually-hidden">Loading...</span>
                  </div>
                  <p className="text-muted small">Fetching settled sales...</p>
                </div>
              ) : reprint.length === 0 ? (
                <p className="text-muted">No settled bills.</p>
              ) : (
                <div className="accordion" id="pendingBillsAccordion">
                  {reprint.map((receipt, idx) => (
                    <div
                      className="accordion-item shadow-sm mb-3 rounded"
                      key={receipt.id}
                      style={{ border: "1px solid #dee2e6" }}
                    >
                      <h2 className="accordion-header" id={`heading${idx}`}>
                        <button
                          className="accordion-button collapsed fw-bold"
                          type="button"
                          data-bs-toggle="collapse"
                          data-bs-target={`#collapse${idx}`}
                          aria-expanded="false"
                          aria-controls={`collapse${idx}`}
                          style={{
                            fontSize: "0.9rem",
                            backgroundColor: "#f1f3f5",
                            color: "#333",
                            minHeight: "60px",
                          }}
                        >
                          Bill No: {receipt.billno} —{" "}
                          <span className="ms-2 text-primary">
                            Total: KES {receipt.total}
                          </span>
                        </button>
                      </h2>
                      <div
                        id={`collapse${idx}`}
                        className="accordion-collapse collapse"
                        aria-labelledby={`heading${idx}`}
                        data-bs-parent="#pendingBillsAccordion"
                      >
                        <div className="accordion-body bg-white">
                          <ul className="list-group mb-3 small">
                            {receipt.sale_item.map((item, i) => (
                              <li
                                key={i}
                                className="list-group-item d-flex justify-content-between align-items-center"
                                style={{ fontSize: "0.85rem" }}
                              >
                                <span className="fw-medium">
                                  {item.name} x {item.quantity}
                                </span>
                                <span className="text-muted">
                                  @ {item.rate}
                                </span>
                                <span className="fw-bold text-dark">
                                  KES {item.rate * item.quantity}
                                </span>
                              </li>
                            ))}
                          </ul>
                          <button
                            className="btn btn-primary w-100 d-flex align-items-center justify-content-center gap-2 fw-bold"
                            onClick={() => handleCheckout(receipt)}
                            disabled={loadingCheckoutId === receipt.id}
                          >
                            {loadingCheckoutId === receipt.id ? (
                              <>
                                <div
                                  className="spinner-grow spinner-grow-sm text-light"
                                  role="status"
                                ></div>
                                Generating Receipt...
                              </>
                            ) : (
                              <>
                                <FaCreditCard /> Reprint Receipt
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
