"use client";
import { signIn } from "next-auth/react";
import Image from "next/image";
import { useState, useEffect } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginInProgress, setLoginInProgress] = useState(false);
  const [error, setError] = useState("");
  const [callbackUrl, setCallbackUrl] = useState("/");

  useEffect(() => {
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
          placeholder="email"
          value={email}
          disabled={loginInProgress}
          onChange={(ev) => setEmail(ev.target.value)}
          className="w-full p-2 mb-2 border border-gray-300 rounded"
        />
        <input
          type="password"
          placeholder="password"
          value={password}
          disabled={loginInProgress}
          onChange={(ev) => setPassword(ev.target.value)}
          className="w-full p-2 mb-2 border border-gray-300 rounded"
        />
        {error && <div className="text-red-500 text-sm mt-2">{error}</div>}
        <button
          type="submit"
          disabled={loginInProgress}
          className="w-full py-2 mt-4 bg-primary text-white rounded"
        >
          Login
        </button>
        <div className="my-4 text-center text-gray-500">
          or login with provider
        </div>
        <button
          type="button"
          onClick={() => signIn("google", { callbackUrl })}
          className="w-full py-2 mt-4 bg-gray-200 rounded flex gap-4 justify-center"
        >
          <Image src="/google.png" alt="" width={24} height={24} />
          Login with Google
        </button>
      </form>
    </section>
  );
}
