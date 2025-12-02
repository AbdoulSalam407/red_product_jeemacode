import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from 'react-router-dom';
import { Mail, Lock } from 'lucide-react';
import { Input, Button, Card } from '../components';
import { useAuth } from '../hooks/useAuth';
import { loginSchema, LoginInput } from '../schemas/auth';

export const Login: React.FC = () => {
  const { login, isLoading } = useAuth();
  const { register, handleSubmit, formState: { errors } } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginInput) => {
    await login(data);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary to-secondary/80 flex items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-primary rounded-lg flex items-center justify-center mx-auto mb-4">
            <span className="text-white text-2xl font-bold">R</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">RED PRODUCT</h1>
          <p className="text-gray-600 mt-2">Gestion Hôtelière</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label="Email"
            type="email"
            placeholder="admin@example.com"
            icon={<Mail size={18} />}
            {...register('email')}
            error={errors.email}
          />

          <Input
            label="Mot de passe"
            type="password"
            placeholder="••••••••"
            icon={<Lock size={18} />}
            {...register('password')}
            error={errors.password}
          />

          <Button
            type="submit"
            variant="primary"
            size="lg"
            isLoading={isLoading}
            className="w-full"
          >
            Se connecter
          </Button>
        </form>

        <div className="mt-6 space-y-2 text-center">
          <Link
            to="/forgot-password"
            className="block text-primary hover:underline text-sm"
          >
            Mot de passe oublié?
          </Link>
          <p className="text-gray-600 text-sm">
            Pas encore inscrit?{' '}
            <Link to="/signup" className="text-primary hover:underline font-medium">
              S'inscrire
            </Link>
          </p>
        </div>
      </Card>
    </div>
  );
};
