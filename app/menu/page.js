"use client";
import SectionHeaders from "@/components/layout/SectionHeaders";
import { MenuItem } from "../../models/MenuItem";
import { useEffect, useState, memo } from "react";

// Memoized MenuItem component
const MemoizedMenuItem = memo(MenuItem);

export default function MenuPage() {
  const [categories, setCategories] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [loadingMenuItems, setLoadingMenuItems] = useState(true);
  const [invalidCategories, setInvalidCategories] = useState(false);
  const [invalidMenuItems, setInvalidMenuItems] = useState(false);

  // Function to validate categories
  const validateCategories = (data) => {
    return Array.isArray(data) && data.every((item) => item._id && item.name);
  };

  // Function to validate menu items
  const validateMenuItems = (data) => {
    return (
      Array.isArray(data) &&
      data.every((item) => item._id && item.category && item.name)
    );
  };

  useEffect(() => {
    // Fetch categories
    fetch("/api/categories")
      .then((res) => res.json())
      .then((categories) => {
        if (validateCategories(categories)) {
          setCategories(categories);
        } else {
          console.error("Invalid categories data:", categories);
          setInvalidCategories(true);
        }
      })
      .catch((err) => {
        console.error("Failed to fetch categories:", err);
        setInvalidCategories(true);
      })
      .finally(() => setLoadingCategories(false));

    // Fetch menu items
    fetch("/api/menu-items")
      .then((res) => res.json())
      .then((menuItems) => {
        if (validateMenuItems(menuItems)) {
          setMenuItems(menuItems);
        } else {
          console.error("Invalid menu items data:", menuItems);
          setInvalidMenuItems(true);
        }
      })
      .catch((err) => {
        console.error("Failed to fetch menu items:", err);
        setInvalidMenuItems(true);
      })
      .finally(() => setLoadingMenuItems(false));
  }, []);

  return (
    <section className="mt-8">
      {/* Loading state for categories */}
      {loadingCategories ? (
        <div className="text-center">Loading categories...</div>
      ) : invalidCategories ? (
        <div className="text-center text-red-500">
          Failed to load categories. Please try again later.
        </div>
      ) : categories.length > 0 ? (
        categories.map((category) => (
          <div key={category._id}>
            <div className="text-center">
              <SectionHeaders mainHeader={category.name} />
            </div>
            <div className="grid sm:grid-cols-3 gap-4 mt-6 mb-12">
              {/* Loading state for menu items */}
              {loadingMenuItems ? (
                <div className="text-center col-span-3">
                  Loading menu items...
                </div>
              ) : invalidMenuItems ? (
                <div className="text-center col-span-3 text-red-500">
                  Failed to load menu items. Please try again later.
                </div>
              ) : (
                menuItems
                  .filter((item) => item.category === category._id)
                  .map((item) => <MemoizedMenuItem key={item._id} {...item} />)
              )}
            </div>
          </div>
        ))
      ) : (
        <div className="text-center">No categories available.</div>
      )}
    </section>
  );
}
