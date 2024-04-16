import { createContext, useContext, useEffect, useState } from "react";
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

interface AuthProps {
    authState?: { token: string | null; authenticated: boolean | null };
    onRegister?: (username: string, email: string, password: string) => Promise<any>;
    onLogin?: (email: string, password: string) => Promise<any>;
    onLogout?: () => Promise<any>;
};

const TOKEN_KEY = '8cf16dc9ea404229a1e6ca8339534929952470c6a8e9fee7f568605eeca5ae3d';
export const API_URL = 'http://10.0.2.2:8080/api';
const AuthContext = createContext<AuthProps>({});

export const useAuth = () => {
    return useContext(AuthContext);
};

export const AuthProvider = ({ children }: any) => {
    const [authState, setAuthState] = useState<{
        token: string | null;
        authenticated: boolean | null;
    }>({
        token: null,
        authenticated: null
    });

    useEffect(() => {
        const loadToken = async () => {
            const token = await SecureStore.getItemAsync(TOKEN_KEY);
            console.log("~ file: AuthContext.tsx:32 ~ loadToken ~ token:", token);

            if(token) {
                axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

                setAuthState({
                    token: token,
                    authenticated: true,
                });
            }
        }; 
        loadToken();
    }, []);

    const register = async (username: string, email: string, password: string) => {
        try {
            return await axios.post(`${API_URL}/auth/register`, { username, email, password });
        } catch (e) {
            return { error: true, msg: (e as any).response.data.message };
        }
    };

    const login = async (email: string, password: string) => {
        try {
            const result = await axios.post(`${API_URL}/auth/login`, { email, password });
            console.log('Loading');

            console.log("~ file: AuthContext.tsx:58 ~ login ~ result:", result);

            setAuthState({
                token: result.data.token,
                authenticated: true
            });

            axios.defaults.headers.common['Authorization'] = `Bearer ${result.data.token}`;

            await SecureStore.setItemAsync(TOKEN_KEY, result.data.token);

            return result;
        } catch (e) {
            return { error: true, msg: (e as any).response.data.message };
        }
    };

    const logout = async () => {
        // Delete token from storage
        await SecureStore.deleteItemAsync(TOKEN_KEY);

        // Update HTTP Headers
        axios.defaults.headers.common['Authorization'] = '';

        // Reset auth state
        setAuthState({
            token: null,
            authenticated: false
        });
    };

    const value = {
        onRegister: register,
        onLogin: login,
        onLogout: logout,
        authState
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
};