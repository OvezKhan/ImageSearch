import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';

const LoginPage = () => {
  const { user, backendUrl } = useAuth();

  // If the user is already logged in, send them to the homepage
  if (user) {
    return <Navigate to="/" />;
  }

  // Your OAuth buttons
  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Welcome to ImageSearch Pro</h1>
      <p style={styles.subtitle}>Log in or Sign up to continue</p>
      
      {/* These links go directly to your backend OAuth routes */}
      <a href={`${backendUrl}/auth/google`} style={styles.authButton}>
        Continue with Google
      </a>
      <a href={`${backendUrl}/auth/github`} style={styles.authButton}>
        Continue with GitHub
      </a>
     
    </div>
  );
};

// Basic styles for the login page
const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    gap: '15px',
    background: '#f4f7f6'
  },
  title: {
    fontSize: '32px',
    color: '#333'
  },
  subtitle: {
    fontSize: '18px',
    color: '#555',
    marginTop: '-10px'
  },
  authButton: {
    textDecoration: 'none',
    padding: '12px 24px',
    fontSize: '16px',
    color: 'white',
    background: '#007bff',
    border: 'none',
    borderRadius: '5px',
    textAlign: 'center',
    minWidth: '250px'
  }
};

export default LoginPage;