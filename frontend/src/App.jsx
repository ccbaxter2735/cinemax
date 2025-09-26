import React from "react"
import {BrowserRouter, Routes, Route, Navigate} from "react-router-dom"
import Login from "./pages/Login"
import Register from "./pages/Register"
// import Movie from "./pages/Movie"
// import Actor from "./pages/Actor"
import Home from "./pages/Home"
import MoviePage from "./pages/MoviePage"
import ProtectedRoute from "./components/ProtectedRoute"
import NotFound from "./pages/NotFound"

function Logout() {
  localStorage.clear()
  return <Navigate to="/login" />
}

function RegisterAndLogout() {
  localStorage.clear()
  return <Register />
}

function App() {
  
  const username = localStorage.getItem("username") || "Invité";

  return (
    
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<RegisterAndLogout />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/movies/:id" element={<MoviePage />} />
        {/* <Route path="/movies/" element={<Movie />} />
        <Route path="/actors/" element={<Actor />} /> */}
        <Route path="*" element={<NotFound />} />

      </Routes>
    </BrowserRouter>
  )
}

export default App
