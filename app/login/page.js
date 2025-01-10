"use client";
import { signIn } from "next-auth/react";
import Image from "next/image";
import { useState, useEffect } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginInProgress, setLoginInProgress] = useState(false);
  const [error, setError] = useState("");
  const [callbackUrl, setCallbackUrl] = useState("/"); // Dynamically set callback URL

  useEffect(() => {
    // Logic to set callbackUrl based on the login source
    const url = new URL(window.location.href);
    if (url.searchParams.has("redirect")) {
      setCallbackUrl(url.searchParams.get("redirect"));
    }
  }, []);

  async function handleFormSubmit(ev) {
    ev.preventDefault();
    setError("");
    if (!email || !password) {
      setError("Email and password are required.");
      return;
    }

    setLoginInProgress(true);
    const result = await signIn("credentials", {
      email,
      password,
      callbackUrl,
    });

    if (result?.error) {
      setError("Invalid email or password.");
    }

    setLoginInProgress(false);
  }

  return (
    <section className="mt-8">
      <h1 className="text-center text-primary text-4xl mb-4">Login</h1>
      <form className="max-w-xs mx-auto" onSubmit={handleFormSubmit}>
        <input
          type="email"
          name="email"
          placeholder="email"
          value={email}
          disabled={loginInProgress}
          onChange={(ev) => setEmail(ev.target.value)}
          className="w-full p-2 mb-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary"
        />
        <input
          type="password"
          name="password"
          placeholder="password"
          value={password}
          disabled={loginInProgress}
          onChange={(ev) => setPassword(ev.target.value)}
          className="w-full p-2 mb-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary"
        />
        {error && <div className="text-red-500 text-sm mt-2">{error}</div>}
        <button
          disabled={loginInProgress}
          type="submit"
          className="w-full py-2 mt-4 bg-primary text-white rounded focus:outline-none focus:ring-2 focus:ring-primary"
        >
          Login
        </button>
        <div className="my-4 text-center text-gray-500">
          or login with provider
        </div>
        <button
          disabled={loginInProgress}
          type="button"
          onClick={() => signIn("google", { callbackUrl })}
          className="w-full py-2 mt-4 bg-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-primary flex gap-4 justify-center"
        >
          <Image src={"/google.png"} alt={""} width={24} height={24} />
          Login with google
        </button>
      </form>
    </section>
  );
}
