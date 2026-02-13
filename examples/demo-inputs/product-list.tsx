"use client";

import { useState, useEffect } from "react";

interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  imageUrl: string;
  inStock: boolean;
}

type SortField = "name" | "price";

export default function ProductList() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState<SortField>("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  useEffect(() => {
    async function loadProducts() {
      setLoading(true);
      try {
        const res = await fetch(`/api/products?category=${selectedCategory}`);
        const data = await res.json();
        setProducts(data.products);
      } catch (err) {
        console.error("Failed to load products:", err);
      } finally {
        setLoading(false);
      }
    }
    loadProducts();
  }, [selectedCategory]);

  const formatPrice = (price: any) => {
    return `$${price.toFixed(2)}`;
  };

  const filteredProducts = products
    .filter((p) => p.name.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => {
      const modifier = sortOrder === "asc" ? 1 : -1;
      if (sortBy === "price") return (a.price - b.price) * modifier;
      return a.name.localeCompare(b.name) * modifier;
    });

  if (loading) {
    return <div>Loading products...</div>;
  }

  return (
    <div className="product-list-page">
      <div className="filters">
        <input
          type="text"
          placeholder="Search products..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />

        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option value="all">All Categories</option>
          <option value="electronics">Electronics</option>
          <option value="clothing">Clothing</option>
          <option value="home">Home & Garden</option>
        </select>

        <select
          value={`${sortBy}-${sortOrder}`}
          onChange={(e) => {
            const [field, order] = e.target.value.split("-");
            setSortBy(field as SortField);
            setSortOrder(order as "asc" | "desc");
          }}
        >
          <option value="name-asc">Name A-Z</option>
          <option value="name-desc">Name Z-A</option>
          <option value="price-asc">Price Low-High</option>
          <option value="price-desc">Price High-Low</option>
        </select>
      </div>

      <div className="product-grid">
        {filteredProducts.map((product, index) => (
          <div key={index} className="product-card">
            <img src={product.imageUrl} />
            <h3>{product.name}</h3>
            <p className="category">{product.category}</p>
            <p className="price">{formatPrice(product.price)}</p>
            <span
              className={`stock ${product.inStock ? "in-stock" : "out-of-stock"}`}
            >
              {product.inStock ? "In Stock" : "Out of Stock"}
            </span>
            <div
              className="add-to-cart"
              onClick={() => {
                fetch("/api/cart", {
                  method: "POST",
                  body: JSON.stringify({ productId: product.id, quantity: 1 }),
                });
              }}
            >
              Add to Cart
            </div>
          </div>
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <p>No products found matching your criteria.</p>
      )}
    </div>
  );
}
