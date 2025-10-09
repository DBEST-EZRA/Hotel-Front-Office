import { useState, useEffect } from "react";
import {
  FaCog,
  FaUsers,
  FaBoxes,
  FaChartBar,
  FaMoneyBillWave,
  FaFileInvoiceDollar,
  FaTruck,
  FaBalanceScale,
  FaBell,
  FaSignOutAlt,
  FaUtensils,
  FaTable,
  FaCreditCard,
  FaShoppingCart,
  FaUniversity,
  FaReceipt,
  FaBook,
  FaUserClock,
  FaClipboardList,
  FaCalculator,
  FaDatabase,
  FaStickyNote,
  FaChevronLeft,
  FaBars,
  FaCopyright,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";

import Settings from "./Settings";
import Users from "./Users";
import Inventory from "./Inventory";
import Reports from "./Reports";
import Expenses from "./Expenses";
import Supplies from "./Supplies";
import Compliance from "./Compliance";
import Notifications from "./Notifications";
import GeneralReport from "./GeneralReport";
import Categories from "./Categories";
import Calculator from "./Calculator";
import Database from "./Database";
import Restaurant from "./Restaurant";

const AdminDashboard = () => {
  const [selected, setSelected] = useState("Restaurant Info");
  const [notifications, setNotifications] = useState(3);
  const [user, setUser] = useState({ name: "Admin" });
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = sessionStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  const Components = {
    "Restaurant Info": () => <Restaurant />,
    Settings: () => <Settings />,
    Categories: () => <Categories />,
    Inventory: () => <Inventory />,
    Tables: () => <Compliance />,
    "Credit Customer": () => <Compliance />,
    Suppliers: () => <Supplies />,
    Purchases: () => <Compliance />,
    Payment: () => <Compliance />,
    Bank: () => <Compliance />,
    Expenses: () => <Expenses />,
    Voucher: () => <Compliance />,
    Recipe: () => <Compliance />,
    Attendance: () => <Compliance />,
    Payroll: () => <Compliance />,
    "PoS Report": () => <Reports />,
    "Accounting Reports": () => <GeneralReport />,
    Users: () => <Users />,
    Logs: () => <Compliance />,
    Kitchen: () => <Compliance />,
    Calculator: () => <Calculator />,
    Database: () => <Database />,
    Notices: () => <Notifications />,
    Logout: () => <p>Logging out...</p>,
  };

  const SelectedComponent = Components[selected] || (() => <p>No Component</p>);

  const menuItems = [
    { name: "Restaurant Info", icon: <FaUtensils /> },
    { name: "Settings", icon: <FaCog /> },
    { name: "Users", icon: <FaUsers /> },
    { name: "Categories", icon: <FaBook /> },
    { name: "Inventory", icon: <FaBoxes /> },
    { name: "Tables", icon: <FaTable /> },
    { name: "Credit Customer", icon: <FaCreditCard /> },
    { name: "Suppliers", icon: <FaTruck /> },
    { name: "Purchases", icon: <FaShoppingCart /> },
    { name: "Payment", icon: <FaMoneyBillWave /> },
    { name: "Bank", icon: <FaUniversity /> },
    { name: "Expenses", icon: <FaReceipt /> },
    { name: "Voucher", icon: <FaFileInvoiceDollar /> },
    { name: "Recipe", icon: <FaBalanceScale /> },
    { name: "Attendance", icon: <FaUserClock /> },
    { name: "Payroll", icon: <FaClipboardList /> },
    { name: "PoS Report", icon: <FaChartBar /> },
    { name: "Accounting Reports", icon: <FaBook /> },

    { name: "Logs", icon: <FaClipboardList /> },
    { name: "Kitchen", icon: <FaUtensils /> },
    { name: "Calculator", icon: <FaCalculator /> },
    { name: "Database", icon: <FaDatabase /> },
    { name: "Notices", icon: <FaStickyNote /> },
    { name: "Logout", icon: <FaSignOutAlt /> },
    { name: "Beta", icon: <FaCopyright /> },
  ];

  const handleLogout = () => {
    sessionStorage.removeItem("accessToken");
    sessionStorage.removeItem("user");
    navigate("/");
  };

  const handleSelect = (name) => {
    if (name === "Logout") return handleLogout();
    setSelected(name);

    // Auto-close sidebar on mobile
    if (window.innerWidth <= 768) setMobileMenuOpen(false);
  };

  return (
    <div className="d-flex flex-column vh-100 bg-light">
      {/* Topbar */}
      <div
        className="d-flex align-items-center justify-content-between shadow-sm p-3 sticky-top"
        style={{
          zIndex: 1000,
          backgroundColor: "#0d6efd",
          color: "white",
        }}
      >
        <div className="d-flex align-items-center gap-2">
          {/* Mobile Menu Button */}
          <button
            className="btn btn-sm text-white d-md-none"
            style={{ background: "none" }}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <FaBars size={20} />
          </button>
          <h5 className="fw-bold mb-0">Hotel PoS Admin</h5>
        </div>

        <div className="d-flex align-items-center gap-3">
          {/* Notifications */}
          <div
            className="position-relative"
            style={{ cursor: "pointer" }}
            onClick={() => setSelected("Notices")}
          >
            <FaBell size={18} />
            {notifications > 0 && (
              <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                {notifications}
              </span>
            )}
          </div>

          {/* User Info */}
          <div className="d-flex align-items-center gap-2">
            <FaUserClock />
            <span>{user?.name || "Admin"}</span>
          </div>
        </div>
      </div>

      {/* Overlay for mobile */}
      {mobileMenuOpen && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-50 d-md-none"
          style={{ zIndex: 1500 }}
          onClick={() => setMobileMenuOpen(false)}
        ></div>
      )}

      {/* Main Section */}
      <div className="flex-grow-1 d-flex overflow-hidden">
        {/* Sidebar */}
        <aside
          className={`text-white d-flex flex-column position-fixed h-100 ${
            mobileMenuOpen ? "active" : ""
          }`}
          style={{
            width: sidebarCollapsed ? "70px" : "240px",
            backgroundColor: "#001f3f",
            overflowY: "auto",
            transition: "width 0.3s ease, transform 0.3s ease",
            zIndex: 2000,
          }}
        >
          {/* Collapse Button */}
          <button
            className="btn btn-sm text-white mt-2 ms-auto me-2"
            style={{ background: "none" }}
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          >
            <FaChevronLeft
              style={{
                transform: sidebarCollapsed ? "rotate(180deg)" : "rotate(0deg)",
                transition: "transform 0.3s ease",
              }}
            />
          </button>

          {menuItems.map((item) => (
            <div
              key={item.name}
              onClick={() => handleSelect(item.name)}
              className={`d-flex align-items-center gap-2 p-2 rounded mb-1 ${
                selected === item.name ? "bg-primary" : "bg-transparent"
              }`}
              style={{
                cursor: "pointer",
                transition: "background 0.2s",
                justifyContent: sidebarCollapsed ? "center" : "flex-start",
              }}
            >
              <span style={{ fontSize: "1.2rem" }}>{item.icon}</span>
              {!sidebarCollapsed && <span>{item.name}</span>}
            </div>
          ))}
        </aside>

        {/* Main Content */}
        <div
          className="flex-grow-1 p-3 overflow-auto"
          style={{
            marginLeft:
              window.innerWidth <= 768
                ? "0"
                : sidebarCollapsed
                ? "70px"
                : "240px",
            transition: "margin-left 0.3s ease",
          }}
        >
          <div className="bg-white p-3 rounded shadow-sm h-100">
            <SelectedComponent />
          </div>
        </div>
      </div>

      {/* Styles */}
      <style>{`
        ::-webkit-scrollbar {
          width: 6px;
        }
        ::-webkit-scrollbar-thumb {
          background-color: #0d6efd;
          border-radius: 10px;
        }
        ::-webkit-scrollbar-thumb:hover {
          background-color: #0b5ed7;
        }

        @media (max-width: 768px) {
          aside {
            position: fixed !important;
            height: 100vh;
            top: 0;
            left: 0;
            transform: translateX(-100%);
          }
          aside.active {
            transform: translateX(0);
          }
        }
      `}</style>
    </div>
  );
};

export default AdminDashboard;
