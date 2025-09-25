// src/pages/MoviePage.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api";
import MovieMain from "./MovieMain";
import Header from "./Header";

export default function MoviePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;
    (async () => {
      setLoading(true);
      try {
        const res = await api.get(`/api/movies/${id}/`);
        setMovie(res.data);
      } catch (err) {
        console.error(err);
        setError("Impossible de charger le film.");
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  async function handleLike(movieId) {
    try {
      await api.post(`/api/movies/${movieId}/like/`);
      // rafraîchir le film
      const res = await api.get(`/api/movies/${movieId}/`);
      setMovie(res.data);
    } catch (err) {
      console.error(err);
    }
  }

  async function handleRate(movieId, rating) {
    try {
      await api.post(`/api/movies/${movieId}/rate/`, { score: rating });
      const res = await api.get(`/api/movies/${movieId}/`);
      setMovie(res.data);
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div>
      <Header />
      <main className="p-6">
        <button
          onClick={() => navigate(-1)}
          className="mb-4 inline-flex items-center gap-2 px-3 py-1 border rounded"
        >
          ← Retour
        </button>

        {loading && <div>Chargement du film…</div>}
        {error && <div className="text-red-600">{error}</div>}
        {movie && (
          <MovieMain movie={movie} onLike={handleLike} onRate={handleRate} />
        )}
      </main>
    </div>
  );
}
