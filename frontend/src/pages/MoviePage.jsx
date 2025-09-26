import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api";
import MovieMain from "./MovieMain";
import Header from "./Header";

export default function MoviePage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [user, setUser] = useState(null);

  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [comments, setComments] = useState([]);
  const [commentsLoading, setCommentsLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    fetchMovie();
    fetchComments();
    fetchName();
  }, [id]);

    async function fetchName() {
    try {
      const res = await api.get("/api/user/me/");
      setUser(res.data);
    } catch (err) {
      // pas connecté ou erreur
      setUser(null);
    }
  }

  async function fetchMovie() {
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
  }

  async function fetchComments() {
    setCommentsLoading(true);
    try {
      const res = await api.get(`/api/movies/${id}/comments/`);
      setComments(res.data);
    } catch (err) {
      console.error("Erreur commentaires:", err);
      setComments([]);
    } finally {
      setCommentsLoading(false);
    }
  }

  async function handleLike(movieId) {
    try {
      await api.post(`/api/movies/${movieId}/like/`);
      await fetchMovie();
    } catch (err) {
      console.error(err);
    }
  }

  async function handleRate(movieId, rating) {
    try {
      await api.post(`/api/movies/${movieId}/rate/`, { score: rating });
      await fetchMovie();
    } catch (err) {
      console.error(err);
    }
  }

  // Ajout d'un commentaire
  async function handleAddComment(text) {
    if (!text || !text.trim()) return;
    try {
      const res = await api.post(`/api/movies/${id}/comments/`, { text });
      // soit on rafraîchit toute la liste :
      await fetchComments();
      // ou on peut ajouter l'élément renvoyé en tête (optimiste)
      // setComments(prev => [res.data, ...prev]);
      return res.data;
    } catch (err) {
      console.error("Erreur ajout commentaire:", err);
      throw err;
    }
  }

  return (
    <div>
      <Header username={user?.username} />
      <main className="p-6">
        <button onClick={() => navigate(-1)} className="mb-4 inline-flex items-center gap-2 px-3 py-1 border rounded">
          ← Retour
        </button>

        {loading && <div>Chargement du film…</div>}
        {error && <div className="text-red-600">{error}</div>}

        {movie && (
          <MovieMain
            movie={movie}
            onLike={handleLike}
            onRate={handleRate}
            comments={comments}
            commentsLoading={commentsLoading}
            onAddComment={handleAddComment}
          />
        )}
      </main>
    </div>
  );
}
