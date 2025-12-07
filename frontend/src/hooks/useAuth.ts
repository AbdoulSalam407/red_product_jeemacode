import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { authService } from '../lib/auth';
import { LoginInput, SignupInput, ResetPasswordInput } from '../schemas/auth';

export const useAuth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const login = useCallback(async (credentials: LoginInput) => {
    setIsLoading(true);
    try {
      await authService.login(credentials);
      
      // Nettoyer le cache à la connexion
      localStorage.removeItem('hotels_cache');
      localStorage.removeItem('hotels_cache_time');
      localStorage.removeItem('dashboard_cache');
      localStorage.removeItem('dashboard_cache_time');
      localStorage.removeItem('dashboard_data_cache');
      localStorage.removeItem('dashboard_data_cache_time');
      localStorage.removeItem('tickets_cache');
      localStorage.removeItem('tickets_cache_time');
      localStorage.removeItem('messages_cache');
      localStorage.removeItem('messages_cache_time');
      localStorage.removeItem('emails_cache');
      localStorage.removeItem('emails_cache_time');
      
      Swal.fire({
        icon: 'success',
        title: 'Connexion réussie',
        text: 'Bienvenue!',
        timer: 1500,
      });
      navigate('/dashboard');
    } catch (error: any) {
      Swal.fire({
        icon: 'error',
        title: 'Erreur de connexion',
        text: error.response?.data?.detail || 'Identifiants invalides',
      });
    } finally {
      setIsLoading(false);
    }
  }, [navigate]);

  const signup = useCallback(async (credentials: SignupInput) => {
    setIsLoading(true);
    try {
      await authService.signup(credentials);
      
      // Nettoyer le cache à l'inscription
      localStorage.removeItem('hotels_cache');
      localStorage.removeItem('hotels_cache_time');
      localStorage.removeItem('dashboard_cache');
      localStorage.removeItem('dashboard_cache_time');
      localStorage.removeItem('dashboard_data_cache');
      localStorage.removeItem('dashboard_data_cache_time');
      localStorage.removeItem('tickets_cache');
      localStorage.removeItem('tickets_cache_time');
      localStorage.removeItem('messages_cache');
      localStorage.removeItem('messages_cache_time');
      localStorage.removeItem('emails_cache');
      localStorage.removeItem('emails_cache_time');
      
      Swal.fire({
        icon: 'success',
        title: 'Inscription réussie',
        text: 'Bienvenue!',
        timer: 1500,
      });
      navigate('/dashboard');
    } catch (error: any) {
      Swal.fire({
        icon: 'error',
        title: 'Erreur d\'inscription',
        text: error.response?.data?.detail || 'Une erreur est survenue',
      });
    } finally {
      setIsLoading(false);
    }
  }, [navigate]);

  const resetPassword = useCallback(async (data: ResetPasswordInput) => {
    setIsLoading(true);
    try {
      await authService.resetPassword(data);
      Swal.fire({
        icon: 'success',
        title: 'Email envoyé',
        text: 'Vérifiez votre boîte mail pour réinitialiser votre mot de passe',
      });
      navigate('/login');
    } catch (error: any) {
      Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: error.response?.data?.detail || 'Une erreur est survenue',
      });
    } finally {
      setIsLoading(false);
    }
  }, [navigate]);

  const logout = useCallback(() => {
    // Nettoyer le cache à la déconnexion
    localStorage.removeItem('hotels_cache');
    localStorage.removeItem('hotels_cache_time');
    localStorage.removeItem('dashboard_cache');
    localStorage.removeItem('dashboard_cache_time');
    localStorage.removeItem('dashboard_data_cache');
    localStorage.removeItem('dashboard_data_cache_time');
    localStorage.removeItem('tickets_cache');
    localStorage.removeItem('tickets_cache_time');
    localStorage.removeItem('messages_cache');
    localStorage.removeItem('messages_cache_time');
    localStorage.removeItem('emails_cache');
    localStorage.removeItem('emails_cache_time');
    
    authService.logout();
    navigate('/login');
  }, [navigate]);

  return {
    login,
    signup,
    resetPassword,
    logout,
    isLoading,
    isAuthenticated: authService.isAuthenticated(),
  };
};
