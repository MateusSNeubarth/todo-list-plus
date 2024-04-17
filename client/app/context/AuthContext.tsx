import { createContext, useContext, useEffect, useState } from "react";
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

interface AuthProps {
    authState?: { token: string | null; authenticated: boolean | null };
    onRegister?: (username: string, email: string, password: string) => Promise<any>;
    onLogin?: (email: string, password: string) => Promise<any>;
    onLogout?: () => Promise<any>;
};

const TOKEN_KEY = 'token_key';
const USER_ID = 'user_id'
export const API_URL = 'http://10.0.2.2:8080/api';
const AuthContext = createContext<AuthProps>({});

export const useAuth = () => {
    return useContext(AuthContext);
};

export const AuthProvider = ({ children }: any) => {
    const [authState, setAuthState] = useState<{
        token: string | null;
        authenticated: boolean | false;
    }>({
        token: null,
        authenticated: false,
    });

    useEffect(() => {
        const loadToken = async () => {
            const token = await SecureStore.getItemAsync(TOKEN_KEY);
            const user_id = await SecureStore.getItemAsync('USER_ID');

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

            setAuthState({
                token: result.data.token,
                authenticated: true
            });

            await SecureStore.setItemAsync(TOKEN_KEY, result.data.token);
            await SecureStore.setItemAsync('USER_ID', JSON.stringify(result.data.details._id));

            return result;
        } catch (e) {
            return { error: true, msg: (e as any).response.data.message };
        }
    };

    const logout = async () => {
        // Delete token from storage
        await SecureStore.deleteItemAsync(TOKEN_KEY);
        await SecureStore.deleteItemAsync(USER_ID);

        // Reset auth state
        setAuthState({
            token: null,
            authenticated: false,
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