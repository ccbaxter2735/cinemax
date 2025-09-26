import React, { useEffect, useState } from "react";
import api from "../api";
import Movie from "./Movie";
import Header from "./Header";

export default function Home() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetchMovies();
    fetchName();
  }, []);

  async function fetchName() {
    try {
      const res = await api.get("/api/user/me/");
      setUser(res.data);
    } catch (err) {
      // pas connecté ou erreur
      setUser(null);
    }
  }

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
    <div>
      <Header username={user?.username} />

      <main className="p-6">
        <h2 className="text-xl font-semibold mb-4">Bienvenue sur CINEMAX</h2>
        <p className="mb-4">Voici la liste des films disponibles sur notre site :</p>

        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-700 rounded">{error}</div>
        )}

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
                <div key={m.id} className="w-full min-w-0">
                  <Movie movie={m} />
                </div>
              ))
            ) : (
              <div className="col-span-full text-center text-gray-500">
                Aucun film disponible.
              </div>
            )}
          </section>
        )}
      </main>
    </div>
  );
}
