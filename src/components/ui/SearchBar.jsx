"use client";
import React, { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

function SearchBar() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const initialQ = useMemo(() => searchParams.get("q") || "", [searchParams]);
  const [q, setQ] = useState(initialQ);
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    if (!isFocused) {
      setQ(initialQ);
    }
  }, [initialQ, isFocused]);

  useEffect(() => {
    const handler = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());
      const nextQ = q.trim();
      const currentQ = params.get("q") || "";
      if (nextQ) {
        params.set("q", nextQ);
      } else {
        params.delete("q");
      }
      const qs = params.toString();
      const url = qs ? `${pathname}?${qs}` : pathname;
      if (nextQ !== currentQ) {
        router.replace(url);
      }
    }, 300);
    return () => clearTimeout(handler);
  }, [q, pathname, router, searchParams]);

  return (
    <section className="mb-8 w-full">
      <div className="max-w-7xl mx-auto px-2 sm:px-4 py-3">
        <div className="w-full px-12 flex justify-center">
          <input
            type="text"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder="Cari produk, merek, atau deskripsi"
            className="w-full px-4 py-3 bg-white border border-gray-300 rounded-2xl shadow-sm
              text-gray-800 placeholder-gray-400
              focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500
              transition-all duration-200"
            aria-label="Search products"
          />
        </div>
      </div>
    </section>
  );
}

export default SearchBar;
