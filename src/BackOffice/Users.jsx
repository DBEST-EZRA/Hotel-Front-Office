import { useEffect, useState } from "react";
import axios from "axios";
import { Table, Button, Form, Spinner, Row, Col } from "react-bootstrap";
import { FaUserPlus, FaEdit, FaTrash } from "react-icons/fa";

const API_URL = "https://api.volunteerconnect.co.ke/users";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingUser, setEditingUser] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    role: "staff",
  });

  const adminData = JSON.parse(sessionStorage.getItem("user"));
  const storeId = adminData?.storeid;

  // Fetch users for this store
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(API_URL);
      const filtered = data.filter((u) => u.storeid === storeId);
      setUsers(filtered);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Handle Add/Edit user
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingUser) {
        await axios.put(`${API_URL}/${editingUser.id}`, {
          ...formData,
          storeid: storeId,
        });
      } else {
        await axios.post(API_URL, {
          ...formData,
          storeid: storeId,
        });
      }
      fetchUsers();
      resetForm();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || "Error saving user");
    }
  };

  const resetForm = () => {
    setEditingUser(null);
    setFormData({ name: "", email: "", phone: "", role: "staff" });
  };

  // Handle Delete
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      await axios.delete(`${API_URL}/${id}`);
      fetchUsers();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || "Error deleting user");
    }
  };

  // Handle Edit
  const handleEdit = (user) => {
    setEditingUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div
      className="container mt-4"
      style={{
        fontFamily: "'Helvetica Neue', Arial, sans-serif",
        fontSize: "0.9rem",
      }}
    >
      <h3 className="mb-3" style={{ color: "#3c51a1" }}>
        Users Management
      </h3>

      {/* Add/Edit User Form */}
      <div
        className="p-3 mb-4 shadow-sm rounded"
        style={{ backgroundColor: "#f8f9fa" }}
      >
        <Form onSubmit={handleSubmit}>
          <Row className="g-3">
            <Col md={3} sm={12}>
              <Form.Group>
                <Form.Label>Name</Form.Label>
                <Form.Control
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                />
              </Form.Group>
            </Col>

            {!editingUser && (
              <Col md={3} sm={12}>
                <Form.Group>
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                  />
                </Form.Group>
              </Col>
            )}

            <Col md={3} sm={12}>
              <Form.Group>
                <Form.Label>Phone</Form.Label>
                <Form.Control
                  type="text"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                />
              </Form.Group>
            </Col>

            <Col md={2} sm={12}>
              <Form.Group>
                <Form.Label>Role</Form.Label>
                <Form.Select
                  value={formData.role}
                  onChange={(e) =>
                    setFormData({ ...formData, role: e.target.value })
                  }
                >
                  <option value="admin">Admin</option>
                  <option value="manager">Manager</option>
                  <option value="cashier">Cashier</option>
                  <option value="staff">Staff</option>
                </Form.Select>
              </Form.Group>
            </Col>

            <Col md={1} sm={12} className="d-flex align-items-end">
              <Button
                type="submit"
                style={{
                  backgroundColor: "#88c244",
                  borderColor: "#88c244",
                  width: "100%",
                }}
              >
                <FaUserPlus className="me-1" />
                {editingUser ? "Update" : "Add"}
              </Button>
            </Col>
          </Row>

          {editingUser && (
            <div className="text-end mt-2">
              <Button variant="secondary" size="sm" onClick={resetForm}>
                Cancel Edit
              </Button>
            </div>
          )}
        </Form>
      </div>

      {/* Users Table */}
      {loading ? (
        <div className="text-center">
          <Spinner animation="border" />
        </div>
      ) : users.length === 0 ? (
        <p className="text-muted text-center">No users found.</p>
      ) : (
        <Table striped bordered hover responsive className="shadow-sm">
          <thead style={{ background: "#3c51a1", color: "white" }}>
            <tr>
              <th style={{ backgroundColor: "#3c51a1", color: "white" }}>
                Name
              </th>
              <th style={{ backgroundColor: "#3c51a1", color: "white" }}>
                Email
              </th>
              <th style={{ backgroundColor: "#3c51a1", color: "white" }}>
                Phone
              </th>
              <th style={{ backgroundColor: "#3c51a1", color: "white" }}>
                Role
              </th>
              <th
                style={{ backgroundColor: "#3c51a1", color: "white" }}
                className="text-center"
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id}>
                <td>{u.name}</td>
                <td>{u.email}</td>
                <td>{u.phone || "-"}</td>
                <td>{u.role}</td>
                <td className="text-center">
                  <Button
                    variant="outline-primary"
                    size="sm"
                    className="me-2"
                    onClick={() => handleEdit(u)}
                  >
                    <FaEdit />
                  </Button>
                  <Button
                    variant="outline-danger"
                    size="sm"
                    onClick={() => handleDelete(u.id)}
                  >
                    <FaTrash />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </div>
  );
};

export default Users;
