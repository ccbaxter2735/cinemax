import React, { useState } from "react";

/**
 * MovieMain.jsx (avec section commentaires)
 * Props:
 *  - movie: objet film complet (depuis l'API)
 *  - onLike(movieId) optional
 *  - onRate(movieId, rating) optional
 *  - comments: array of comment objects (optional)
 *  - commentsLoading: boolean (optional)
 *  - onAddComment(text): async function to post a comment (optional)
 */
export default function MovieMain({ movie, onLike, onRate, comments = [], commentsLoading = false, onAddComment }) {
  if (!movie) return null;

  const {
    id,
    title_fr,
    title_original,
    origin_country,
    duration_minutes,
    // nullable field that some serializers might provide
    duration_display,
    director,
    description,
    release_date,
    poster,
    poster_url,
    illustration,
    likes_count,
    avg_rating,
    cast = [],
  } = movie;

  const displayDate = release_date
    ? new Intl.DateTimeFormat("fr-FR", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }).format(new Date(release_date))
    : "Date inconnue";

  const posterSrc = poster_url || poster || "/images/poster-placeholder.png";
  const illuSrc = illustration || "/images/illustration-placeholder.jpg";

  const durationText =
    duration_display ||
    (duration_minutes ? `${Math.floor(duration_minutes / 60)}h ${duration_minutes % 60}m` : "");

  return (
    <main className="max-w-6xl mx-auto p-6">
      <section className="relative rounded-2xl overflow-hidden shadow-lg">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-30"
          style={{ backgroundImage: `url(${illuSrc})` }}
          aria-hidden
        />
        <div className="relative z-10 bg-gradient-to-b from-transparent via-white/80 to-white p-6 md:p-10 flex flex-col md:flex-row gap-6 items-start">
          <div className="flex-shrink-0 w-36 md:w-48 lg:w-56">
            <img
              src={posterSrc}
              alt={`Affiche de ${title_fr || title_original}`}
              className="w-full h-auto rounded-lg object-cover shadow-inner"
              loading="lazy"
            />
          </div>

          <div className="flex-1">
            <h1 className="text-2xl md:text-3xl font-extrabold leading-tight">
              {title_fr || title_original}
            </h1>

            {title_original && title_original !== title_fr && (
              <p className="text-sm text-gray-600 mt-1">{title_original}</p>
            )}

            <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-gray-700">
              {origin_country && (
                <span className="px-2 py-1 rounded-full bg-gray-100">{origin_country}</span>
              )}
              {durationText && (
                <span className="px-2 py-1 rounded-full bg-gray-100">{durationText}</span>
              )}
              {director && (
                <span className="px-2 py-1 rounded-full bg-gray-100">Réalisé par {director}</span>
              )}
              <span className="px-2 py-1 rounded-full bg-gray-100">Sortie: {displayDate}</span>
            </div>

            <div className="mt-4 flex items-center gap-4">
              <div className="flex items-center gap-2">
                <strong className="text-lg">{typeof avg_rating === "number" ? avg_rating.toFixed(1) : "—"}</strong>
                <small className="text-gray-600">/10</small>
              </div>

              <button
                onClick={() => onLike && onLike(id)}
                className="inline-flex items-center gap-2 px-3 py-2 rounded-md border shadow-sm hover:shadow-md transition"
                aria-pressed="false"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden>
                  <path d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 18.657 3.172 10.83a4 4 0 010-5.657z" />
                </svg>
                <span>{likes_count ?? 0}</span>
              </button>

              <div className="flex items-center gap-2">
                <label className="text-sm">Noter :</label>
                <select
                  aria-label="Noter le film"
                  onChange={(e) => onRate && onRate(id, Number(e.target.value))}
                  defaultValue=""
                  className="px-2 py-1 border rounded"
                >
                  <option value="" disabled>--</option>
                  {[...Array(10)].map((_, i) => (
                    <option key={i + 1} value={i + 1}>{i + 1}</option>
                  ))}
                </select>
              </div>
            </div>

            {description && (
              <div className="mt-4 text-gray-800 prose max-w-none">
                <p>{description}</p>
              </div>
            )}

            <div className="mt-5 flex gap-3">
              <span className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-md shadow">Fiche</span>

              <a href="#trailer" className="inline-flex items-center gap-2 px-4 py-2 border rounded-md hover:shadow-sm transition">Bande-annonce</a>
            </div>
          </div>
        </div>
      </section>

      <section className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Distribution</h2>
        {cast.length === 0 ? (
          <p className="text-gray-600">Pas d'acteurs listés pour ce film.</p>
        ) : (
          <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {cast.map((c, idx) => (
              <li key={idx} className="bg-white rounded-lg p-3 shadow-sm flex flex-col items-center text-center">
                <div className="w-24 h-24 mb-2 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center">
                  <img src={(c.actor && (c.actor.photo || c.actor.avatar)) || "/images/actor-placeholder.png"} alt={c.actor ? c.actor.name : "Acteur"} className="w-full h-full object-cover" loading="lazy" />
                </div>
                <div className="text-sm font-medium">{c.actor ? c.actor.name : "Acteur inconnu"}</div>
                {c.role_name && <div className="text-xs text-gray-500">{c.role_name}</div>}
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Comments section */}
      <CommentsSection comments={comments} loading={commentsLoading} onAddComment={onAddComment} />

      <footer className="mt-10 text-sm text-gray-500">Données mises à jour automatiquement si disponibles.</footer>
    </main>
  );
}


function CommentsSection({ comments = [], loading = false, onAddComment }) {
  const [text, setText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  async function submit(e) {
    e.preventDefault();
    setError(null);
    const trimmed = (text || "").trim();
    if (!trimmed) {
      setError("Écris quelque chose avant d'envoyer.");
      return;
    }
    if (!onAddComment) {
      setError("Action indisponible — connecte-toi pour commenter.");
      return;
    }

    try {
      setSubmitting(true);
      await onAddComment(trimmed);
      setText("");
    } catch (err) {
      console.error(err);
      setError("Impossible d'ajouter le commentaire.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="mt-8">
      <h2 className="text-xl font-semibold mb-4">Commentaires</h2>

      <form onSubmit={submit} className="mb-4">
        <textarea value={text} onChange={(e) => setText(e.target.value)} rows={3} placeholder="Écrire un commentaire..." className="w-full p-3 border rounded resize-y" />
        <div className="mt-2 flex items-center gap-3">
          <button type="submit" disabled={submitting || !onAddComment} className="px-4 py-2 bg-indigo-600 text-white rounded disabled:opacity-60">
            {submitting ? "Envoi..." : "Publier"}
          </button>
          {error && <div className="text-red-600 text-sm">{error}</div>}
        </div>
      </form>

      {loading ? (
        <div>Chargement des commentaires…</div>
      ) : comments.length === 0 ? (
        <div className="text-gray-600">Pas encore de commentaires.</div>
      ) : (
        <ul className="space-y-4">
          {comments.map((c) => (
            <li key={c.id} className="bg-white p-3 rounded shadow-sm">
              <div className="flex items-center justify-between">
                <div className="text-sm font-medium">{c.author_username || "Anonyme"}</div>
                <div className="text-xs text-gray-500">{new Date(c.created_at).toLocaleString()}</div>
              </div>
              <div className="mt-2 text-gray-800">{c.text}</div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
