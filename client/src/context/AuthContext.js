import React, { createContext, useContext, useReducer, useEffect } from 'react'

const initialState = {
    user: JSON.parse(localStorage.getItem('user')) || null,
    role: localStorage.getItem('role') || null,
    token: localStorage.getItem('token') || null,
    loading: false,
    error: null,
}

export const AuthContext = createContext(initialState)

const authReducer = (state, action) => {
    switch (action.type) {
        case 'LOGIN_START':
            return { ...state, loading: true, error: null }
        case 'LOGIN_SUCCESS':
            return { 
                ...state, 
                user: action.payload.user, 
                role: action.payload.role,
                token: action.payload.token,
                loading: false, 
                error: null 
            }
        case 'LOGIN_FAILURE':
            return { ...state, loading: false, error: action.payload }
        case 'LOGOUT':
            return { ...state, user: null, role: null, token: null, loading: false, error: null }
        case 'CLEAR_ERROR':
            return { ...state, error: null }
        default:
            return state
    }
}

export const AuthContextProvider = ({ children }) => {
    const [state, dispatch] = useReducer(authReducer, initialState)

    // Persist to localStorage whenever state changes
    useEffect(() => {
        if (state.user) {
            localStorage.setItem('user', JSON.stringify(state.user))
            localStorage.setItem('role', state.role)
            localStorage.setItem('token', state.token)
        } else {
            localStorage.removeItem('user')
            localStorage.removeItem('role')
            localStorage.removeItem('token')
        }
    }, [state.user, state.role, state.token])

    return (
        <AuthContext.Provider value={{
            user: state.user,
            role: state.role,
            token: state.token,
            loading: state.loading,
            error: state.error,
            dispatch
        }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext)
