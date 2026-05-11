/* ═══════════════════════════════════════════════════════════
   js/admin.js  —  Admin panel logic
   ═══════════════════════════════════════════════════════════ */

async function initAdminPanel() {
  // Re-verify from DB every time the panel is opened (can't be faked client-side)
  isAdmin = await verifyAdminFromDB();
  if (!isAdmin) { goto('dashboard'); toast('Access denied.'); return; }

  document.getElementById('adminSubtitle').textContent =
    `Signed in as ⚡ ${currentUserName} · Full admin access`;

  await loadAdminSessions();
}

async function loadAdminSessions() {
  const grid = document.getElementById('adminSessionGrid');
  if (!grid) return;
  grid.innerHTML = '<div class="empty-label" style="grid-column:1/-1;">Loading…</div>';

  const { data, error } = await db.from('names').select('*').order('created_at', { ascending: false });
  if (error || !data?.length) {
    grid.innerHTML = '<div class="empty-label" style="grid-column:1/-1;">No active sessions found.</div>';
    return;
  }

  grid.innerHTML = data.map(p => `
    <div class="admin-player-card">
      <div class="admin-player-name">${p.display_name}</div>
      <div class="admin-player-meta">Session claimed</div>
      ${isAdmin ? `<button class="btn-del" style="margin-top:8px;" onclick="adminKickPlayer('${p.id}')">Release name</button>` : ''}
    </div>`).join('');
}

async function adminKickPlayer(id) {
  // Always re-verify before destructive actions
  const confirmed = await verifyAdminFromDB();
  if (!confirmed) { toast('Not authorised.'); return; }
  if (!confirm('Release this name?')) return;
  const { error } = await db.from('names').delete().eq('id', id);
  if (error) { toast('Error: ' + error.message); return; }
  toast('Name released.');
  await loadAdminSessions();
}

async function postAdminAnnouncement() {
  const confirmed = await verifyAdminFromDB();
  if (!confirmed) { toast('Not authorised.'); return; }
  const title = document.getElementById('adminAnnTitle').value.trim();
  const tag   = document.getElementById('adminAnnTag').value;
  const body  = document.getElementById('adminAnnBody').value.trim();
  if (!title || !body) { toast('Please fill in the title and message.'); return; }
  const { error } = await db.from('events').insert({
    title, category: tag, body,
    priority: 'critical',
    author:   '⚡ ' + currentUserName,
    user_id:  currentUser.id,
    event_date: null
  });
  if (error) { toast('Error posting: ' + error.message); return; }
  document.getElementById('adminAnnTitle').value = '';
  document.getElementById('adminAnnBody').value  = '';
  toast('Announcement posted!');
}
