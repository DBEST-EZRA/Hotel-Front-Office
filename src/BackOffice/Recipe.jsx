import React, { useState } from "react";
import { Modal, Button, Table, Form } from "react-bootstrap";
import { FaPlus, FaEdit, FaTrash, FaUtensils } from "react-icons/fa";

const Recipe = () => {
  const [showModal, setShowModal] = useState(false);
  const [editingRecipe, setEditingRecipe] = useState(null);
  const [recipes, setRecipes] = useState([
    {
      id: 1,
      name: "Beef Stew",
      category: "Main Dish",
      ingredients: "Beef, onions, tomatoes, garlic, oil, salt",
      procedure: `1. Heat oil in a pan.\n2. Add onions and sauté.\n3. Add beef and brown.\n4. Add tomatoes and simmer.\n5. Cook until tender.`,
    },
    {
      id: 2,
      name: "Chicken Soup",
      category: "Starter",
      ingredients: "Chicken, garlic, carrots, onions, salt",
      procedure: `1. Boil chicken until soft.\n2. Add vegetables.\n3. Simmer for 15 minutes.\n4. Add seasoning.\n5. Serve hot.`,
    },
    {
      id: 3,
      name: "Fruit Salad",
      category: "Dessert",
      ingredients: "Pineapple, banana, apple, mango, honey",
      procedure: `1. Chop fruits into cubes.\n2. Mix in a bowl.\n3. Drizzle honey.\n4. Chill and serve.`,
    },
  ]);

  const [form, setForm] = useState({
    name: "",
    category: "",
    ingredients: "",
    procedure: "",
  });

  const handleShowModal = (recipe = null) => {
    if (recipe) setForm(recipe);
    else setForm({ name: "", category: "", ingredients: "", procedure: "" });
    setEditingRecipe(recipe);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingRecipe(null);
  };

  const handleSaveRecipe = () => {
    if (editingRecipe) {
      setRecipes(
        recipes.map((r) =>
          r.id === editingRecipe.id ? { ...form, id: editingRecipe.id } : r
        )
      );
    } else {
      setRecipes([...recipes, { ...form, id: recipes.length + 1 }]);
    }
    handleCloseModal();
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this recipe?")) {
      setRecipes(recipes.filter((r) => r.id !== id));
    }
  };

  return (
    <div className="container-fluid py-4">
      {/* Header */}
      <div
        className="d-flex justify-content-between align-items-center mb-4 p-3 rounded"
        style={{
          background: "#3c51a1",
          color: "white",
        }}
      >
        <h4 className="mb-0 d-flex align-items-center gap-2">
          <FaUtensils /> Recipe Management
        </h4>
        <Button
          variant="light"
          className="fw-bold d-flex align-items-center gap-2"
          onClick={() => handleShowModal()}
          style={{ color: "#3c51a1" }}
        >
          <FaPlus /> Add Recipe
        </Button>
      </div>

      {/* Recipe Table */}
      <div className="table-responsive shadow-sm">
        <Table striped bordered hover className="align-middle text-center">
          <thead
            style={{
              backgroundColor: "#4d6ff5",
              color: "white",
            }}
          >
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Category</th>
              <th>Ingredients</th>
              <th>Procedure</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {recipes.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-muted">
                  No recipes available
                </td>
              </tr>
            ) : (
              recipes.map((recipe, index) => (
                <tr key={recipe.id}>
                  <td>{index + 1}</td>
                  <td>{recipe.name}</td>
                  <td>{recipe.category}</td>
                  <td>{recipe.ingredients}</td>
                  <td
                    style={{
                      maxWidth: "250px",
                      whiteSpace: "pre-line",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {recipe.procedure}
                  </td>
                  <td>
                    <div className="d-flex justify-content-center gap-2">
                      <Button
                        variant="outline-primary"
                        size="sm"
                        onClick={() => handleShowModal(recipe)}
                      >
                        <FaEdit />
                      </Button>
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => handleDelete(recipe.id)}
                      >
                        <FaTrash />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </Table>
      </div>

      {/* Add/Edit Recipe Modal */}
      <Modal show={showModal} onHide={handleCloseModal} centered size="lg">
        <Modal.Header
          closeButton
          style={{
            background: "#3c51a1",
            color: "white",
            padding: "10px 15px",
          }}
        >
          <Modal.Title style={{ fontSize: "1rem" }}>
            {editingRecipe ? "Edit Recipe" : "Add Recipe"}
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter recipe name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Category</Form.Label>
              <Form.Select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
              >
                <option value="">Select Category</option>
                <option value="Starter">Starter</option>
                <option value="Main Dish">Main Dish</option>
                <option value="Dessert">Dessert</option>
                <option value="Beverage">Beverage</option>
                <option value="Snack">Snack</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Ingredients</Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                placeholder="Enter ingredients"
                value={form.ingredients}
                onChange={(e) =>
                  setForm({ ...form, ingredients: e.target.value })
                }
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Procedure (step-by-step)</Form.Label>
              <Form.Control
                as="textarea"
                rows={6}
                placeholder={`1. Step one\n2. Step two\n3. Step three...`}
                value={form.procedure}
                onChange={(e) =>
                  setForm({ ...form, procedure: e.target.value })
                }
              />
            </Form.Group>
          </Form>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSaveRecipe}>
            {editingRecipe ? "Update" : "Save"}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Recipe;
