import { Navigate } from 'react-router-dom'
import { useState, useEffect, use } from 'react'
// import { useAuth } from '../hooks/useAuth'
import {jwtDecode} from 'jwt-decode'
import api from '../api'
import { REFRESH_TOKEN, ACCESS_TOKEN } from '../constants'

function ProtectedRoute({ children }) {
    const [isAuthenticated, setIsAuthenticated] = useState(null)

    useEffect(() => {
        auth().catch(() => {
            setIsAuthenticated(false)
        })
    }, [])
    const refreshToken = async () => {
        const refreshToken = localStorage.getItem(REFRESH_TOKEN)
        try {
            const response = await api.post('/api/token/refresh/', { refresh: refreshToken })
            if (response.status !== 200) {
                localStorage.setItem(ACCESS_TOKEN, response.data.access)
                setIsAuthenticated(true)
            } else {
                // localStorage.removeItem(ACCESS_TOKEN)
                // localStorage.removeItem(REFRESH_TOKEN)
                setIsAuthenticated(false)
            }
            
            
        } catch (error) {
            console.log(error)
            setIsAuthenticated(false)
        }
    }

    const auth = async () => {
        const token = localStorage.getItem(ACCESS_TOKEN)
        if (!token) {
            setIsAuthenticated(false)
            return
        }
        const decoded = jwtDecode(token)
        const tokenExpiration = decoded.exp
        const now = Math.floor(Date.now() / 1000)
        if (tokenExpiration < now) {
            await refreshToken()
        } else {
            setIsAuthenticated(true)
        }
        
    }

    if (isAuthenticated === null) {
        return <div>Loading...</div>
    }
    return isAuthenticated ? children : <Navigate to="/login" />
}

export default ProtectedRoute