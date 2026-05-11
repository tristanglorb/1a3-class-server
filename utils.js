/* ═══════════════════════════════════════════════════════════
   js/utils.js  —  Small helper functions used everywhere
   ═══════════════════════════════════════════════════════════ */

/** Show a brief toast notification at the bottom-right */
function toast(msg) {
  const el = document.getElementById('toast');
  el.textContent = msg;
  el.classList.add('show');
  setTimeout(() => el.classList.remove('show'), 2800);
}

/** Format bytes into a human-readable string */
function fmtBytes(b) {
  if (b < 1024)     return b + ' B';
  if (b < 1048576)  return (b / 1024).toFixed(1) + ' KB';
  return (b / 1048576).toFixed(1) + ' MB';
}

/** Get the file extension from a filename */
function extOf(name) {
  const p = name.split('.');
  return p.length > 1 ? p.pop().slice(0, 4) : 'file';
}

/** Replace an element's inner HTML with a centered loading message */
function setLoading(el, yes, msg = 'Loading…') {
  el.innerHTML = yes
    ? `<div class="empty-state"><p class="empty-label">${msg}</p></div>`
    : '';
}

/**
 * Verify the current user is an admin by re-checking Supabase.
 * Always use this before performing sensitive admin writes,
 * so a client-side variable can't be tampered with.
 */
async function verifyAdminFromDB() {
  const { data, error } = await db
    .from('admins')
    .select('user_id')
    .eq('user_id', currentUser?.id)
    .single();
  return !!data && !error;
}

async function verifyOwnerFromDB() {
  const { data, error } = await db
    .from('owners')
    .select('user_id')
    .eq('user_id', currentUser?.id)
    .single();
  return !!data && !error;
}

/** Update isAdmin/isOwner and refresh nav badges */
async function checkAdmin() {
  const [adminRes, ownerRes] = await Promise.all([
    db.from('admins').select('user_id').eq('user_id', currentUser.id).single(),
    db.from('owners').select('user_id').eq('user_id', currentUser.id).single()
  ]);

  isAdmin = !!adminRes.data && !adminRes.error;
  isOwner = !!ownerRes.data && !ownerRes.error;
  if (isOwner) isAdmin = true;

  // Show/hide admin nav links
  document.querySelectorAll('[id^="adminNavLink"]').forEach(el => {
    el.style.display = isAdmin ? '' : 'none';
  });
  document.querySelectorAll('[id^="ownerNavLink"]').forEach(el => {
    el.style.display = isOwner ? '' : 'none';
  });

  // Update dashboard badge
  const badge = document.getElementById('dashBadge');
  if (badge) {
    if (isOwner) {
      badge.textContent = '👑 OWNER';
      badge.classList.add('admin-badge');
      badge.style.borderColor = 'gold';
      badge.style.color = 'gold';
    } else if (isAdmin) {
      badge.textContent = '⚡ ADMIN';
      badge.classList.add('admin-badge');
    } else {
      badge.textContent = '1A3';
      badge.classList.remove('admin-badge');
    }
  }
}
