/* ═══════════════════════════════════════════════════════════
   js/homework.js  —  Homework log
   ═══════════════════════════════════════════════════════════ */

let hwFilter = 'All';

function setHWFilter(f, btn) {
  hwFilter = f;
  document.querySelectorAll('#hwFilterBar .filter-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  renderHW();
}

/** Return a label and CSS class for a due date */
function dueInfo(s) {
  if (!s) return { label: '', cls: '' };
  const d = new Date(s), now = new Date();
  now.setHours(0,0,0,0); d.setHours(0,0,0,0);
  const diff = Math.ceil((d - now) / (1000 * 60 * 60 * 24));
  if (diff < 0)   return { label: 'Overdue',       cls: 'due-soon'  };
  if (diff === 0) return { label: 'Due Today',     cls: 'due-today' };
  if (diff === 1) return { label: 'Due Tomorrow',  cls: 'due-soon'  };
  return { label: 'Due ' + d.toLocaleDateString('en-SG', { day:'numeric', month:'short' }), cls: '' };
}

async function renderHW() {
  const el = document.getElementById('hwList');
  setLoading(el, true, 'Loading homework…');
  let query = db.from('homework').select('*').order('created_at', { ascending: false });
  if (hwFilter !== 'All') query = query.eq('subject', hwFilter);
  const { data, error } = await query;
  if (error) { el.innerHTML = '<div class="empty-state"><p class="empty-label">Error loading homework.</p></div>'; return; }
  if (!data.length) { el.innerHTML = '<div class="empty-state"><p class="empty-label">No homework entries yet — add one above</p></div>'; return; }
  el.innerHTML = '<div class="entry-list">' + data.map(e => {
    const di = dueInfo(e.due_date);
    return `<div class="entry">
      <div class="entry-top"><div class="entry-subject">${e.subject || 'General'}</div><div class="entry-meta">${new Date(e.created_at).toLocaleDateString('en-SG', { day:'numeric', month:'short', year:'numeric' })}</div></div>
      ${e.title ? `<div style="font-family:'Cormorant Garamond',serif;font-size:18px;font-weight:300;color:var(--cream);margin-bottom:10px;">${e.title}</div>` : ''}
      <div class="entry-text">${e.notes || ''}</div>
      <div class="entry-footer">
        <div class="entry-author">Added by ${e.author || 'Anonymous'}</div>
        <div style="display:flex;align-items:center;gap:12px;">
          ${e.due_date ? `<div class="due-chip ${di.cls}">${di.label}</div>` : ''}
          ${(currentUser && e.user_id === currentUser.id) || isAdmin ? `<button class="btn-del" onclick="delHW('${e.id}')">Remove</button>` : ''}
        </div>
      </div>
    </div>`;
  }).join('') + '</div>';
}

async function addHW() {
  if (!currentUser) { toast('You must be signed in.'); return; }
  const subject  = document.getElementById('hwSubject').value;
  const due_date = document.getElementById('hwDue').value || null;
  const author   = document.getElementById('hwAuthor').value.trim() || currentUser.email;
  const title    = document.getElementById('hwTitle').value.trim();
  const notes    = document.getElementById('hwNotes').value.trim();
  if (!subject)      { toast('Please select a subject.'); return; }
  if (!title && !notes) { toast('Please add a title or description.'); return; }
  const { error } = await db.from('homework').insert({ subject, due_date, author, title, notes, user_id: currentUser.id });
  if (error) { toast('Error saving: ' + error.message); return; }
  ['hwSubject','hwDue','hwTitle','hwNotes'].forEach(id => { document.getElementById(id).value = ''; });
  toast('Homework entry added.');
  renderHW();
}

async function delHW(id) { await db.from('homework').delete().eq('id', id); toast('Entry removed.'); renderHW(); }
