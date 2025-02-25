// src/components/LoginPage.js
import React, { useState } from 'react';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';
import { useNavigate } from 'react-router-dom';
import '../styles/LoginPage.css';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [isSignup, setIsSignup] = useState(false);
  const [showSignupSuccess, setShowSignupSuccess] = useState(false); // State for popup
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/'); // Redirect to DashboardPage after successful login
    } catch (err) {
      setError(err.message);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      setShowSignupSuccess(true); // Show success popup
      setIsSignup(false); // Switch back to login mode
      setEmail(''); // Clear form
      setPassword('');
      setError(null);
    } catch (err) {
      setError(err.message);
    }
  };

  const toggleMode = () => {
    setIsSignup(prev => !prev);
    setError(null);
    setEmail('');
    setPassword('');
  };

  const closePopup = () => {
    setShowSignupSuccess(false);
  };

  return (
    <div className="login-container">
      <h2>{isSignup ? 'Sign Up' : 'Login'}</h2>
      <form onSubmit={isSignup ? handleSignup : handleLogin}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">{isSignup ? 'Sign Up' : 'Login'}</button>
        {error && <p className="error">{error}</p>}
      </form>
      <p className="toggle-text">
        {isSignup ? 'Already have an account?' : "Don't have an account?"}{' '}
        <button className="toggle-button" onClick={toggleMode}>
          {isSignup ? 'Login' : 'Sign Up'}
        </button>
      </p>

      {showSignupSuccess && (
        <div className="popup">
          <div className="popup-content">
            <h3>Signed Up Successfully!</h3>
            <p>Please log in with your new account.</p>
            <button onClick={closePopup}>OK</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoginPage;