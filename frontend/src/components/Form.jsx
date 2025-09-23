import { useState } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants";
import "../style/Form.css"

function Form({route, method}) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const name = method === "login" ? "Connexion" : "Inscription";


    const handleSubmit = async (e) => {
        setLoading(true);
        e.preventDefault();
        try {
            const response = await api.post(route, { username, password });
            if (method === "login") {
                localStorage.setItem(ACCESS_TOKEN, response.data.access);
                localStorage.setItem(REFRESH_TOKEN, response.data.refresh);
                navigate("/");
            } else {
                navigate("/login");
            }
        } catch (error) {
            console.log(error);
            alert(error.response.data.detail);
        } finally {
            setLoading(false);
        }
    }

    return <form onSubmit={handleSubmit} className="form-container">
        <h1> {name}</h1>
        <input 
            className="form-input" 
            type="text" 
            placeholder="Nom d'utilisateur" 
            value={username} 
            onChange={(e) => setUsername(e.target.value)} />

        <input 
            className="form-input" 
            type="password" 
            placeholder="Mot de passe" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} />

        <button className="form-button" type="submit">{name}</button>
    </form>
}

export default Form


