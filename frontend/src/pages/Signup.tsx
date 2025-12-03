import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from 'react-router-dom';
import { Mail, Lock, CheckCircle } from 'lucide-react';
import { Input, Button, Card } from '../components';
import { useAuth } from '../hooks/useAuth';
import { signupSchema, SignupInput } from '../schemas/auth';

export const Signup: React.FC = () => {
  const { signup, isLoading } = useAuth();
  const { register, handleSubmit, formState: { errors } } = useForm<SignupInput>({
    resolver: zodResolver(signupSchema),
  });

  const onSubmit = async (data: SignupInput) => {
    await signup(data);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary to-secondary/80 flex items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-primary rounded-lg flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="text-white" size={32} />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Inscription</h1>
          <p className="text-gray-600 mt-2">Créer un compte administrateur</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Prénom"
              type="text"
              placeholder="Jean"
              {...register('firstName')}
              error={errors.firstName}
            />
            <Input
              label="Nom"
              type="text"
              placeholder="Dupont"
              {...register('lastName')}
              error={errors.lastName}
            />
          </div>

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

          <Input
            label="Confirmer le mot de passe"
            type="password"
            placeholder="••••••••"
            icon={<Lock size={18} />}
            {...register('confirmPassword')}
            error={errors.confirmPassword}
          />

          <Button
            type="submit"
            variant="primary"
            size="lg"
            isLoading={isLoading}
            className="w-full"
          >
            S'inscrire
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-600 text-sm">
            Déjà inscrit?{' '}
            <Link to="/login" className="text-primary hover:underline font-medium">
              Se connecter
            </Link>
          </p>
        </div>
      </Card>
    </div>
  );
};
