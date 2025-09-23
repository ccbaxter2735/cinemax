// src/pages/Actor.jsx
import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../api";

export default function Actor() {
  const { id } = useParams();
  const [actor, setActor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchActor();
    // eslint-disable-next-line
  }, [id]);

  async function fetchActor() {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get(`/actors/${id}/`);
      setActor(res.data);
    } catch (err) {
      console.error(err);
      setError("Impossible de charger l'acteur.");
    } finally {
      setLoading(false);
    }
  }

  if (loading) return <div className="p-8">Chargement...</div>;
  if (error) return <div className="p-8 text-red-600">{error}</div>;
  if (!actor) return <div className="p-8">Acteur introuvable</div>;

  const photo = actor.photo || actor.avatar || "";

  return (
    <main className="container mx-auto p-6">
      <div className="bg-white rounded-xl shadow p-6">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="w-full md:w-1/4 flex-shrink-0">
            <div className="w-full h-80 rounded-lg overflow-hidden bg-gray-100">
              {photo ? <img src={photo} alt={actor.full_name || `${actor.first_name}`} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-gray-400">No image</div>}
            </div>
            <div className="mt-4">
              <div className="text-lg font-semibold">{actor.full_name || `${actor.first_name} ${actor.last_name || ""}`}</div>
              {actor.birth_date && <div className="text-sm text-gray-600">Né(e) le {actor.birth_date}</div>}
            </div>
          </div>

          <div className="flex-1">
            {actor.bio && <p className="text-gray-700 mb-4">{actor.bio}</p>}

            <h3 className="font-semibold mb-3">Films ({actor.movies ? actor.movies.length : 0})</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {actor.movies && actor.movies.length ? (
                actor.movies.map((m) => (
                  <Link key={m.id} to={`/movies/${m.id}`} className="flex gap-3 items-start p-3 border rounded hover:bg-gray-50">
                    <div className="w-14 h-20 bg-gray-100 overflow-hidden rounded">
                      {m.poster ? <img src={m.poster} alt={m.title_fr} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-gray-400">No img</div>}
                    </div>
                    <div>
                      <div className="font-medium">{m.title_fr}</div>
                      {m.title_original && <div className="text-xs text-gray-500">{m.title_original}</div>}
                      <div className="text-xs text-gray-600">{m.release_date}</div>
                    </div>
                  </Link>
                ))
              ) : (
                <div className="text-sm text-gray-500">Aucun film trouvé pour cet acteur.</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
