import React, { useState } from "react";
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
  FaUser,
  FaBars,
  FaChevronDown,
} from "react-icons/fa";

import Settings from "./Settings";
import Users from "./Users";
import Inventory from "./Inventory";
import Reports from "./Reports";
import DailySales from "./DailySales";
import MonthlySales from "./MonthlySales";
import Expenses from "./Expenses";
import Supplies from "./Supplies";
import Compliance from "./Compliance";
import CoA from "./CoA";
import Notifications from "./Notifications";

const AdminDashboard = () => {
  const [selected, setSelected] = useState("Settings");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showReports, setShowReports] = useState(false);
  const [notifications, setNotifications] = useState(3);

  // Map components dynamically
  const Components = {
    Settings: () => <Settings />,
    Users: () => <Users />,
    Inventory: () => <Inventory />,
    Reports: () => <Reports />,
    "Daily Sales": () => <DailySales />,
    "Monthly Sales": () => <MonthlySales />,
    Expenses: () => <Expenses />,
    Supplies: () => <Supplies />,
    Compliance: () => <Compliance />,
    CoA: () => <CoA />,
    Notifications: () => <Notifications />,
  };

  const SelectedComponent = Components[selected] || (() => <p>No Component</p>);

  // Sidebar menu items (except Reports, which has submenu)
  const menuItems = [
    { name: "Settings", icon: <FaCog /> },
    { name: "Users", icon: <FaUsers /> },
    { name: "Inventory", icon: <FaBoxes /> },
    { name: "Expenses", icon: <FaMoneyBillWave /> },
    { name: "Supplies", icon: <FaTruck /> },
    { name: "Compliance", icon: <FaBalanceScale /> },
    { name: "CoA", icon: <FaFileInvoiceDollar /> },
  ];

  return (
    <div className="d-flex vh-100">
      {/* Sidebar */}
      <aside
        className="bg-dark text-white d-flex flex-column"
        style={{
          width: sidebarOpen ? "250px" : "70px",
          overflowY: "auto",
          transition: "width 0.3s ease",
        }}
      >
        <div className="flex-grow-1">
          {/* Reusable Menu Items */}
          {menuItems.map((item) => (
            <div
              key={item.name}
              className={`d-flex align-items-center p-2 rounded sidebar-item ${
                selected === item.name ? "bg-secondary" : ""
              }`}
              style={{ cursor: "pointer" }}
              onClick={() => setSelected(item.name)}
            >
              <span className="me-2">{item.icon}</span>
              {sidebarOpen && <span>{item.name}</span>}
            </div>
          ))}

          {/* Reports with Submenu */}
          <div className="mb-1">
            <div
              className={`d-flex align-items-center p-2 rounded sidebar-item ${
                ["Daily Sales", "Monthly Sales"].includes(selected)
                  ? "bg-secondary"
                  : ""
              }`}
              style={{ cursor: "pointer" }}
              onClick={() => setShowReports((prev) => !prev)}
            >
              <FaChartBar className="me-2" />
              {sidebarOpen && (
                <>
                  <span className="flex-grow-1">Reports</span>
                  <FaChevronDown
                    className={`ms-auto ${showReports ? "rotate-180" : ""}`}
                  />
                </>
              )}
            </div>
            {showReports && sidebarOpen && (
              <div className="ms-4">
                {["Daily Sales", "Monthly Sales"].map((sub) => (
                  <div
                    key={sub}
                    className={`p-2 rounded sidebar-sub-item ${
                      selected === sub ? "bg-secondary" : ""
                    }`}
                    style={{ cursor: "pointer" }}
                    onClick={() => setSelected(sub)}
                  >
                    {sub}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Main Section */}
      <div className="flex-grow-1 d-flex flex-column">
        {/* Topbar */}
        <div className="d-flex align-items-center justify-content-between bg-white shadow-sm p-3">
          {/* Toggle button (mobile) */}
          <button
            className="btn btn-outline-secondary d-lg-none"
            onClick={() => setSidebarOpen((prev) => !prev)}
          >
            <FaBars />
          </button>

          {/* Right Section */}
          <div className="d-flex align-items-center gap-4 ms-auto">
            {/* Notifications */}
            <div
              className="position-relative"
              style={{ cursor: "pointer" }}
              onClick={() => setSelected("Notifications")}
            >
              <FaBell />
              {notifications > 0 && (
                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                  {notifications}
                </span>
              )}
            </div>

            {/* User Info */}
            <div className="d-flex align-items-center gap-2">
              <FaUser />
              <span className="d-none d-sm-inline">Admin</span>
            </div>

            {/* Logout */}
            <div
              className="d-flex align-items-center gap-2 text-danger"
              style={{ cursor: "pointer" }}
              onClick={() => console.log("Logout clicked")}
            >
              <span className="d-none d-sm-inline">Logout</span>
              <FaSignOutAlt />
            </div>
          </div>
        </div>

        {/* Main Panel */}
        <div className="flex-grow-1 overflow-auto p-3 bg-light">
          {/* <h4 className="mb-3">{selected}</h4> */}
          <div className="bg-white rounded shadow-sm p-3">
            <SelectedComponent />
          </div>
        </div>
      </div>

      {/* CSS for hover */}
      <style>{`
        .sidebar-item:hover, .sidebar-sub-item:hover {
          background-color: rgba(255,255,255,0.1);
        }
        .rotate-180 {
          transform: rotate(180deg);
          transition: transform 0.3s ease;
        }
      `}</style>
    </div>
  );
};

export default AdminDashboard;
