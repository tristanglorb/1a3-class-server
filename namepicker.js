/* ═══════════════════════════════════════════════════════════
   js/namepicker.js  —  Name claim screen after login
   ═══════════════════════════════════════════════════════════ */

async function goToNamePicker() {
  goto('namepicker');
  await loadNameGrid();
}

async function loadNameGrid() {
  const grid = document.getElementById('nameGrid');
  const sub  = document.getElementById('namePickerSub');
  grid.innerHTML = '<div class="empty-state"><p class="empty-label">Loading…</p></div>';

  // Check if this user already claimed a name
  const { data: claimed } = await db
    .from('names')
    .select('display_name')
    .eq('user_id', currentUser.id)
    .single();

  if (claimed?.display_name) {
    currentUserName = claimed.display_name;
    await checkAdmin();
    goto('dashboard');
    return;
  }

  // Check which name is assigned to this email
  const { data: allowed } = await db
    .from('allowed_emails')
    .select('display_name')
    .eq('email', currentUser.email.toLowerCase())
    .single();

  if (!allowed) {
    sub.textContent = 'Your email is not recognised. Contact the server owner.';
    grid.innerHTML  = '<div class="empty-state"><p class="empty-label">No name assigned to your email.</p></div>';
    return;
  }

  // Check if someone else has already taken this name
  const { data: takenBy } = await db
    .from('names')
    .select('user_id')
    .eq('display_name', allowed.display_name)
    .single();

  if (takenBy && takenBy.user_id !== currentUser.id) {
    sub.textContent = 'Your name was already claimed. Contact the server owner.';
    grid.innerHTML  = `<div class="empty-state"><p class="empty-label">${allowed.display_name} is already taken.</p></div>`;
    return;
  }

  sub.textContent = 'This is your assigned name — tap to enter.';
  grid.innerHTML  = `<button class="name-btn" onclick="pickName('${allowed.display_name.replace(/'/g, "\\'")}')"><span>${allowed.display_name}</span></button>`;
}

async function pickName(name) {
  if (!currentUser) return;
  const sub = document.getElementById('namePickerSub');
  sub.textContent = 'Claiming name…';

  // Double-check the name matches what's allowed for this email (prevents spoofing)
  const { data: allowed } = await db
    .from('allowed_emails')
    .select('display_name')
    .eq('email', currentUser.email.toLowerCase())
    .single();

  if (!allowed || allowed.display_name.toLowerCase() !== name.toLowerCase()) {
    sub.textContent = 'Name mismatch — contact the server owner.';
    return;
  }

  const { error } = await db.from('names').insert({ display_name: name, user_id: currentUser.id });
  if (error) { sub.textContent = 'Could not claim name: ' + error.message; return; }

  currentUserName = name;
  await checkAdmin();
  toast('Welcome, ' + name + '!');
  goto('dashboard');
}
