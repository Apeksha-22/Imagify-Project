import { createContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export const AppContext = createContext();

const AppContextProvider = (props) => {
    const [user, setUser] = useState(null);
    const [showLogin, setShowLogin] = useState(false);
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [credit, setCredit] = useState(0);
    const [loading, setLoading] = useState(false);
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const navigate = useNavigate();

    // Configure axios defaults
    axios.defaults.baseURL = backendUrl;

    // Add axios interceptor for token
    axios.interceptors.request.use((config) => {
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    });

    const loadCreditsData = async () => {
        try {
            setLoading(true);
            const { data } = await axios.get('/api/user/credits');
            if (data.success) {
                setCredit(data.credits);
                setUser(data.user);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.error('Credits loading error:', error);
            if (error.response?.status === 401) {
                logout();
            }
            toast.error(error.response?.data?.message || 'Failed to load credits');
        } finally {
            setLoading(false);
        }
    };

    const generateImage = async (prompt) => {
        try {
            if (!user?._id) {
                toast.error('Please login first');
                setShowLogin(true);
                return;
            }
            
            setLoading(true);
            const { data } = await axios.post('/api/image/generate-image', { 
                prompt,
                userId: user._id 
            });
            
            if (data.success) {
                await loadCreditsData();
                return data.resultImage;
            } else {
                toast.error(data.message);
                await loadCreditsData();
                if (data.creditBalance === 0) {
                    navigate('/buy');
                }
            }
        } catch (error) {
            console.error('Image generation error:', error);
            toast.error(error.response?.data?.message || 'Failed to generate image');
        } finally {
            setLoading(false);
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
        setCredit(0);
        toast.info('Logged out successfully');
    };

    useEffect(() => {
        if (token) {
            loadCreditsData();
        } else {
            setUser(null);
            setCredit(0);
        }
    }, [token]);

    const value = {
        user,
        setUser,
        showLogin,
        setShowLogin,
        backendUrl,
        token,
        setToken,
        credit,
        setCredit,
        loading,
        loadCreditsData,
        logout,
        generateImage
    };

    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    );
};

export default AppContextProvider;