# SPA with OIDC Authentication

CST640-Week 5 Assignment

Creating a Simple Single-page Web App with OIDC Authentication

A single page web application that authenticates users via **Google OpenID Connect (OIDC)** and displays minimal demographic information from the authenticated user's ID token.

---

## Overview

When a visitor lands on the app, they see a short block of static welcome text and a **Sign in with Google** button. After successful authentication the app:

1. Receives a signed **ID token** (a JWT) from Google
2. Decodes the token on the client side using [`jwt-decode`](https://www.npmjs.com/package/jwt-decode)
3. Displays the user's name, email, and profile picture in place of the sign-in button

The ID token lives in React state only (not in `localStorage` or `sessionStorage`)

---

## Tech Stack

| Layer | Choice |
|---|---|
| Framework | React 19 (via [Vite](https://vite.dev/)) |
| OIDC Provider | Google |
| OIDC Library | [`@react-oauth/google`](https://www.npmjs.com/package/@react-oauth/google) |
| Token Decoding | [`jwt-decode`](https://www.npmjs.com/package/jwt-decode) |
| Styling | Plain CSS |
| Linting | ESLint flat config (React Hooks + Vite HMR rules) |
| Version Control | Git / GitHub |

---

## Prerequisites

- **Node.js** 20 or later, with **npm**
- A **Google account** (to create OAuth 2.0 credentials in Google Cloud Console)
- A modern browser (Chromium, Firefox, or Safari)

---

## Setup

### 1. Register a Google OAuth 2.0 Client ID

1. Go to the [Google Cloud Console](https://console.cloud.google.com/).
2. **Create a new project** (or select an existing one).
3. Open **APIs & Services → OAuth consent screen**. Configure the app as an **External** user type, then add your own Google account as a **test user** while the app remains unpublished.
4. Open **APIs & Services → Credentials → + Create credentials → OAuth client ID**.
5. Choose **Web application** as the application type.
6. Under **Authorized JavaScript origins**, add:

   ```
   http://localhost:5173
   ```

7. Leave **Authorized redirect URIs** blank. This SPA uses Google Identity Services' popup flow handled by `@react-oauth/google`, not server side redirects.
8. Click **Create** and copy the generated **Client ID** (it ends in `.apps.googleusercontent.com`).

### 2. Clone and Install

```bash
git clone https://github.com/Rusty-nails/spa-oidc-app.git
cd spa-oidc-app
npm install
```

### 3. Configure Environment Variables

Copy the example file and fill in your client ID:

```bash
cp .env.example .env.local
```

Open `.env.local` and set:

```env
VITE_GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
```

> **Why the `VITE_` prefix?** Vite only exposes environment variables beginning with `VITE_` to browser code. Any such variable is **bundled into the shipped JavaScript and is publicly visible** to anyone who opens DevTools. For OAuth *public clients* (SPAs), the client ID is not a secret and is safe to ship. **Never** put client *secrets* in a `VITE_`-prefixed variable.

### 4. Run the App

```bash
npm run dev
```

The app is available at [http://localhost:5173](http://localhost:5173).

---

## Available Scripts

| Command | Purpose |
|---|---|
| `npm run dev` | Start the Vite dev server with hot reload |
| `npm run build` | Produce a production bundle in `dist/` |
| `npm run preview` | Serve the production bundle locally for smoke testing |
| `npm run lint` | Lint all JS/JSX files with ESLint |

---

## Project Structure

```
spa-oidc-app/
├── eslint.config.js     # ESLint flat config (React Hooks + Vite HMR rules)
├── index.html           # Single HTML entry point
├── package.json
├── vite.config.js
├── .env.example         # Template for environment variables
├── public/              # Static assets served as-is
└── src/
    ├── main.jsx         # React mount point, wraps App in <GoogleOAuthProvider>
    ├── App.jsx          # Root component with login button and user info display
    ├── App.css          # Component styles
    └── index.css        # Global styles
```

---

## How Authentication Flows

1. User clicks **Sign in with Google**. `@react-oauth/google` opens Google's sign-in prompt.
2. User authenticates with Google using their own password and 2FA. The app never sees the credentials.
3. Google returns an **ID token** (a JWT containing the user's claims) directly to the SPA.
4. The SPA decodes the JWT using `jwt-decode` and reads the `name`, `email`, and `picture` claims.
5. React state updates, and the UI re-renders to show the user's info.

---

## Reflection

OIDC improves the user experience by removing the friction of creating yet another account. Users sign in with credentials they already have and trust, which cuts out the account creation form, the verification email, and the new password to remember. The Google prompt is familiar to almost everyone, so the moment of hesitation that comes with clicking Sign Up on an unfamiliar app mostly goes away. Standardized claims like name, email, and profile picture also let the app personalize the experience right after login without asking the user to fill out additional fields.

On the security side, the main benefit is that the app never handles passwords directly. Credential storage, brute force protection, and multi factor authentication all stay with Google, which has dedicated teams working on identity security full time. The ID token itself is a signed JWT with fields for the issuer, audience, expiration, and nonce, which together protect against tampering and replay attacks (Johnson, 2022). Keeping the token in React state rather than localStorage was a deliberate choice. Persistent browser storage is vulnerable to cross site scripting, so reducing the token's lifetime to the current tab limits the damage if an XSS vulnerability ever slipped through.

The biggest challenge during setup was Google's configuration propagation. After saving the authorized JavaScript origin, the app still returned an "origin not allowed" error for several minutes until Google's systems caught up. Picking the right flow also took some thought. The Authorization Code flow with PKCE is the current recommended approach for SPAs, but for this project the ID token flow through Google Identity Services was enough since the app only needs to know who the user is and does not call any Google APIs on their behalf. For a production version, the next step would be adding a backend for frontend pattern so tokens never touch the browser at all.

---

## References

Brown, S. (2025). *The difference between SAML vs. OIDC*. StrongDM. https://www.strongdm.com/blog/oidc-vs-saml

David, M. (n.d.). *OAuth 2.0 concepts & OAuth flows*. Medium. https://iamblockc.medium.com/     oauth-2-0-concepts-oauth-flows-8debed7a9abc

Google. (2026). *Google OpenID Connect API reference*. Google for Developers. https://developers.google.com/identity/openid-connect/reference

Google. (n.d.). *OpenID Connect*. Google for Developers. https://developers.google.com/identity/openid-connect/openid-connect

Johnson, K. (2022). *How to implement OpenID Connect for single page applications*. TechTarget. https://www.techtarget.com/searchsecurity/feature/How-to-implement-OpenID-Connect-for-single-page-applications

Microsoft. (2026). *OpenID Connect on the Microsoft identity platform*. Microsoft Learn. https://learn.microsoft.com/en-us/entra/identity-platform/v2-protocols-oidc

OWASP Foundation. (2021). *OAuth 2.0 and OpenID Connect for single page applications — Philippe De Ryck* [Video]. YouTube. https://www.youtube.com/watch?v=XoBtUn4XczU

WSO2. (2020). *Building a single page application with OIDC authentication #Identityin15* [Video]. YouTube. https://www.youtube.com/watch?v=HPneV0xpm8U


---

## Author

CST-640: Student-M252