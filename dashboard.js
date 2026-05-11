/* ═══════════════════════════════════════════════════════════
   js/dashboard.js  —  Dashboard stats + announcements
   ═══════════════════════════════════════════════════════════ */

async function refreshDashboardStats() {
  // Date line
  const opts = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  document.getElementById('dashDateLine').textContent =
    new Date().toLocaleDateString('en-SG', opts).toUpperCase();

  // Personalised welcome
  if (currentUserName) {
    const first  = currentUserName.split(' ')[0];
    const prefix = isAdmin ? '⚡ ' : '';
    document.getElementById('dashWelcome').innerHTML =
      `Welcome back,<br><em>${prefix}${first}.</em>`;
  }

  // Pull latest critical events to use as pinned announcements
  const { data } = await db
    .from('events')
    .select('*')
    .eq('priority', 'critical')
    .order('created_at', { ascending: false })
    .limit(3);

  if (data && data.length > 0) {
    document.getElementById('dashAnnouncements').innerHTML = data.map(e => `
      <div class="ann-card" style="border-top:2px solid var(--admin);">
        <div class="ann-tag" style="color:var(--admin);">${e.category || '⚡ Admin Notice'}</div>
        <h3 class="ann-heading">${e.title}</h3>
        <p class="ann-body">${e.body || ''}</p>
        <div class="ann-date" style="color:var(--admin);">
          ${e.author} · ${new Date(e.created_at).toLocaleDateString('en-SG', { day:'numeric', month:'short', year:'numeric' })}
        </div>
      </div>`).join('');
  }

  renderTimetable();
}
