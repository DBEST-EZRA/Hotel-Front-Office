import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaSearch, FaTimes, FaBarcode } from "react-icons/fa";

const Inventory = () => {
  const adminData = JSON.parse(sessionStorage.getItem("user"));
  const storeId = adminData?.storeid;
  const [inventory, setInventory] = useState([]);
  const [filteredInventory, setFilteredInventory] = useState([]);
  const [formData, setFormData] = useState({
    id: null,
    item: "",
    description: "",
    rate: "",
    category: "",
    vat: "0",
  });

  const [editing, setEditing] = useState(false);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [loading, setLoading] = useState(false);

  // Fetch inventory from backend
  const fetchInventory = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get("http://16.16.27.133:5000/inventory", {
        params: { storeId },
      });
      setInventory(data);
      setFilteredInventory(data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, [storeId]);

  // Handle search
  useEffect(() => {
    if (!search) {
      setFilteredInventory(inventory);
      setPage(1);
    } else {
      const results = inventory.filter((item) =>
        item.item.toLowerCase().includes(search.toLowerCase())
      );
      setFilteredInventory(results);
      setPage(1);
    }
  }, [search, inventory]);

  // Pagination calculations
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const currentPageItems = filteredInventory.slice(startIndex, endIndex);
  const totalPages = Math.ceil(filteredInventory.length / limit);

  // Handle form change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle submit (Add or Edit)
  // Handle submit (Add or Edit)
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing) {
        // Update existing record
        await axios.put(
          `http://16.16.27.133:5000/inventory/${formData.id}`,
          formData
        );
      } else {
        // Add new record
        await axios.post("http://16.16.27.133:5000/inventory", {
          ...formData,
          storeid: storeId, // still attach storeId if you need multi-store
        });
      }

      // Reset form fields after submit
      setFormData({
        id: null,
        item: "",
        description: "",
        rate: "",
        category: "",
        vat: "0", // reset to default 0%
      });

      setEditing(false);
      fetchInventory(); // Refresh inventory after add/edit
    } catch (err) {
      console.error("Error saving inventory item:", err);
    }
  };

  const handleEdit = (item) => {
    setFormData(item);
    setEditing(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      await axios.delete(`http://16.16.27.133:5000/inventory/${id}`);
      fetchInventory();
    }
  };

  // TO CHANGE
  const categories = ["Beverages", "Main Course", "Snacks", "Desserts"];

  return (
    <div className="container py-4">
      {/* Form Section */}
      <form
        onSubmit={handleSubmit}
        className="shadow rounded p-4 mb-4"
        style={{ backgroundColor: "#e9f3eeff" }}
      >
        <div className="row g-3">
          {/* Food Name */}
          <div className="col-md-4">
            <label className="form-label">Food Name</label>
            <input
              type="text"
              name="item"
              value={formData.item}
              onChange={handleChange}
              className="form-control"
              placeholder=""
              required
            />
          </div>

          {/* Description */}
          <div className="col-md-4">
            <label className="form-label">Description</label>
            <input
              type="text"
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="form-control"
              placeholder="Short Description"
            />
          </div>

          {/* Rate */}
          <div className="col-md-4">
            <label className="form-label">Rate</label>
            <input
              type="number"
              step="0.01"
              name="rate"
              value={formData.rate}
              onChange={handleChange}
              className="form-control"
              placeholder="price"
              required
            />
          </div>

          {/* Category Dropdown */}
          <div className="col-md-4">
            <label className="form-label">Category</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="form-select"
              required
            >
              <option value="">-- Select Category --</option>
              {categories.map((cat, index) => (
                <option key={index} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* VAT Dropdown */}
          <div className="col-md-4">
            <label className="form-label">VAT</label>
            <select
              name="vat"
              value={formData.vat ?? "0"}
              onChange={handleChange}
              className="form-select"
            >
              <option value="0">0%</option>
              <option value="16">16%</option>
            </select>
          </div>
        </div>

        <button
          type="submit"
          className="btn mt-3 text-white"
          style={{ backgroundColor: "#88c244" }}
        >
          {editing ? "Update Item" : "Add Item"}
        </button>
      </form>

      {/* Search & Pagination Controls */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-3 gap-3">
        <div className="position-relative w-100 w-md-50">
          <FaSearch
            className="position-absolute"
            style={{
              left: "10px",
              top: "10px",
              color: "blue",
            }}
          />
          <input
            type="text"
            style={{ background: "#b5d2eeff", color: "blue" }}
            placeholder="Search items..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="form-control ps-4"
          />
          {search && (
            <FaTimes
              className="position-absolute"
              style={{
                right: "10px",
                top: "10px",
                cursor: "pointer",
                color: "#aaa",
              }}
              onClick={() => setSearch("")}
            />
          )}
        </div>

        <div className="d-flex align-items-center">
          <label className="me-2">Show</label>
          <select
            value={limit}
            onChange={(e) => setLimit(Number(e.target.value))}
            className="form-select w-auto"
          >
            {[10, 25, 50, 100].map((val) => (
              <option key={val} value={val}>
                {val}
              </option>
            ))}
          </select>
          <span className="ms-1">entries</span>
        </div>
      </div>

      {/* Table */}

      <div className="table-responsive">
        <table className="table table-striped table-sm align-middle">
          <thead className="text-white" style={{ backgroundColor: "#3c51a1" }}>
            <tr>
              <th>Item</th>
              <th>Description</th>
              <th>Category</th>
              <th>Rate</th>
              <th>VAT</th>
              <th className="text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} className="text-center py-3">
                  Loading...
                </td>
              </tr>
            ) : currentPageItems.length > 0 ? (
              currentPageItems.map((item) => (
                <tr key={item.id}>
                  <td>{item.item}</td>
                  <td>{item.description}</td>
                  <td>{item.category}</td>
                  <td>{item.rate}</td>
                  <td>{item.vat}</td>
                  <td className="text-center">
                    <button
                      onClick={() => handleEdit(item)}
                      className="btn btn-sm btn-outline-primary me-2"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="btn btn-sm btn-outline-danger"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="text-center py-3">
                  No items found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="d-flex justify-content-between align-items-center mt-3">
        <button
          disabled={page === 1}
          onClick={() => setPage((p) => p - 1)}
          className="btn btn-outline-secondary"
        >
          Prev
        </button>

        <div className="btn-group">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => setPage(p)}
              className={`btn btn-outline-secondary ${
                p === page ? "active" : ""
              }`}
            >
              {p}
            </button>
          ))}
        </div>

        <button
          disabled={page === totalPages}
          onClick={() => setPage((p) => p + 1)}
          className="btn btn-outline-secondary"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Inventory;
