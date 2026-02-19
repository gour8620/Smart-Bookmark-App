"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function Home() {
  const [user, setUser] = useState(null);
  const [bookmarks, setBookmarks] = useState([]);
  const [url, setUrl] = useState("");
  const [title, setTitle] = useState("");

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
      if (data.user) fetchBookmarks(data.user.id);
    });

    const channel = supabase
      .channel("realtime-bookmarks")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "bookmarks" },
        () => user && fetchBookmarks(user.id),
      )
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, [user]);

  async function fetchBookmarks(uid) {
    const { data } = await supabase
      .from("bookmarks")
      .select("*")
      .eq("user_id", uid)
      .order("created_at", { ascending: false });

    setBookmarks(data || []);
  }

  async function addBookmark() {
    if (!url.trim()) return;

    await supabase.from("bookmarks").insert({
      user_id: user.id,
      url,
      title: title || url,
    });

    setUrl("");
    setTitle("");
  }

  async function deleteBookmark(id) {
    const ok = confirm("Are you sure you want to delete this bookmark?");
    if (!ok) return;

    await supabase.from("bookmarks").delete().eq("id", id);
  }

  async function handleLogin() {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: process.env.NEXT_PUBLIC_SITE_URL,
      },
    });
  }
  async function handleLogout() {
    await supabase.auth.signOut();
    setUser(null);
  }

  // For Guest USER
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-black p-6">
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-10 shadow-2xl max-w-sm w-full text-center">
          <h1 className="text-3xl font-bold text-white mb-6 tracking-wide">
            Welcome
          </h1>

          <p className="text-gray-300 mb-8">
            Login to continue to Smart Bookmark App
          </p>

          <button
            onClick={handleLogin}
            className="w-full flex items-center justify-center gap-3 bg-white text-gray-900 font-semibold py-3 rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:scale-95 transition-all duration-200"
          >
            <img
              src="https://www.svgrepo.com/show/475656/google-color.svg"
              className="w-6 h-6"
              alt="Google"
            />
            Sign in with Google
          </button>
        </div>
      </div>
    );
  }

  // For Login USER
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 p-6">
      <h1 className="text-4xl font-extrabold text-center text-white mb-10 tracking-wider drop-shadow-xl">
        Your Smart Bookmarks
      </h1>

      <div className="absolute top-5 right-5">
        <button
          onClick={handleLogout}
          className="bg-red-600 text-white px-4 py-2 rounded-xl shadow-lg hover:bg-red-700 hover:-translate-y-0.5 active:scale-95 transition-all"
        >
          Logout
        </button>
      </div>

      <div className="max-w-2xl mx-auto bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl p-6 rounded-2xl mb-10">
        <div className="flex gap-3 flex-col sm:flex-row">
          <input
            className="border border-white/30 bg-white/5 text-white p-3 flex-1 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none placeholder-gray-300"
            placeholder=" Enter URL"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />

          <input
            className="border border-white/30 bg-white/5 text-white p-3 flex-1 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none placeholder-gray-300"
            placeholder=" Enter Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <button
            className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 hover:-translate-y-0.5 active:scale-95 transition-all shadow-lg"
            onClick={addBookmark}
          >
            Add
          </button>
        </div>
      </div>

      <ul className="max-w-2xl mx-auto space-y-4">
        {bookmarks.map((bm) => (
          <li
            key={bm.id}
            className="bg-white/10 backdrop-blur-xl border border-white/20 shadow-lg p-5 rounded-2xl flex justify-between items-center hover:bg-white/20 transition-all cursor-pointer"
          >
            <div className="flex-1">
              <a
                href={bm.url}
                target="_blank"
                className="font-bold text-white text-xl hover:text-blue-400 transition"
              >
                {bm.title}
              </a>
              <p className="text-gray-300 text-sm mt-1 break-all">{bm.url}</p>
            </div>

            <button
              onClick={() => deleteBookmark(bm.id)}
              className="text-red-400 hover:text-red-600 text-lg font-semibold px-3 py-1 transition active:scale-95"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
