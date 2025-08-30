import React, { useState, useEffect } from "react";
import { adminService } from "../../Services/adminServices";
import { FaPlus, FaTrash, FaTag } from "react-icons/fa";

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [newCategory, setNewCategory] = useState({ name: "", description: "" });
  const [actionLoading, setActionLoading] = useState({});

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await adminService.getCategories();
      const categoriesData = response.data || response;
      setCategories(categoriesData);
    } catch (err) {
      console.error("Failed to fetch categories:", err);
      setError("Failed to load categories. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleAddCategory = async (e) => {
    e.preventDefault();

    if (!newCategory.name.trim()) {
      alert("Category name is required");
      return;
    }

    try {
      setActionLoading((prev) => ({ ...prev, add: true }));

      const response = await adminService.createCategory(newCategory);
      const createdCategory = response.data || response;

      setCategories((prev) => [...prev, createdCategory]);
      setNewCategory({ name: "", description: "" });
      setShowAddForm(false);

      alert("Category created successfully!");
    } catch (err) {
      console.error("Failed to create category:", err);
      alert("Failed to create category. Please try again.");
    } finally {
      setActionLoading((prev) => ({ ...prev, add: false }));
    }
  };

  const handleDeleteCategory = async (categoryId) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this category? This action cannot be undone."
      )
    ) {
      return;
    }

    try {
      setActionLoading((prev) => ({ ...prev, [categoryId]: true }));

      await adminService.deleteCategory(categoryId);

      setCategories((prev) => prev.filter((cat) => cat._id !== categoryId));

      alert("Category deleted successfully!");
    } catch (err) {
      console.error("Failed to delete category:", err);
      alert("Failed to delete category. Please try again.");
    } finally {
      setActionLoading((prev) => ({ ...prev, [categoryId]: false }));
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-md p-4">
        <div className="text-red-600">{error}</div>
        <button
          onClick={fetchCategories}
          className="mt-2 text-red-600 hover:text-red-500 font-medium"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Categories</h1>
          <p className="mt-1 text-sm text-gray-600">
            Manage book categories in the library system
          </p>
        </div>

        <button
          onClick={() => setShowAddForm(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        >
                         <FaPlus className="w-4 h-4 mr-2" />
          Add Category
        </button>
      </div>

      {/* Add Category Form */}
      {showAddForm && (
        <div className="bg-white p-6 rounded-lg shadow border">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Add New Category
          </h3>

          <form onSubmit={handleAddCategory} className="space-y-4">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Category Name *
              </label>
              <input
                type="text"
                id="name"
                value={newCategory.name}
                onChange={(e) =>
                  setNewCategory((prev) => ({ ...prev, name: e.target.value }))
                }
                className="input-field"
                placeholder="Enter category name"
                required
              />
            </div>

            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Description
              </label>
              <textarea
                id="description"
                rows="3"
                value={newCategory.description}
                onChange={(e) =>
                  setNewCategory((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                className="input-field"
                placeholder="Enter category description (optional)"
              />
            </div>

            <div className="flex items-center space-x-3">
              <button
                type="submit"
                disabled={actionLoading.add}
                className="btn-primary disabled:opacity-50"
              >
                {actionLoading.add ? "Creating..." : "Create Category"}
              </button>

              <button
                type="button"
                onClick={() => {
                  setShowAddForm(false);
                  setNewCategory({ name: "", description: "" });
                }}
                className="btn-secondary"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories &&
          categories.map((category) => (
            <div
              key={category._id}
              className="bg-white rounded-lg shadow border p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                                         <FaTag className="w-5 h-5 text-primary-600" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-lg font-medium text-gray-900">
                      {category.name}
                    </h3>
                  </div>
                </div>

                <button
                  onClick={() => handleDeleteCategory(category._id)}
                  disabled={actionLoading[category._id]}
                  className="text-red-600 hover:text-red-900 disabled:opacity-50"
                  title="Delete category"
                >
                                     <FaTrash className="w-4 h-4" />
                </button>
              </div>

              {category.description && (
                <p className="text-sm text-gray-600 mb-4">
                  {category.description}
                </p>
              )}

              <div className="text-sm text-gray-500">
                <span className="font-medium">{category.bookCount || 0}</span>{" "}
                books in this category
              </div>
            </div>
          ))}
      </div>

      {categories && categories.length === 0 && (
        <div className="text-center py-12">
                     <FaTag className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            No categories found
          </h3>
          <p className="text-sm text-gray-500">
            Get started by creating your first book category.
          </p>
          <div className="mt-6">
            <button
              onClick={() => setShowAddForm(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              <FaPlus className="w-4 h-4 mr-2" />
              Add Category
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Categories;
