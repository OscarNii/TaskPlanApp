import React from 'react';

const LoginPage: React.FC = () => {
  const handleGoogleLogin = () => {
    console.log('Attempting to login with Google...');
    // Add Google login logic here
  };

  const handleGitHubLogin = () => {
    console.log('Attempting to login with GitHub...');
    // Add GitHub login logic here
  };

  const handleAppleLogin = () => {
    console.log('Attempting to login with Apple...');
    // Add Apple login logic here
  };

  return (
    <div className="login-page">
      <h2>Login</h2>
      <div>
        <button onClick={handleGoogleLogin}>Login with Google</button>
      </div>
      <div>
        <button onClick={handleGitHubLogin}>Login with GitHub</button>
      </div>
      <div>
        <button onClick={handleAppleLogin}>Login with Apple</button>
      </div>
    </div>
  );
};

export default LoginPage;
