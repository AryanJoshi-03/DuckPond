"use client";
import * as React from "react";

interface SearchBarProps {
  query: string;
  onQueryChange: (query: string) => void;
  onSearch: (results: any[]) => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  query,
  onQueryChange,
  onSearch,
}) => {
    React.useEffect(() => {
        if (!query.trim()) {
          onSearch([]);
          return;
        }
      
        const fetchSearch = async () => {
          try {
            const res = await fetch(
              `http://localhost:8000/notifications/search?query=${encodeURIComponent(query)}`
            );
            const data = await res.json();
      
            const sorted = [...data].sort(
              (a, b) =>
                new Date(b.date_Created).getTime() -
                new Date(a.date_Created).getTime()
            );
            onSearch(sorted);
          } catch (err) {
            console.error("Search failed", err);
          }
        };
      
        fetchSearch();
      }, [query]);

  return (
    <div className="flex-1 px-6 pb-3">
      <div className="flex gap-1 items-center mx-auto w-full h-14 bg-gray-200 dark:bg-gray-800 rounded-3xl max-w-2/3">
        <input
          type="text"
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          placeholder="Search Text"
          className="flex-1 text-base text-zinc-700 dark:text-zinc-300 bg-transparent border-none outline-none px-4"
        />
      </div>
    </div>
  );
};