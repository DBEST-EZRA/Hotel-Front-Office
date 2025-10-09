import React, { useEffect, useState } from "react";
import axios from "axios";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import {
  FaStore,
  FaEnvelope,
  FaPhone,
  FaLink,
  FaCalendarAlt,
  FaUsers,
  FaBoxOpen,
  FaChartLine,
  FaTags,
} from "react-icons/fa";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const Restaurant = () => {
  const adminData = JSON.parse(sessionStorage.getItem("user"));
  const storeId = adminData?.storeid;
  const [store, setStore] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [location, setLocation] = useState(null);

  // Dummy stats
  const stats = [
    {
      label: "Staff",
      value: 8,
      icon: <FaUsers />,
      bg: "#3c51a1",
      text: "white",
    },
    {
      label: "Products",
      value: 152,
      icon: <FaBoxOpen />,
      bg: "#88c244",
      text: "white",
    },
    {
      label: "Categories",
      value: 9,
      icon: <FaTags />,
      bg: "#6c757d",
      text: "white",
    },
    {
      label: "Monthly Sales",
      value: "KES 184,500",
      icon: <FaChartLine />,
      bg: "red",
      text: "white",
    },
  ];

  // Dummy sales data for chart
  const salesData = [
    { day: "Mon", sales: 23000 },
    { day: "Tue", sales: 27000 },
    { day: "Wed", sales: 32000 },
    { day: "Thu", sales: 29000 },
    { day: "Fri", sales: 41000 },
    { day: "Sat", sales: 38000 },
    { day: "Sun", sales: 25000 },
  ];

  useEffect(() => {
    const fetchStore = async () => {
      try {
        const res = await axios.get(
          `https://api.volunteerconnect.co.ke/stores?storeId=${storeId}`
        );
        setStore(res.data[0]);
      } catch {
        setError("Failed to load store details");
      } finally {
        setLoading(false);
      }
    };
    fetchStore();

    // Auto-detect location
    navigator.geolocation.getCurrentPosition(
      (pos) =>
        setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      () => setLocation(null)
    );
  }, [storeId]);

  return (
    <div
      className="container py-4"
      style={{ background: "#f8f9fa", minHeight: "100vh" }}
    >
      {/* Header */}
      <h3
        className="fw-bold mb-3 d-flex align-items-center gap-2"
        style={{
          color: "#3c51a1",
          borderBottom: "1px solid #dcdcdc",
          display: "inline-block",
          textTransform: "capitalize",
        }}
      >
        <FaStore className="me-2" />
        {loading ? <Skeleton width={150} /> : store?.name || "Restaurant"}
      </h3>

      {/* Stats Cards */}
      <div className="row mb-4">
        {stats.map((s, i) => (
          <div className="col-6 col-md-3 mb-3" key={i}>
            <div
              className="card text-center border-0 rounded-4 shadow-sm h-100"
              style={{
                backgroundColor: s.bg,
                color: s.text,
                transition: "transform 0.2s",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.transform = "scale(1.03)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.transform = "scale(1)")
              }
            >
              <div className="card-body">
                <div style={{ fontSize: "2rem" }}>{s.icon}</div>
                <h6 className="mt-2">{s.label}</h6>
                <h5 className="fw-bold">{s.value}</h5>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Sales Chart and Map */}
      <div className="row mb-4">
        <div className="col-md-8 mb-3">
          <div
            className="card shadow-sm border-0 rounded-4"
            style={{ height: "300px" }}
          >
            <div
              className="card-header fw-bold text-white"
              style={{ backgroundColor: "#3c51a1" }}
            >
              Daily Sales Overview
            </div>
            <div className="card-body">
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={salesData}>
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="sales" fill="#88c244" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="col-md-4 mb-3">
          <div
            className="card shadow-sm border-0 rounded-4"
            style={{ height: "300px" }}
          >
            <div
              className="card-header fw-bold text-white"
              style={{ backgroundColor: "#3c51a1" }}
            >
              Current Location
            </div>
            <div className="card-body p-0">
              {location ? (
                <iframe
                  title="map"
                  width="100%"
                  height="260"
                  style={{ border: 0, borderRadius: "0 0 1rem 1rem" }}
                  src={`https://www.google.com/maps?q=${location.lat},${location.lng}&z=15&output=embed`}
                  allowFullScreen
                ></iframe>
              ) : (
                <p className="text-center text-muted mt-5">
                  Location unavailable
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Store Details - two column layout */}
      <div
        className="p-4 shadow-sm rounded-4"
        style={{
          backgroundColor: "white",
          borderLeft: "6px solid #3c51a1",
          fontSize: "1rem",
          lineHeight: "1.8",
        }}
      >
        {loading ? (
          <Skeleton count={6} height={25} />
        ) : error ? (
          <p className="text-danger text-center fw-bold">{error}</p>
        ) : (
          <div className="row">
            <div className="col-md-6">
              <p>
                <strong>Type of Business:</strong>{" "}
                <span style={{ color: "#3c51a1" }}>{store?.typebusiness}</span>
              </p>
              <p>
                <FaEnvelope className="me-2 text-primary" />
                <strong>Email:</strong>{" "}
                <span style={{ color: "#3c51a1" }}>{store?.email || "—"}</span>
              </p>
              <p>
                <FaPhone className="me-2 text-success" />
                <strong>Phone:</strong>{" "}
                <span style={{ color: "#3c51a1" }}>{store?.phone || "—"}</span>
              </p>
            </div>

            <div className="col-md-6">
              <p>
                <FaLink className="me-2 text-secondary" />
                <strong>Website:</strong>{" "}
                <a
                  href={store?.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    color: "#88c244",
                    textDecoration: "none",
                    fontWeight: "500",
                  }}
                >
                  {store?.link || "—"}
                </a>
              </p>
              <p>
                <FaCalendarAlt className="me-2 text-danger" />
                <strong>Subscription Plan:</strong>{" "}
                <span style={{ color: "#3c51a1" }}>
                  {store?.subscriptionplan}
                </span>
              </p>
              <p>
                <strong>Expiry Date:</strong>{" "}
                <span className="fw-bold text-danger">{store?.expirydate}</span>
              </p>
            </div>
          </div>
        )}

        {!loading && !error && (
          <div
            className="mt-3 p-3 rounded-3"
            style={{
              backgroundColor: "#f0f2f5",
              fontStyle: "italic",
              color: "#555",
            }}
          >
            Created on:{" "}
            <strong>
              {new Date(store?.created_at).toLocaleDateString("en-GB")}
            </strong>
            <br />
            “Keep your restaurant info up to date to ensure accurate analytics
            and smoother management.”
          </div>
        )}
      </div>
    </div>
  );
};

export default Restaurant;
