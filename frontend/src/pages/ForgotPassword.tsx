import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft } from 'lucide-react';
import { Input, Button, Card } from '../components';
import { useAuth } from '../hooks/useAuth';
import { resetPasswordSchema, ResetPasswordInput } from '../schemas/auth';

export const ForgotPassword: React.FC = () => {
  const { resetPassword, isLoading } = useAuth();
  const { register, handleSubmit, formState: { errors } } = useForm<ResetPasswordInput>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const onSubmit = async (data: ResetPasswordInput) => {
    await resetPassword(data);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary to-secondary/80 flex items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-primary rounded-lg flex items-center justify-center mx-auto mb-4">
            <Mail className="text-white" size={32} />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Mot de passe oublié</h1>
          <p className="text-gray-600 mt-2">Réinitialiser votre mot de passe</p>
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

          <p className="text-sm text-gray-600">
            Nous vous enverrons un lien pour réinitialiser votre mot de passe.
          </p>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            isLoading={isLoading}
            className="w-full"
          >
            Envoyer le lien
          </Button>
        </form>

        <div className="mt-6 text-center">
          <Link
            to="/login"
            className="inline-flex items-center space-x-2 text-primary hover:underline"
          >
            <ArrowLeft size={18} />
            <span>Retour à la connexion</span>
          </Link>
        </div>
      </Card>
    </div>
  );
};
