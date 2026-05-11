/* ═══════════════════════════════════════════════════════════
   js/auth.js  —  Login, register, sign-out
   ═══════════════════════════════════════════════════════════ */

let loginMode = 'login';

/** Switch between Sign In / Register tabs */
function switchTab(m) {
  loginMode = m;
  document.querySelectorAll('.tab').forEach((t, i) =>
    t.classList.toggle('active', (i === 0) === (m === 'login'))
  );
  document.getElementById('loginTitle').textContent    = m === 'login' ? 'Sign In' : 'Create Account';
  document.getElementById('loginSubtitle').textContent = m === 'login' ? 'HCI student emails only' : 'Join 1A3 Class Server';
  document.getElementById('btnText').textContent       = m === 'login' ? 'Sign In' : 'Create Account';
  document.getElementById('confirmGroup').style.display = m === 'register' ? 'block' : 'none';
  document.getElementById('loginOptions').style.display = m === 'login'    ? 'flex'  : 'none';
  document.getElementById('statusMsg').classList.remove('show');
  document.getElementById('submitBtn').classList.remove('success');
}

function showMsg(text, type) {
  const el = document.getElementById('statusMsg');
  el.textContent = text;
  el.className = `status-msg ${type} show`;
  if (type === 'error') setTimeout(() => el.classList.remove('show'), 6000);
}

async function handleSubmit() {
  const email    = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value;
  const btn      = document.getElementById('submitBtn');
  const btnText  = document.getElementById('btnText');

  // Validation
  if (!email)    { showMsg('Please enter your email address.', 'error'); return; }
  if (!email.toLowerCase().endsWith('@student.hci.edu.sg')) {
    showMsg('Only @student.hci.edu.sg email addresses are allowed.', 'error'); return;
  }
  if (!password) { showMsg('Please enter your password.', 'error'); return; }
  if (loginMode === 'register') {
    const confirm = document.getElementById('confirmPassword').value;
    if (password !== confirm) { showMsg('Passwords do not match.', 'error'); return; }
    if (password.length < 8)  { showMsg('Password must be at least 8 characters.', 'error'); return; }
  }

  btn.disabled = true;
  btnText.textContent = loginMode === 'login' ? 'Verifying…' : 'Creating account…';

  try {
    let error, user;
    if (loginMode === 'login') {
      const { data, error: e } = await db.auth.signInWithPassword({ email, password });
      error = e; user = data?.user;
    } else {
      const { data, error: e } = await db.auth.signUp({ email, password });
      error = e; user = data?.user;
    }

    if (error) { showMsg(error.message, 'error'); return; }

    currentUser = user;

    // Log the login event (for the Owner panel activity log)
    if (loginMode === 'login') {
      await db.from('login_log').insert({
        user_id:    user.id,
        email:      user.email,
        user_agent: navigator.userAgent
      });
    }

    // Check if user is blacklisted
    const { data: banned } = await db
      .from('blacklist')
      .select('reason')
      .eq('user_id', user.id)
      .maybeSingle();
    if (banned) {
      await db.auth.signOut();
      showMsg('Your account has been suspended' + (banned.reason ? ': ' + banned.reason : '.'), 'error');
      return;
    }

    btn.classList.add('success');
    btnText.textContent = loginMode === 'login' ? '✓  Access Granted' : '✓  Account Created';
    showMsg(
      loginMode === 'login'
        ? `Welcome back, ${email}`
        : `Account created! Check your email to confirm, then sign in.`,
      'success-msg'
    );
    if (loginMode === 'login') setTimeout(() => goToNamePicker(), 1200);
    else btn.classList.remove('success');

  } catch (err) {
    showMsg('Something went wrong — please try again.', 'error');
    console.error(err);
  } finally {
    if (!btn.classList.contains('success')) {
      btn.disabled = false;
      btnText.textContent = loginMode === 'login' ? 'Sign In' : 'Create Account';
    }
  }
}

// Allow Enter key to submit
['email', 'password', 'confirmPassword'].forEach(id => {
  const el = document.getElementById(id);
  if (el) el.addEventListener('keydown', e => { if (e.key === 'Enter') handleSubmit(); });
});

async function signOut() {
  await db.auth.signOut();
  currentUser   = null;
  currentUserName = null;
  isAdmin       = false;
  sessionStorage.removeItem('gamesUnlocked');
  gamesUnlocked = false;
  goto('login');
}
