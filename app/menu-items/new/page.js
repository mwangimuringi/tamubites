import { useRouter } from "next/router";
import { useState } from "react";
import toast from "react-hot-toast";
import UserTabs from "@/components/layout/UserTabs";
import MenuItemForm from "@/components/layout/MenuItemForm";
import Left from "@/components/icons/Left";
import Link from "next/link";
import { useProfile } from "@/components/UseProfile";

export default function NewMenuItemPage() {
  const router = useRouter();
  const { loading, data } = useProfile();
  const [isSaving, setIsSaving] = useState(false);

  if (loading) return <p>Loading user info...</p>;
  if (!data?.admin) return <p>Not authorized to access this page.</p>;

  async function handleFormSubmit(ev, data) {
    ev.preventDefault();
    setIsSaving(true);

    try {
      await toast.promise(
        fetch("/api/menu-items", {
          method: "POST",
          body: JSON.stringify(data),
          headers: { "Content-Type": "application/json" },
        }).then((res) => {
          if (!res.ok) throw new Error("Failed to save");
        }),
        {
          loading: "Saving this tasty item",
          success: "Saved!",
          error: "Error saving item",
        }
      );
      router.push("/menu-items");
    } catch (error) {
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <section className="mt-8">
      <UserTabs isAdmin={true} />
      <div className="max-w-2xl mx-auto mt-8">
        <Link href="/menu-items" className="button">
          <Left />
          <span>Show all menu items</span>
        </Link>
      </div>
      <MenuItemForm
        menuItem={null}
        onSubmit={handleFormSubmit}
        isSaving={isSaving}
      />
    </section>
  );
}
