import { useState } from 'react'
import { GoogleLogin, googleLogout } from '@react-oauth/google'
import { jwtDecode } from 'jwt-decode'
import './App.css'

function App() {
  const [user, setUser] = useState(null)

  const handleLoginSuccess = (credentialResponse) => {
    const decoded = jwtDecode(credentialResponse.credential)
    setUser(decoded)
  }

  const handleLoginError = () => {
    console.error('Login Failed')
    alert('Login failed. Please try again.')
  }

  const handleLogout = () => {
    googleLogout()
    setUser(null)
  }

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>DevMinds Inc.</h1>
        <p className="tagline">Secure and User-Friendly Web Solutions</p>
      </header>

      <main className="main-content">
        <section className="static-section">
          <h2>Welcome to Our Secure Portal</h2>
          <p>
            This application demonstrates OpenID Connect (OIDC) authentication 
            for modern Single Page Applications. OIDC provides a secure, 
            standardized way to verify user identity across the web.
          </p>
          <p>
            Please log in below to access your personalized dashboard.
          </p>
        </section>

        <section className="auth-section">
          {!user ? (
            <div className="login-container">
              <h3>Sign In to Continue</h3>
              <p>Use your Google account to securely authenticate.</p>
              <GoogleLogin
                onSuccess={handleLoginSuccess}
                onError={handleLoginError}
              />
            </div>
          ) : (
            <div className="user-card">
              <h3>Authentication Successful</h3>
              <div className="user-info">
                {user.picture && (
                  <img
                    src={user.picture}
                    alt="Profile"
                    className="profile-picture"
                  />
                )}
                <div className="user-details">
                  <p><span className="label">Name:</span> {user.name}</p>
                  <p><span className="label">Email:</span> {user.email}</p>
                  <p><span className="label">Given Name:</span> {user.given_name}</p>
                  <p><span className="label">Family Name:</span> {user.family_name}</p>
                  <p>
                    <span className="label">Email Verified:</span>{' '}
                    {user.email_verified ? 'Yes' : 'No'}
                  </p>
                </div>
              </div>
              <button className="logout-btn" onClick={handleLogout}>
                Sign Out
              </button>
            </div>
          )}
        </section>
      </main>

      <footer className="app-footer">
        <p>© 2026 DevMinds Inc. | Secured with OpenID Connect (OIDC)</p>
      </footer>
    </div>
  )
}

export default App