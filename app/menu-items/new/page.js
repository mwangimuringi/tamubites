"use client";
import Left from "@/components/icons/Left";
import MenuItemForm from "@/components/layout/MenuItemForm";
import UserTabs from "@/components/layout/UserTabs";
import { useProfile } from "@/components/UseProfile";
import Link from "next/link";
import { useRouter } from "next/router"; // Import useRouter
import toast from "react-hot-toast";
import * as Yup from 'yup';

export default function NewMenuItemPage() {
  const router = useRouter(); // Initialize router
  const { loading, data } = useProfile();

  3. Enhance Error Handling

Include detailed error messages for fetch failures to help debug or inform users.

const response = await fetch('/api/menu-items', { ... });
if (!response.ok) {
  const error = await response.json();
  toast.error(error.message || 'Failed to save item');
  reject(new Error(error.message));
} else {
  resolve();
}

const validationSchema = Yup.object().shape({
  name: Yup.string().required('Name is required'),
  price: Yup.number().required('Price is required').min(0, 'Price must be a positive number'),
  // Add other fields as needed
});

  async function handleFormSubmit(ev, data) {
    ev.preventDefault();
    const savingPromise = new Promise(async (resolve, reject) => {
      const response = await fetch("/api/menu-items", {
        method: "POST",
        body: JSON.stringify(data),
        headers: { "Content-Type": "application/json" },
      });
      if (response.ok) resolve();
      else reject();
    });

    await toast.promise(savingPromise, {
      loading: "Saving this tasty item",
      success: "Saved",
      error: "Error",
    });

    router.push("/menu-items"); // Redirect using router
  }

  // Streamlined conditional rendering
  if (loading) return <p>Loading user info...</p>;
  if (!data?.admin) return <p>Not an admin.</p>;

  return (
    <section className="mt-8">
      <UserTabs isAdmin={true} />
      <div className="max-w-2xl mx-auto mt-8">
        <Link href="/menu-items" className="button">
          <Left />
          <span>Show all menu items</span>
        </Link>
      </div>
      <MenuItemForm menuItem={null} onSubmit={handleFormSubmit} />
    </section>
  );
}
