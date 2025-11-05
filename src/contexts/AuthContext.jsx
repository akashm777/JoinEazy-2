import React, { createContext, useContext, useState, useEffect } from 'react'
import axios from 'axios'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      // Set axios default header
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
      
      // Mock token verification - get user info from localStorage
      verifyToken(token)
    } else {
      setLoading(false)
    }
  }, [])

  const verifyToken = async (token) => {
    try {
      // Mock token verification - in a real app, this would be an API call
      const userData = localStorage.getItem('userData')
      if (userData && token) {
        setUser(JSON.parse(userData))
      } else {
        // Invalid token, clear storage
        localStorage.removeItem('token')
        localStorage.removeItem('userData')
        delete axios.defaults.headers.common['Authorization']
      }
    } catch (error) {
      console.error('Token verification failed:', error)
      localStorage.removeItem('token')
      localStorage.removeItem('userData')
      delete axios.defaults.headers.common['Authorization']
    } finally {
      setLoading(false)
    }
  }

  const login = async (email, password) => {
    try {
      // Mock API call - replace with actual endpoint
      const response = await mockLogin(email, password)
      const { token, user } = response.data
      
      localStorage.setItem('token', token)
      localStorage.setItem('userData', JSON.stringify(user))
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
      setUser(user)
      
      return { success: true, user }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  const register = async (userData) => {
    try {
      // Mock API call - replace with actual endpoint
      const response = await mockRegister(userData)
      const { token, user } = response.data
      
      localStorage.setItem('token', token)
      localStorage.setItem('userData', JSON.stringify(user))
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
      setUser(user)
      
      return { success: true, user }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('userData')
    delete axios.defaults.headers.common['Authorization']
    setUser(null)
  }

  // Mock functions - replace with actual API calls
  const mockLogin = async (email, password) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (email === 'professor@test.com' && password === 'password') {
          resolve({
            data: {
              token: 'mock-jwt-token-professor',
              user: {
                id: 1,
                name: 'Dr. John Smith',
                email: 'professor@test.com',
                role: 'professor'
              }
            }
          })
        } else if (email === 'student@test.com' && password === 'password') {
          resolve({
            data: {
              token: 'mock-jwt-token-student',
              user: {
                id: 2,
                name: 'Jane Doe',
                email: 'student@test.com',
                role: 'student'
              }
            }
          })
        } else {
          reject(new Error('Invalid credentials'))
        }
      }, 1000)
    })
  }

  const mockRegister = async (userData) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          data: {
            token: 'mock-jwt-token-new-user',
            user: {
              id: Date.now(),
              name: userData.name,
              email: userData.email,
              role: userData.role
            }
          }
        })
      }, 1000)
    })
  }

  const value = {
    user,
    loading,
    login,
    register,
    logout
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}