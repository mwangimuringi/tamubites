"use client";
import { useState } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <section className="mt-8">
      <h1 className="text-center text-primary text-4xl mb-4">Login</h1>
      <form className="max-w-xs mx-auto">
        <input
          type="email"
          placeholder="email"
          value={email}
          onChange={(ev) => setEmail(ev.target.value)}
          className="w-full p-2 mb-2 border border-gray-300 rounded"
        />
        <input
          type="password"
          placeholder="password"
          value={password}
          onChange={(ev) => setPassword(ev.target.value)}
          className="w-full p-2 mb-2 border border-gray-300 rounded"
        />
        <button type="submit" className="w-full py-2 mt-4 bg-primary text-white rounded">
          Login
        </button>
      </form>
    </section>
  );
}
