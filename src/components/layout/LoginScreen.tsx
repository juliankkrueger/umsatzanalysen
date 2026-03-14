import { useState, useRef } from 'react';

interface LoginScreenProps {
  onLogin: () => void;
}

const MAX_ATTEMPTS = 5;
const LOCKOUT_SECONDS = 30;

async function sha256(value: string): Promise<string> {
  const msgBuffer = new TextEncoder().encode(value);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  return Array.from(new Uint8Array(hashBuffer))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

export function LoginScreen({ onLogin }: LoginScreenProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [lockedUntil, setLockedUntil] = useState<number | null>(null);
  const [secondsLeft, setSecondsLeft] = useState(0);
  const lockTimer = useRef<ReturnType<typeof setInterval> | null>(null);

  const isLocked = lockedUntil !== null && Date.now() < lockedUntil;

  const startLockout = () => {
    const until = Date.now() + LOCKOUT_SECONDS * 1000;
    setLockedUntil(until);
    setSecondsLeft(LOCKOUT_SECONDS);
    lockTimer.current = setInterval(() => {
      const remaining = Math.ceil((until - Date.now()) / 1000);
      if (remaining <= 0) {
        clearInterval(lockTimer.current!);
        setLockedUntil(null);
        setSecondsLeft(0);
        setAttempts(0);
      } else {
        setSecondsLeft(remaining);
      }
    }, 1000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLocked || loading) return;

    setLoading(true);
    setError(false);

    // Minimum delay um Timing-Angriffe zu erschweren
    const [userHash, passHash] = await Promise.all([
      sha256(username),
      sha256(password),
      new Promise(r => setTimeout(r, 400)),
    ]);

    const validUser = import.meta.env.VITE_APP_USERNAME_HASH;
    const validPass = import.meta.env.VITE_APP_PASSWORD_HASH;

    if (userHash === validUser && passHash === validPass) {
      sessionStorage.setItem('upa_auth', 'true');
      onLogin();
    } else {
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);
      setError(true);
      setLoading(false);
      if (newAttempts >= MAX_ATTEMPTS) {
        startLockout();
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* Logo / Titel */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-emerald-500 mb-4">
            <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-white">Umsatzpotenzialanalyse</h1>
          <p className="text-slate-400 text-sm mt-1">Agentur Krüger GmbH</p>
        </div>

        {/* Login Card */}
        <form
          onSubmit={handleSubmit}
          className="bg-slate-800 rounded-2xl p-8 shadow-2xl border border-slate-700"
        >
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">
                Benutzername
              </label>
              <input
                type="text"
                value={username}
                onChange={e => setUsername(e.target.value)}
                autoComplete="username"
                disabled={isLocked}
                className="w-full px-4 py-2.5 rounded-lg bg-slate-700 border border-slate-600
                           text-white placeholder-slate-500 focus:outline-none focus:ring-2
                           focus:ring-emerald-500 focus:border-transparent transition
                           disabled:opacity-50 disabled:cursor-not-allowed"
                placeholder="Benutzername eingeben"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">
                Passwort
              </label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                autoComplete="current-password"
                disabled={isLocked}
                className="w-full px-4 py-2.5 rounded-lg bg-slate-700 border border-slate-600
                           text-white placeholder-slate-500 focus:outline-none focus:ring-2
                           focus:ring-emerald-500 focus:border-transparent transition
                           disabled:opacity-50 disabled:cursor-not-allowed"
                placeholder="Passwort eingeben"
                required
              />
            </div>

            {error && !isLocked && (
              <div className="flex items-center gap-2 text-red-400 text-sm bg-red-400/10 rounded-lg px-4 py-2.5">
                <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                Benutzername oder Passwort falsch.
                {attempts >= 2 && !isLocked && (
                  <span className="ml-1 text-slate-500">({MAX_ATTEMPTS - attempts} Versuch{MAX_ATTEMPTS - attempts !== 1 ? 'e' : ''} übrig)</span>
                )}
              </div>
            )}

            {isLocked && (
              <div className="flex items-center gap-2 text-amber-400 text-sm bg-amber-400/10 rounded-lg px-4 py-2.5">
                <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                </svg>
                Zu viele Versuche. Bitte {secondsLeft}s warten.
              </div>
            )}

            <button
              type="submit"
              disabled={loading || isLocked}
              className="w-full py-2.5 px-4 rounded-lg bg-emerald-500 hover:bg-emerald-400
                         text-white font-semibold transition disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? 'Anmelden…' : isLocked ? `Gesperrt (${secondsLeft}s)` : 'Anmelden'}
            </button>
          </div>
        </form>

        <p className="text-center text-slate-600 text-xs mt-6">
          Internes Tool · Nicht öffentlich zugänglich
        </p>
      </div>
    </div>
  );
}
