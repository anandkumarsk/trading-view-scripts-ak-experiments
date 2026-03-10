(function () {
  const authView = document.getElementById('auth-view');
  const landingView = document.getElementById('landing-view');
  const loginForm = document.getElementById('login-form');
  const authMessage = document.getElementById('auth-message');
  const logoutBtn = document.getElementById('logout-btn');
  const displayName = document.getElementById('display-name');

  const { CognitoUserPool, CognitoUser, AuthenticationDetails } = AmazonCognitoIdentity;

  function isConfigured() {
    const cfg = window.COGNITO_CONFIG || {};
    return cfg.userPoolId &&
      cfg.clientId &&
      !cfg.userPoolId.startsWith('REPLACE_') &&
      !cfg.clientId.startsWith('REPLACE_');
  }

  function getPool() {
    if (!isConfigured()) {
      throw new Error('Cognito config missing. Update config.js before login.');
    }

    const cfg = window.COGNITO_CONFIG;
    return new CognitoUserPool({
      UserPoolId: cfg.userPoolId,
      ClientId: cfg.clientId,
    });
  }

  function setView(isLoggedIn, username) {
    authView.classList.toggle('hidden', isLoggedIn);
    landingView.classList.toggle('hidden', !isLoggedIn);
    if (isLoggedIn && username) {
      displayName.textContent = username;
    }
  }

  function checkExistingSession() {
    if (!isConfigured()) {
      authMessage.textContent = 'Configure config.js with your Cognito user pool details first.';
      return;
    }

    const userPool = getPool();
    const currentUser = userPool.getCurrentUser();

    if (!currentUser) {
      setView(false);
      return;
    }

    currentUser.getSession((err, session) => {
      if (err || !session?.isValid()) {
        setView(false);
        return;
      }

      currentUser.getUserAttributes((attrErr, attrs = []) => {
        const name = attrs.find((attr) => attr.getName() === 'name')?.getValue() || currentUser.getUsername();
        setView(true, name);
      });
    });
  }

  loginForm.addEventListener('submit', (event) => {
    event.preventDefault();
    authMessage.textContent = '';

    let userPool;
    try {
      userPool = getPool();
    } catch (error) {
      authMessage.textContent = error.message;
      return;
    }

    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;

    const authDetails = new AuthenticationDetails({
      Username: username,
      Password: password,
    });

    const cognitoUser = new CognitoUser({
      Username: username,
      Pool: userPool,
    });

    cognitoUser.authenticateUser(authDetails, {
      onSuccess: () => setView(true, username),
      onFailure: (err) => {
        authMessage.textContent = err?.message || 'Login failed.';
      },
      newPasswordRequired: () => {
        authMessage.textContent = 'New password challenge received. Complete this flow in production.';
      },
    });
  });

  logoutBtn.addEventListener('click', () => {
    if (!isConfigured()) {
      setView(false);
      return;
    }

    const userPool = getPool();
    const currentUser = userPool.getCurrentUser();
    if (currentUser) {
      currentUser.signOut();
    }
    setView(false);
  });

  checkExistingSession();
})();
