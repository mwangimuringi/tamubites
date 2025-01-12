"use client";

import DeleteButton from "@/components/DeleteButton";
import Left from "@/components/icons/Left";
import UserTabs from "@/components/layout/UserTabs";
import { useProfile } from "@/components/UseProfile";
import Link from "next/link";
import { redirect, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function EditMenuItemPage() {
  const { id } = useParams();

  const [menuItem, setMenuItem] = useState(null);
  const [redirectToItems, setRedirectToItems] = useState(false);
  const { loading, data } = useProfile();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/menu-items");
        if (!response.ok) {
          throw new Error(
            `Failed to fetch menu items: ${response.status} ${response.statusText}`
          );
        }
        const items = await response.json();
        const item = items.find((i) => i._id === id);
        setMenuItem(item);
      } catch (error) {
        console.error("Error fetching menu items:", error);
        // Display a user-friendly error message to the user
        toast.error("Failed to load menu item. Please try again later.");
      }
    };

    fetchData();
  }, [id]); // Only re-fetch when `id` changes

  async function handleFormSubmit(ev, data) {
    ev.preventDefault();
    try {
      const response = await fetch("/api/menu-items", {
        method: "PUT",
        body: JSON.stringify({ ...data, _id: id }),
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) {
        throw new Error(
          `Failed to save item: ${response.status} ${response.statusText}`
        );
      }

      await toast.promise(Promise.resolve(), {
        loading: "Saving this tasty item",
        success: "Saved",
      });

      setRedirectToItems(true);
    } catch (error) {
      await toast.error("Error saving item: " + error.message);
    }
  }

  async function handleDeleteClick() {
    try {
      const res = await fetch(`/api/menu-items?_id=${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        throw new Error(
          `Failed to delete item: ${res.status} ${response.statusText}`
        );
      }

      await toast.promise(Promise.resolve(), {
        loading: "Deleting...",
        success: "Deleted",
      });

      setRedirectToItems(true);
    } catch (error) {
      await toast.error("Error deleting item: " + error.message);
    }
  }

  if (redirectToItems) {
    return redirect("/menu-items");
  }

  if (loading) {
    return "Loading user info...";
  }

  if (!data.admin) {
    return "Not an admin.";
  }

  return (
    <section className="mt-8">
      <UserTabs isAdmin={true} />
      <div className="max-w-2xl mx-auto mt-8">
        <Link href={"/menu-items"} className="button">
          <Left />
          <span>Show all menu items</span>
        </Link>
      </div>
      <MenuItemForm menuItem={menuItem} onSubmit={handleFormSubmit} />
      <div className="max-w-md mx-auto mt-2">
        <div className="max-w-xs ml-auto pl-4">
          <DeleteButton
            label="Delete this menu item"
            onDelete={handleDeleteClick}
          />
        </div>
      </div>
    </section>
  );
}
