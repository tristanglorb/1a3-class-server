/* ═══════════════════════════════════════════════════════════
   js/router.js  —  Page navigation
   ═══════════════════════════════════════════════════════════ */

let activeGame = null;

function goto(id) {
  // Access control
  if (id === 'admin' && !isAdmin) { toast('Access denied.'); return; }
  if (id === 'owner' && !isOwner) { toast('Access denied.'); return; }

  // Reset active game when leaving games page
  if (id !== 'games') activeGame = null;

  // Show/hide pages
  PAGES.forEach(p =>
    document.getElementById('page-' + p)?.classList.toggle('active', p === id)
  );

  // Remove active class from all nav links
  document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));

  // Scroll to top
  window.scrollTo(0, 0);

  // Page-specific init calls
  if (id === 'dashboard')  refreshDashboardStats();
  if (id === 'notes')      renderFiles();
  if (id === 'homework')   renderHW();
  if (id === 'events')     renderEvents();
  if (id === 'chameleon')  initChameleon();
  if (id === 'admin')      initAdminPanel();
  if (id === 'owner')      initOwnerPanel();
  if (id === 'games')      initGamesPage();
  if (id === 'chessmulti') cmInit();

  // Stop multiplayer listeners when leaving those pages
  if (id !== 'chameleon') stopChameleonPolling();
  if (id !== 'chessmulti' && typeof cmStopSub === 'function') cmStopSub();
}
