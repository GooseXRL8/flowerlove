
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

const Index = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  
  useEffect(() => {
    if (currentUser) {
      navigate('/dashboard');
    } else {
      navigate('/login');
    }
  }, [currentUser, navigate]);
  
  return <div className="flex items-center justify-center h-screen">Redirecionando...</div>;
};

export default Index;
