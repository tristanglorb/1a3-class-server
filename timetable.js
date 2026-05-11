/* ═══════════════════════════════════════════════════════════
   js/timetable.js  —  Weekly timetable renderer
   ═══════════════════════════════════════════════════════════

   The timetable alternates between ODD and EVEN weeks.
   TIMETABLE_ANCHOR is a Monday that counts as "even week 0".
   ═══════════════════════════════════════════════════════════ */

const TIMETABLE_ANCHOR = new Date('2026-04-27');

function getWeekParity() {
  const msPerWeek  = 7 * 24 * 60 * 60 * 1000;
  const weeksDiff  = Math.floor((new Date() - TIMETABLE_ANCHOR) / msPerWeek);
  return weeksDiff % 2 === 0 ? 'even' : 'odd';
}

function getSlotStatus(startStr, endStr) {
  const now = new Date();
  const [sh, sm] = startStr.split(':').map(Number);
  const [eh, em] = endStr.split(':').map(Number);
  const start = new Date(now); start.setHours(sh, sm, 0, 0);
  const end   = new Date(now); end.setHours(eh, em, 0, 0);
  if (now >= end)   return 'done';
  if (now >= start) return 'now';
  return null;
}

/* ── Full timetable data ── */
const TIMETABLE = {
  odd: {
    Mon: [
      ['07:40','08:00','Safety & Well-Being','—','B2-04'],
      ['08:00','09:00','MU','TanBB','Music Rm Level 2'],
      ['09:00','09:30','PE','AngKS','—'],
      ['09:30','10:00','Recess','—','—'],
      ['10:00','11:30','TP','ChewTY','B2-04'],
      ['11:30','12:30','MA','PekRH / LimBH / ChuaBW / ZongLX','1A3 classroom / 1F3 ProEd Room C402'],
      ['12:30','13:00','HC','TeoMH','B2-04'],
      ['13:00','13:30','Lunch','—','—'],
    ],
    Tue: [
      ['07:40','08:00','Safety & Well-Being','—','B2-04'],
      ['08:00','09:00','ACC','PanYL','B2-04'],
      ['09:00','09:30','HC','TeoMH','B2-04'],
      ['09:30','10:00','Recess','—','—'],
      ['10:00','11:30','LSS','LowSX','Lab 3/7'],
      ['11:30','12:30','IF','ChiaKP','Level 1 – IT Lab'],
      ['12:30','13:00','Lunch','—','—'],
    ],
    Wed: [
      ['07:40','08:00','Safety & Well-Being','—','B2-04'],
      ['08:00','09:00','GE','YapHB','B2-04'],
      ['09:00','09:30','Recess','—','—'],
      ['09:30','11:00','ELL','Nicole Lua','B2-04'],
      ['11:00','12:00','HC','TeoMH','B2-04'],
      ['12:00','12:30','Lunch','—','—'],
      ['13:30','14:00','HI','Mervin','B3-01'],
    ],
    Thu: [['08:00','12:30','HBL (Asynchronous)','—','Home']],
    Fri: [
      ['07:40','08:00','Safety & Well-Being','—','B2-04'],
      ['08:00','09:00','Art','KuekSS','General Art Studio'],
      ['09:00','09:30','MA','PekRH / LimBH / ChuaBW / ZongLX','1A3 classroom / 1F3 ProEd Room C402'],
      ['09:30','10:00','Recess','—','—'],
      ['10:00','11:00','CCE/FT/Con Assy','TeoMH / PanYL','B2-04'],
      ['11:00','12:30','S1 Assembly & CCE (FT)','TeoMH / PanYL','B2-04'],
      ['12:30','13:00','ELL','Nicole Lua','B2-04'],
      ['13:00','13:30','Lunch','—','—'],
    ],
  },
  even: {
    Mon: [
      ['07:40','08:00','Safety & Well-Being','—','B2-04'],
      ['08:00','09:00','IF','ChiaKP','Level 1 – IT Lab'],
      ['09:00','09:30','PE','AngKS','—'],
      ['09:30','10:00','Recess','—','—'],
      ['10:00','11:00','ELL','Nicole Lua','B2-04'],
      ['11:00','12:00','GE','YapHB','B2-04'],
      ['12:00','13:00','Lunch','—','—'],
    ],
    Tue: [
      ['07:40','08:00','Safety & Well-Being','—','B2-04'],
      ['08:00','09:30','LSS','LowSX','Lab 3/8'],
      ['09:30','10:00','Recess','—','—'],
      ['10:00','10:30','TP','ChewTY','B2-04'],
      ['10:30','11:30','Art','KuekSS','General Art Studio'],
      ['11:30','12:30','ELL','Nicole Lua','B2-04'],
      ['12:30','13:00','Lunch','—','—'],
    ],
    Wed: [
      ['07:40','08:00','Safety & Well-Being','—','B2-04'],
      ['08:00','09:00','ACC','PanYL','B2-04'],
      ['09:00','09:30','MU','TanBB','Music Rm Level 2'],
      ['09:30','10:00','Recess','—','—'],
      ['10:00','11:00','PE','AngKS','—'],
      ['11:00','12:00','HC','TeoMH','B2-04'],
      ['12:00','12:30','MA','PekRH / LimBH / ChuaBW / ZongLX','1A3 classroom / 1F3 ProEd Room C402'],
      ['12:30','13:00','Lunch','—','—'],
      ['13:30','14:00','HI','Mervin','B3-01'],
    ],
    Thu: [
      ['07:40','08:00','Safety & Well-Being','—','B2-04'],
      ['08:00','09:00','PACE','—','B2-04'],
      ['09:00','09:30','Safety & Well-Being','—','B2-04'],
      ['09:30','10:00','CCE/FT/Con Assy','TeoMH / PanYL','B2-04'],
      ['10:00','11:30','MA','PekRH / LimBH / ChuaBW / ZongLX','1A3 classroom / 1F3 ProEd Room C402'],
      ['11:30','12:30','HC','TeoMH','B2-04'],
      ['12:30','13:00','Lunch','—','—'],
    ],
    Fri: [
      ['07:40','08:00','Safety & Well-Being','—','B2-04'],
      ['08:00','09:00','LSS','LowSX','B2-04'],
      ['09:00','09:30','MA','PekRH / LimBH / ChuaBW / ZongLX','1A3 classroom / 1F3 ProEd Room C402'],
      ['09:30','10:00','Recess','—','—'],
      ['10:00','11:00','ELL','Nicole Lua','B2-04'],
      ['11:00','12:30','S1 Assembly & CCE (FT)','TeoMH / PanYL','B2-04'],
      ['12:30','13:00','Lunch','—','—'],
      ['13:30','14:00','HI','Mervin','B3-01'],
    ],
  }
};

