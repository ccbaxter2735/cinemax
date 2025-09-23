// src/pages/Home.jsx
import React, { useEffect, useState } from "react";
import api from "../api";
import Movie from "./Movie";

export default function Home() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => { fetchMovies(); }, []);

  async function fetchMovies() {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get("/api/movies/");
      const data = Array.isArray(res.data) ? res.data : res.data.results || [];
      setMovies(data);
    } catch (err) {
      console.error(err);
      setError("Impossible de charger la liste des films.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <header className="mb-8">
        <h1 className="text-3xl font-extrabold">Cinemax</h1>
        <p className="text-gray-600 mt-1">Découvrez nos films — cliquez sur une affiche pour en savoir plus.</p>
      </header>

      {error && <div className="mb-6 p-4 bg-red-50 text-red-700 rounded">{error}</div>}

      {loading ? (
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="animate-pulse bg-gray-100 rounded-lg h-72" />
          ))}
        </div>
      ) : (
        <section
          className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"
          aria-live="polite"
        >
          {movies.length ? (
            movies.map((m) => (
              // wrapper obligatoire pour s'assurer que chaque grid item prend sa colonne
              <div key={m.id} className="w-full min-w-0">
                <Movie movie={m} />
              </div>
            ))
          ) : (
            <div className="col-span-full text-center text-gray-500">Aucun film disponible.</div>
          )}
        </section>
      )}
    </main>
  );
}
