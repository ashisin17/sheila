import React, { useState } from 'react';
import { ShieldCheck, CheckCircle2, LogOut, Calendar, Cloud, Lock, Sparkles, ExternalLink } from 'lucide-react';

export interface GoogleAccountState {
  isConnected: boolean;
  email?: string;
  name?: string;
  picture?: string;
  syncCalendar: boolean;
  cloudBackup: boolean;
  connectedAt?: string;
}

interface GoogleAccountCardProps {
  account: GoogleAccountState;
  onConnect: () => void;
  onDisconnect: () => void;
  onToggleCalendarSync: (enabled: boolean) => void;
  onToggleCloudBackup: (enabled: boolean) => void;
}

export const GoogleAccountCard: React.FC<GoogleAccountCardProps> = ({
  account,
  onConnect,
  onDisconnect,
  onToggleCalendarSync,
  onToggleCloudBackup,
}) => {
  const [isConnecting, setIsConnecting] = useState(false);

  const handleConnectClick = () => {
    setIsConnecting(true);
    setTimeout(() => {
      onConnect();
      setIsConnecting(false);
    }, 700);
  };

  return (
    <div className="bg-white rounded-3xl p-4 shadow-sm border border-purple-100 space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {/* Official Google G Logo */}
          <div className="w-7 h-7 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-center p-1.5 shadow-2xs">
            <svg viewBox="0 0 24 24" className="w-full h-full">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
          </div>
          <div>
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">
              ACCOUNT & CLOUD SYNC
            </span>
            <h4 className="font-extrabold text-sm text-slate-900 leading-tight">
              Google Account
            </h4>
          </div>
        </div>

        {account.isConnected ? (
          <span className="inline-flex items-center gap-1 text-[10px] font-black px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            <span>Connected</span>
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
            Not Connected
          </span>
        )}
      </div>

      {account.isConnected ? (
        /* CONNECTED STATE */
        <div className="space-y-3 pt-1">
          {/* User profile row */}
          <div className="flex items-center justify-between p-2.5 rounded-2xl bg-purple-50/70 border border-purple-100">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-[#B6A1DA] flex items-center justify-center font-bold text-slate-900 text-xs">
                M
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900 leading-tight">
                  {account.name || 'Maya Lin'}
                </p>
                <p className="text-[11px] text-slate-600 font-medium leading-tight">
                  {account.email || 'maya.health@gmail.com'}
                </p>
              </div>
            </div>

            <button
              onClick={onDisconnect}
              className="text-[11px] font-bold text-slate-500 hover:text-rose-600 px-2 py-1 rounded-lg hover:bg-white transition flex items-center gap-1"
              title="Disconnect Google Account"
            >
              <LogOut className="w-3 h-3" />
              <span>Disconnect</span>
            </button>
          </div>

          {/* Sync Preferences Toggles */}
          <div className="space-y-2 pt-1 text-xs">
            <label className="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-100 cursor-pointer hover:bg-slate-100/70 transition">
              <div className="flex items-center gap-2">
                <Calendar className="w-3.5 h-3.5 text-purple-700 shrink-0" />
                <div>
                  <span className="font-bold text-slate-900 block leading-tight">
                    Sync Appointments to Google Calendar
                  </span>
                  <span className="text-[10px] text-slate-500 block leading-tight">
                    Directly export confirmed doctor visits & reminders
                  </span>
                </div>
              </div>
              <input
                type="checkbox"
                checked={account.syncCalendar}
                onChange={(e) => onToggleCalendarSync(e.target.checked)}
                className="w-4 h-4 rounded text-purple-700 focus:ring-purple-400 accent-purple-700 cursor-pointer"
              />
            </label>

            <label className="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-100 cursor-pointer hover:bg-slate-100/70 transition">
              <div className="flex items-center gap-2">
                <Cloud className="w-3.5 h-3.5 text-purple-700 shrink-0" />
                <div>
                  <span className="font-bold text-slate-900 block leading-tight">
                    Secure Care Timeline Backup
                  </span>
                  <span className="text-[10px] text-slate-500 block leading-tight">
                    Preserves marked flares and SOAP memos securely
                  </span>
                </div>
              </div>
              <input
                type="checkbox"
                checked={account.cloudBackup}
                onChange={(e) => onToggleCloudBackup(e.target.checked)}
                className="w-4 h-4 rounded text-purple-700 focus:ring-purple-400 accent-purple-700 cursor-pointer"
              />
            </label>
          </div>
        </div>
      ) : (
        /* DISCONNECTED / PROMPT STATE */
        <div className="space-y-3 pt-1">
          <p className="text-xs text-slate-600 leading-relaxed">
            Connect your Google Account to safely sync care appointments, backup flare logs, and share clinical memos with providers.
          </p>

          {/* Official Google Sign-In Styled Button */}
          <button
            onClick={handleConnectClick}
            disabled={isConnecting}
            className="w-full bg-white hover:bg-slate-50 text-slate-800 font-bold py-2.5 px-4 rounded-full border border-slate-300/90 shadow-xs transition text-xs flex items-center justify-center gap-2.5 active:scale-98"
          >
            <svg viewBox="0 0 24 24" className="w-4 h-4">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>{isConnecting ? 'Connecting...' : 'Sign in with Google'}</span>
          </button>

          {/* Privacy & Key Security Reassurance */}
          <div className="flex items-center gap-1.5 text-[10.5px] text-slate-500 pt-0.5 px-1">
            <Lock className="w-3 h-3 text-emerald-600 shrink-0" />
            <span>Zero API keys or secrets exposed · Token-isolated security</span>
          </div>
        </div>
      )}
    </div>
  );
};
