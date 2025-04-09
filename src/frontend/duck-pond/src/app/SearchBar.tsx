"use client";
import * as React from "react";

export const SearchBar: React.FC = () => {
    const [query, setQuery] = React.useState("");
    const [results, setResults] = React.useState([]);
    const [sortedResults, setSortedResults] = React.useState([]);

    const handleSearch = async () => {
        if (!query.trim()) return;

        try {
            const res = await fetch(`http://localhost:8000/notifications/search?query=${encodeURIComponent(query)}`);
            const data = await res.json();

            // Set the unsorted data
            setResults(data);

            // Sort by date (latest first) or adjust to any other field you prefer
            const sorted = [...data].sort((a, b) => new Date(b.date_Created).getTime() - new Date(a.date_Created).getTime());
            setSortedResults(sorted);
        } catch (err) {
            console.error("Search failed", err);
        }
    };

    return (
        <div className="flex-1 px-6">
            <div className="flex gap-1 items-center mx-auto w-full h-14 bg-gray-200 rounded-3xl max-w-2/3">
                <div className="flex flex-1 gap-1 items-center p-1">
                    <button
                        className="flex justify-center items-center w-12 h-12"
                        aria-label="Menu"
                    >
                        {/* Menu icon */}
                    </button>

                    {/* Search input */}
                    <input
                        type="text"
                        placeholder="Search Text"
                        className="flex-1 text-base text-zinc-700 bg-transparent border-none outline-none"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                    />

                    {/* Search button */}
                    <button
                        className="flex justify-center items-center w-12 h-12"
                        aria-label="Search"
                        onClick={handleSearch}
                    >
                        {/* Search icon */}
                    </button>
                </div>
            </div>

            {/* Results */}
            <div className="mt-4 max-w-2xl mx-auto">
                {sortedResults.length === 0 && query && (
                    <p className="text-center text-gray-500 mt-4">No results found.</p>
                )}
                {sortedResults.map((notif, index) => (
                    <div
                        key={index}
                        className="bg-white shadow-md rounded-xl p-4 mb-3 border"
                    >
                        <h3 className="text-lg font-semibold">{notif.subject || notif.title}</h3>
                        <p className="text-gray-700">
                            {notif.details || notif.description || notif.body}
                        </p>
                        <p className="text-sm text-gray-400 mt-2">
                            {new Date(notif.date_Created).toLocaleString()}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
};
