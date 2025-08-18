const GoogleOAuthButton = () => {
  const handleGoogleLogin = () => {
    window.location.href = "http://localhost:8800/api/auth/google";
  };

  return (
    <button onClick={handleGoogleLogin}>
      Continue with Google
    </button>
  );
};

export default GoogleOAuthButton;