function renderTimetable() {
  const body = document.getElementById('scheduleBody');
  if (!body) return;

  const dayNames = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
  const today    = new Date();
  const dayName  = dayNames[today.getDay()];
  const parity   = getWeekParity();

  if (dayName === 'Sun' || dayName === 'Sat') {
    body.innerHTML = `<tr><td colspan="5" style="text-align:center;padding:32px;font-size:11px;letter-spacing:.2em;color:var(--text-muted);text-transform:uppercase;">No school today — enjoy your weekend!</td></tr>`;
    return;
  }

  const slots = TIMETABLE[parity]?.[dayName];
  if (!slots?.length) {
    body.innerHTML = `<tr><td colspan="5" style="text-align:center;padding:32px;font-size:11px;letter-spacing:.2em;color:var(--text-muted);text-transform:uppercase;">No timetable data for today.</td></tr>`;
    return;
  }

  // Compute each slot's status
  let foundNext = false;
  const statuses = slots.map(([start, end]) => {
    const s = getSlotStatus(start, end);
    if (s === 'now' || s === 'done') return s;
    return null;
  });
  for (let i = 0; i < statuses.length; i++) {
    if (statuses[i] === null) {
      if (!foundNext) { statuses[i] = 'next'; foundNext = true; }
      else statuses[i] = 'upcoming';
    }
  }

  const pillClass = { done:'status-done', now:'status-now', next:'status-next', upcoming:'status-next' };
  const pillLabel = { done:'Done', now:'Now', next:'Next', upcoming:'Upcoming' };

  body.innerHTML = slots.map(([start, end, subject, teacher, room], i) => {
    const st = statuses[i];
    return `<tr>
      <td class="time-cell">${start} – ${end}</td>
      <td>${subject}</td>
      <td>${teacher}</td>
      <td class="room-cell">${room}</td>
      <td><span class="status-pill ${pillClass[st]}">${pillLabel[st]}</span></td>
    </tr>`;
  }).join('');

  // Update the section heading to show parity
  const head = document.querySelector('#page-dashboard .schedule-wrap .section-title');
  if (head) head.textContent = `Today's Schedule — ${parity.charAt(0).toUpperCase() + parity.slice(1)} Week`;
}
