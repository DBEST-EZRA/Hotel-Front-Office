import React, { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { FaDatabase, FaSync, FaServer } from "react-icons/fa";

const Database = () => {
  const [stats, setStats] = useState([]);
  const [reads, setReads] = useState(0);
  const [writes, setWrites] = useState(0);

  // Generate random data every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      const newReads = Math.floor(Math.random() * 500);
      const newWrites = Math.floor(Math.random() * 300);
      const time = new Date().toLocaleTimeString();

      setReads(newReads);
      setWrites(newWrites);
      setStats((prev) => [
        ...prev.slice(-9), // keep only last 10 points
        { time, reads: newReads, writes: newWrites },
      ]);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="container py-4">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4 className="fw-bold text-primary mb-0 d-flex align-items-center gap-2">
          <FaDatabase /> Database Monitor
        </h4>
        <button
          className="btn btn-outline-primary d-flex align-items-center gap-2"
          onClick={() => setStats([])}
        >
          <FaSync /> Reset Stats
        </button>
      </div>

      {/* Summary Cards */}
      <div className="row g-3 mb-4">
        <div className="col-md-4">
          <div
            className="card shadow-sm text-white"
            style={{ backgroundColor: "#001f3f" }}
          >
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="text-uppercase">Reads/sec</h6>
                  <h3>{reads}</h3>
                </div>
                <FaServer size={32} />
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div
            className="card shadow-sm text-white"
            style={{ backgroundColor: "#3c51a1" }}
          >
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="text-uppercase">Writes/sec</h6>
                  <h3>{writes}</h3>
                </div>
                <FaServer size={32} />
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div
            className="card shadow-sm text-white"
            style={{ backgroundColor: "maroon" }}
          >
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="text-uppercase">Total Operations</h6>
                  <h3>{reads + writes}</h3>
                </div>
                <FaServer size={32} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="card shadow-sm">
        <div
          className="card-header text-white fw-bold"
          style={{ backgroundColor: "#001f3f" }}
        >
          Live Read/Write Activity
        </div>
        <div className="card-body bg-light">
          {stats.length === 0 ? (
            <p className="text-center text-muted my-5">
              Waiting for data to stream...
            </p>
          ) : (
            <div style={{ width: "100%", height: 350 }}>
              <ResponsiveContainer>
                <LineChart data={stats}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ccc" />
                  <XAxis dataKey="time" />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="reads"
                    stroke="#3c51a1"
                    strokeWidth={2}
                    dot={false}
                    name="Reads"
                  />
                  <Line
                    type="monotone"
                    dataKey="writes"
                    stroke="red"
                    strokeWidth={2}
                    dot={false}
                    name="Writes"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </div>

      {/* Table (Recent Activity) */}
      <div className="card shadow-sm mt-4">
        <div
          className="card-header text-white fw-bold"
          style={{ backgroundColor: "#3c51a1" }}
        >
          Recent Operations (Dummy Data)
        </div>
        <div className="card-body table-responsive">
          <table className="table table-hover align-middle">
            <thead style={{ backgroundColor: "#001f3f", color: "white" }}>
              <tr>
                <th>#</th>
                <th>Operation</th>
                <th>Status</th>
                <th>Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {["Read", "Write", "Write", "Read", "Delete"].map((op, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{op}</td>
                  <td>
                    <span
                      className={`badge ${
                        op === "Delete"
                          ? "bg-danger"
                          : op === "Write"
                          ? "bg-primary"
                          : "bg-secondary"
                      }`}
                    >
                      {op === "Delete" ? "Error" : "Success"}
                    </span>
                  </td>
                  <td>{new Date().toLocaleTimeString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Styles */}
      <style>{`
        h6 { letter-spacing: 1px; }
        .card {
          border-radius: 12px;
        }
        @media (max-width: 768px) {
          h4 { font-size: 1.1rem; }
          h3 { font-size: 1.4rem; }
        }
      `}</style>
    </div>
  );
};

export default Database;
