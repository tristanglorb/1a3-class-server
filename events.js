/* ═══════════════════════════════════════════════════════════
   js/events.js  —  Events / pinboard
   ═══════════════════════════════════════════════════════════ */

let evFilter = 'All';

function setEvFilter(f, btn) {
  evFilter = f;
  document.querySelectorAll('#page-events .filter-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  renderEvents();
}

function cdInfo(s) {
  if (!s) return { label: '', cls: 'upcoming' };
  const d = new Date(s), now = new Date();
  now.setHours(0,0,0,0); d.setHours(0,0,0,0);
  const diff = Math.round((d - now) / (1000 * 60 * 60 * 24));
  if (diff < 0)   return { label: Math.abs(diff) + ' days ago', cls: 'past'     };
  if (diff === 0) return { label: 'Today',                      cls: 'today'    };
  if (diff === 1) return { label: 'Tomorrow',                   cls: 'soon'     };
  if (diff <= 7)  return { label: 'In ' + diff + ' days',       cls: 'soon'     };
  return { label: 'In ' + diff + ' days', cls: 'upcoming' };
}

async function renderEvents() {
  const el = document.getElementById('evGrid');
  setLoading(el, true, 'Loading events…');
  let query = db.from('events').select('*').order('event_date', { ascending: true, nullsFirst: false });
  if      (evFilter === 'upcoming') query = query.gte('event_date', new Date().toISOString().split('T')[0]);
  else if (evFilter === 'past')     query = query.lt('event_date',  new Date().toISOString().split('T')[0]);
  else if (evFilter !== 'All')      query = query.eq('priority', evFilter);
  const { data, error } = await query;
  if (error) { el.innerHTML = '<div class="empty-state"><p class="empty-label">Error loading events.</p></div>'; return; }
  if (!data.length) { el.innerHTML = '<div class="empty-state"><p class="empty-label">No events yet — pin one above</p></div>'; return; }
  el.innerHTML = '<div class="events-grid">' + data.map(e => {
    const cd = cdInfo(e.event_date);
    const d  = e.event_date ? new Date(e.event_date) : null;
    const dayNum   = d ? d.getDate() : '';
    const monthStr = d ? d.toLocaleDateString('en-SG', { month:'short', year:'numeric' }) : '';
    return `<div class="event-card priority-${e.priority || 'normal'}">
      <div class="event-top">
        <div class="event-type">${e.category || ({ critical:'Critical', high:'Important', normal:'Normal', info:'Info' }[e.priority] || '')}</div>
        ${d ? `<div class="event-date-display"><div class="event-day">${dayNum}</div><div class="event-month">${monthStr}</div></div>` : ''}
      </div>
      <div class="event-title">${e.title}</div>
      ${e.body ? `<div class="event-body">${e.body}</div>` : ''}
      <div class="event-footer">
        <div class="event-author">${e.author ? 'By ' + e.author : ''}</div>
        <div style="display:flex;align-items:center;gap:12px;">
          ${e.event_date ? `<span class="countdown ${cd.cls}">${cd.label}</span>` : ''}
          ${(currentUser && e.user_id === currentUser.id) || isAdmin ? `<button class="btn-del" onclick="delEvent('${e.id}')">Remove</button>` : ''}
        </div>
      </div>
    </div>`;
  }).join('') + '</div>';
}

async function addEvent() {
  if (!currentUser) { toast('You must be signed in.'); return; }
  const title      = document.getElementById('evTitle').value.trim();
  const event_date = document.getElementById('evDate').value || null;
  const priority   = document.getElementById('evPriority').value;
  const category   = document.getElementById('evCategory').value;
  const author     = document.getElementById('evAuthor').value.trim() || currentUser.email;
  const body       = document.getElementById('evBody').value.trim();
  if (!title) { toast('Please enter an event title.'); return; }
  const { error } = await db.from('events').insert({ title, event_date, priority, category, author, body, user_id: currentUser.id });
  if (error) { toast('Error saving: ' + error.message); return; }
  ['evTitle','evDate','evBody','evCategory'].forEach(id => { document.getElementById(id).value = ''; });
  toast('Event pinned to the board.');
  renderEvents();
}

async function delEvent(id) { await db.from('events').delete().eq('id', id); toast('Event removed.'); renderEvents(); }
