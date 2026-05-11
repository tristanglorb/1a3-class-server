/* ═══════════════════════════════════════════════════════════
   js/app.js  —  Entry point. Runs last, after all other scripts.
   ═══════════════════════════════════════════════════════════ */

(async () => {
  // Restore an existing session (e.g. after a page refresh)
  const { data: { session } } = await db.auth.getSession();

  if (session?.user) {
    currentUser = session.user;

    // Check if they already claimed a name
    const { data: claimed } = await db
      .from('names')
      .select('display_name')
      .eq('user_id', currentUser.id)
      .single();

    if (claimed?.display_name) {
      currentUserName = claimed.display_name;
      await checkAdmin();
      goto('dashboard');
    } else {
      goToNamePicker();
    }
  }

  // Listen for future auth changes (sign-out from another tab, token expiry, etc.)
  db.auth.onAuthStateChange((_event, session) => {
    currentUser = session?.user || null;
    if (!currentUser) {
      currentUserName = null;
      goto('login');
    }
  });
})();
