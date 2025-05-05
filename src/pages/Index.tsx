
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

const Index = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  
  useEffect(() => {
    console.log("Index - currentUser:", currentUser);
    
    if (currentUser) {
      if (currentUser.isAdmin) {
        console.log("Index - Redirecting admin to /admin");
        navigate('/admin');
      } else {
        console.log("Index - Redirecting user to /dashboard");
        navigate('/dashboard');
      }
    } else {
      console.log("Index - No user, redirecting to /login");
      navigate('/login');
    }
  }, [currentUser, navigate]);
  
  return <div className="flex items-center justify-center h-screen">Redirecionando...</div>;
};

export default Index;
