# AWS Cognito Auth Web App (Login + Landing Menus)

This project is a lightweight browser-based web app that includes:

- **AWS Cognito User Pool authentication** (username/password login)
- A **login page**
- A post-login **landing page** with:
  - a **horizontal top menu**
  - a **vertical sidebar menu**

## Files

- `index.html` - app markup (login + authenticated layout)
- `styles.css` - styling for login and landing pages
- `config.js` - Cognito configuration
- `app.js` - Cognito login/session/logout logic

## Configure AWS Cognito

1. Create an AWS Cognito User Pool and an App Client.
2. Update `config.js`:

```js
window.COGNITO_CONFIG = {
  region: 'us-east-1',
  userPoolId: 'us-east-1_example',
  clientId: 'exampleclientid123',
};
```

## Run locally

Use any static web server. Example:

```bash
python3 -m http.server 8080
```

Then open `http://localhost:8080`.

## Notes

- `newPasswordRequired` is surfaced as a message only in this sample.
- For production: add secure flows for MFA, password reset, challenge handling, and token refresh/error handling.
