/* ═══════════════════════════════════════════════════════════
   js/config.js  —  Supabase client + app-wide constants
   ═══════════════════════════════════════════════════════════

   ⚠️  SECURITY NOTE:
   The anon key below is safe to be public — it's designed for
   browser use. Real security comes from Supabase Row Level
   Security (RLS) policies, NOT from hiding this key.
   See SECURITY.md for the full RLS setup guide.
   ═══════════════════════════════════════════════════════════ */

const SUPABASE_URL  = 'https://nkvtdrdskxgwphbhdodw.supabase.co';
const SUPABASE_ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5rdnRkcmRza3hnd3BoYmhkb2R3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY2OTcyMTUsImV4cCI6MjA5MjI3MzIxNX0.C-QMpeaLQzUtMvQXNKvWd8WLPf7MjVd01Sx8hdr6a1U';

// Create the Supabase client — available globally as `db`
const { createClient } = supabase;
const db = createClient(SUPABASE_URL, SUPABASE_ANON);

// ── App-wide state ──────────────────────────────────────────
// These are set by auth.js and read by all other modules
let currentUser     = null;  // Supabase auth user object
let currentUserName = null;  // Display name from `names` table
let isAdmin         = false;
let isOwner         = false;

// ── Passcode for the Secret Logs (Games) page ───────────────
// This is a SHA-256 hash — the raw passcode is NOT stored here.
// To change the code, hash your new number at: https://emn178.github.io/online-tools/sha256.html
const GAME_CODE_HASH = '6947f46155543e51845e4e5cc21368bb975052077183ac36eff44447db6ab11c';

// ── All registered page IDs ─────────────────────────────────
const PAGES = [
  'login', 'namepicker', 'dashboard',
  'notes', 'homework', 'events',
  'games', 'chameleon', 'admin', 'owner', 'chessmulti'
];
