import { useEffect, useState } from "react";
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaSync,
  FaTag,
  FaCheck,
  FaTimes,
  FaSearch,
  FaSortAlphaDown,
  FaSortAlphaUp,
} from "react-icons/fa";

const Categories = () => {
  const adminData = JSON.parse(sessionStorage.getItem("user"));
  const storeId = adminData?.storeid;

  const [categories, setCategories] = useState([]);
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [newCategory, setNewCategory] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortAsc, setSortAsc] = useState(true);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editedCategory, setEditedCategory] = useState("");

  const BaseUrl = "https://api.volunteerconnect.co.ke";

  // Fetch categories
  const fetchCategories = async () => {
    if (!storeId) return;
    setLoading(true);
    try {
      const res = await fetch(`${BaseUrl}/categories?storeid=${storeId}`);
      const data = await res.json();
      setCategories(data);
      setFilteredCategories(data);
    } catch (err) {
      console.error("Error fetching categories:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, [storeId]);

  // Filter + Sort
  useEffect(() => {
    let filtered = categories.filter((cat) =>
      cat.category.toLowerCase().includes(searchTerm.toLowerCase())
    );
    filtered.sort((a, b) =>
      sortAsc
        ? a.category.localeCompare(b.category)
        : b.category.localeCompare(a.category)
    );
    setFilteredCategories(filtered);
  }, [categories, searchTerm, sortAsc]);

  // Add new category
  const handleAdd = async () => {
    if (!newCategory.trim()) return alert("Please enter category name");
    setAdding(true);
    try {
      const res = await fetch(`${BaseUrl}/categories`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ category: newCategory, storeid: storeId }),
      });
      const data = await res.json();
      if (res.ok) {
        setCategories((prev) => [...prev, data]);
        setNewCategory("");
      } else {
        alert(data.error);
      }
    } catch (err) {
      console.error("Error adding category:", err);
    } finally {
      setAdding(false);
    }
  };

  // Update category
  const handleUpdate = async (id) => {
    if (!editedCategory.trim()) return alert("Please enter category name");
    try {
      const res = await fetch(`${BaseUrl}/categories/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ category: editedCategory }),
      });
      const data = await res.json();
      if (res.ok) {
        setCategories((prev) =>
          prev.map((cat) => (cat.id === id ? data : cat))
        );
        setEditingId(null);
        setEditedCategory("");
      } else {
        alert(data.error);
      }
    } catch (err) {
      console.error("Error updating category:", err);
    }
  };

  // Delete category
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this category?"))
      return;
    try {
      const res = await fetch(`${BaseUrl}/categories/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (res.ok) {
        setCategories((prev) => prev.filter((cat) => cat.id !== id));
      } else {
        alert(data.error);
      }
    } catch (err) {
      console.error("Error deleting category:", err);
    }
  };

  return (
    <div className="container py-4">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4 className="fw-bold text-primary mb-0">
          <FaTag className="me-2" /> Categories
        </h4>
        <button
          className="btn btn-outline-primary btn-sm d-flex align-items-center gap-2"
          onClick={fetchCategories}
        >
          <FaSync /> Refresh
        </button>
      </div>

      {/* Notice */}
      <div className="alert alert-info py-2 mb-3 small">
        <strong>Note:</strong> If you add or edit a category, please refresh for
        changes to apply.
      </div>

      {/* Add Category */}
      <div
        className="card shadow-sm mb-4"
        style={{ borderLeft: "5px solid #001f3f" }}
      >
        <div className="card-body d-flex flex-column flex-md-row align-items-center gap-2">
          <input
            type="text"
            className="form-control"
            placeholder="Enter category name..."
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
          />
          <button
            className="btn btn-primary d-flex align-items-center gap-2"
            onClick={handleAdd}
            disabled={adding}
          >
            {adding ? (
              <>
                <span className="spinner-border spinner-border-sm"></span>
                Adding...
              </>
            ) : (
              <>
                <FaPlus /> Add Category
              </>
            )}
          </button>
        </div>
      </div>

      {/* Search + Sort */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-center mb-3 gap-2">
        <div
          className="position-relative"
          style={{ width: "100%", maxWidth: 350 }}
        >
          <FaSearch
            className="position-absolute"
            style={{
              top: "50%",
              left: "10px",
              transform: "translateY(-50%)",
              color: "#888",
            }}
          />
          <input
            type="text"
            className="form-control ps-5"
            placeholder="Search category..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <FaTimes
              className="position-absolute"
              style={{
                top: "50%",
                right: "10px",
                transform: "translateY(-50%)",
                color: "#888",
                cursor: "pointer",
              }}
              onClick={() => setSearchTerm("")}
            />
          )}
        </div>

        <button
          className="btn btn-outline-secondary btn-sm d-flex align-items-center gap-2"
          onClick={() => setSortAsc(!sortAsc)}
        >
          {sortAsc ? (
            <>
              <FaSortAlphaDown /> Sort A–Z
            </>
          ) : (
            <>
              <FaSortAlphaUp /> Sort Z–A
            </>
          )}
        </button>
      </div>

      {/* Table */}
      <div className="card shadow-sm">
        <div className="card-body table-responsive">
          {loading ? (
            // Skeleton Loader
            <div>
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="placeholder-glow mb-3 d-flex justify-content-between align-items-center"
                >
                  <span className="placeholder col-6 bg-secondary"></span>
                  <span className="placeholder col-2 bg-secondary"></span>
                </div>
              ))}
            </div>
          ) : filteredCategories.length === 0 ? (
            <p className="text-muted text-center">No categories found.</p>
          ) : (
            <table className="table table-hover align-middle">
              <thead
                className="text-white"
                style={{ backgroundColor: "#001f3f" }}
              >
                <tr>
                  <th>#</th>
                  <th>Category</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredCategories.map((cat, index) => (
                  <tr key={cat.id}>
                    <td>{index + 1}</td>
                    <td>
                      {editingId === cat.id ? (
                        <input
                          type="text"
                          value={editedCategory}
                          onChange={(e) => setEditedCategory(e.target.value)}
                          className="form-control form-control-sm"
                        />
                      ) : (
                        cat.category
                      )}
                    </td>
                    <td>
                      {editingId === cat.id ? (
                        <div className="d-flex gap-2">
                          <button
                            className="btn btn-success btn-sm"
                            onClick={() => handleUpdate(cat.id)}
                          >
                            <FaCheck />
                          </button>
                          <button
                            className="btn btn-secondary btn-sm"
                            onClick={() => setEditingId(null)}
                          >
                            <FaTimes />
                          </button>
                        </div>
                      ) : (
                        <div className="d-flex gap-2">
                          <button
                            className="btn btn-outline-dark btn-sm"
                            onClick={() => {
                              setEditingId(cat.id);
                              setEditedCategory(cat.category);
                            }}
                          >
                            <FaEdit />
                          </button>
                          <button
                            className="btn btn-outline-danger btn-sm"
                            onClick={() => handleDelete(cat.id)}
                          >
                            <FaTrash />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Responsive tweaks */}
      <style>{`
        .card {
          border-radius: 12px;
        }
        @media (max-width: 768px) {
          table {
            font-size: 0.9rem;
          }
          h4 {
            font-size: 1.1rem;
          }
        }
      `}</style>
    </div>
  );
};

export default Categories;
