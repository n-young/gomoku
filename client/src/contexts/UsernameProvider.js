import React, { createContext, useContext } from 'react'
import useLocalStorage from '../hooks/useLocalStorage';

const UsernameContext = createContext()

export function useUsername() {
    return useContext(UsernameContext)
}

export function UsernameProvider({ children }) {
    const [username, setUsername] = useLocalStorage('username', '')

    return (
        <UsernameContext.Provider value={{username, setUsername}}>
            {children}
        </UsernameContext.Provider>
    )
}