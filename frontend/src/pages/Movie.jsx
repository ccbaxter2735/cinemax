// src/components/Movie.jsx
import React from "react";
import { Link } from "react-router-dom";

export default function Movie({ movie }) {
  const poster = movie.poster_url || movie.poster || "";
  const title = movie.title_fr || movie.title_original || "Titre inconnu";
  const release = movie.release_date ? new Date(movie.release_date).getFullYear() : "";

  return (
    <article className="group bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition duration-200 w-full">
      <Link to={`/movies/${movie.id}`} className="block w-full">
        <div className="relative bg-gray-100 w-full overflow-hidden">
          {poster ? (
            <img
              src={poster}
              alt={`${title} — affiche`}
              loading="lazy"
              className="w-full h-56 sm:h-64 md:h-64 lg:h-72 object-cover"
            />
          ) : (
            <div className="w-full h-56 sm:h-64 md:h-64 lg:h-72 flex items-center justify-center text-gray-400">
              Pas d'affiche
            </div>
          )}

          {movie.duration_minutes && (
            <span className="absolute left-2 top-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
              {Math.floor(movie.duration_minutes / 60)}h {movie.duration_minutes % 60}m
            </span>
          )}

          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-3">
            <h3 className="text-white text-sm font-semibold truncate">{title}</h3>
            {movie.title_original && <div className="text-xs text-gray-200 truncate">{movie.title_original}</div>}
          </div>
        </div>

        <div className="p-3">
          <div className="flex items-center justify-between">
            <div className="text-sm font-medium text-gray-800 truncate">{title}</div>
            {release && <div className="text-xs text-gray-500">{release}</div>}
          </div>

          <div className="mt-2 flex items-center justify-between">
            <span
                className={`
                  text-xs font-semibold px-2 py-1 rounded
                  ${
                    typeof movie.avg_rating !== "number"
                      ? "bg-gray-100 text-gray-800"
                      : movie.avg_rating < 5
                      ? "bg-red-100 text-red-800"
                      : movie.avg_rating < 8
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-green-100 text-green-800"
                  }
                `}
              >
                {typeof movie.avg_rating === "number"
                  ? `${movie.avg_rating.toFixed(1)}/10`
                  : "–/10"}
              </span>
            <span className="text-xs text-indigo-600 font-medium group-hover:underline">Voir</span>
          </div>
        </div>
      </Link>
    </article>
  );
}
