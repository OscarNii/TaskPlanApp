import React from 'react';

const LoginPage: React.FC = () => {
  const handleGmailLogin = () => {
    console.log('Attempting to login with Gmail...');
    // Placeholder for Gmail login logic
  };

  const handleGitHubLogin = () => {
    console.log('Attempting to login with GitHub...');
    // Placeholder for GitHub login logic
  };

  const handleAppleLogin = () => {
    console.log('Attempting to login with Apple...');
    // Placeholder for Apple login logic
  };

  return (
    <div className="login-page">
      <h2>Login</h2>
      <div>
        <button onClick={handleGmailLogin}>Login with Gmail</button>
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