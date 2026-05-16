"use client";

import Link from "next/link";
import { useState } from "react";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [showPwd, setShowPwd] = useState(false);

  function validateEmail() {
    const ok = EMAIL_RE.test(email);
    setEmailError(ok || email === "" ? "" : "Enter a valid email address");
    return ok;
  }

  return (
    <main className="auth">
      <div className="auth-box">
        <nav className="auth-tabs">
          <Link href="/login" className="auth-tab active">Sign in</Link>
          <Link href="/register" className="auth-tab">Create account</Link>
        </nav>

        <div className="field">
          <div className="field-head">
            <span className="label">Email address</span>
          </div>
          <label className={emailError ? "input input-error" : "input"}>
            <Mail />
            <input
              type="email"
              placeholder="you@split.hr"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onBlur={validateEmail}
            />
          </label>
          {emailError && <p className="field-error">{emailError}</p>}
        </div>

        <div className="field">
          <div className="field-head">
            <span className="label">Password</span>
            <a href="#" className="label link">Forgot?</a>
          </div>
          <label className="input">
            <Lock />
            <input type={showPwd ? "text" : "password"} placeholder="••••••••" />
            <button type="button" className="icon-btn" onClick={() => setShowPwd(!showPwd)}>
              {showPwd ? <EyeOff /> : <Eye />}
            </button>
          </label>
        </div>

        <button type="button" className="btn" onClick={validateEmail}>Sign in <Arrow /></button>

        <div className="divider">or</div>

        <button type="button" className="btn-ghost"><Google /> Continue with Google</button>

        <p className="auth-alt">
          Don&apos;t have an account? <Link href="/register" className="link">Create one</Link>
        </p>

        <p className="auth-foot">Official platform of Grad Split — Road Maintenance Division</p>
      </div>
    </main>
  );
}

function Mail() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3 7 9 6 9-6" />
    </svg>
  );
}

function Lock() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="4" y="11" width="16" height="10" rx="2" />
      <path d="M8 11V8a4 4 0 0 1 8 0v3" />
    </svg>
  );
}

function Eye() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function EyeOff() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M2 12s3.5-7 10-7c2 0 3.8.6 5.3 1.5M22 12s-3.5 7-10 7c-2 0-3.8-.6-5.3-1.5" />
      <path d="m4 4 16 16" />
    </svg>
  );
}

function Arrow() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
      <path d="M5 12h14M13 5l7 7-7 7" />
    </svg>
  );
}

function Google() {
  return (
    <svg width="18" height="18" viewBox="0 0 48 48">
      <path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.2 9 3.6l6.7-6.7C35.6 2.4 30.2 0 24 0 14.6 0 6.5 5.4 2.6 13.2l7.9 6.1C12.3 13.3 17.7 9.5 24 9.5Z" />
      <path fill="#4285F4" d="M46.5 24.5c0-1.6-.1-3.2-.4-4.7H24v9h12.7c-.6 3-2.3 5.5-4.8 7.2l7.6 5.9c4.4-4.1 7-10.1 7-17.4Z" />
      <path fill="#FBBC05" d="M10.5 28.7c-.5-1.5-.8-3-.8-4.7s.3-3.2.8-4.7l-7.9-6.1C1 16.5 0 20.1 0 24s1 7.5 2.6 10.8l7.9-6.1Z" />
      <path fill="#34A853" d="M24 48c6.5 0 11.9-2.1 15.9-5.8l-7.6-5.9c-2.1 1.4-4.8 2.3-8.3 2.3-6.3 0-11.7-3.8-13.5-9.8l-7.9 6.1C6.5 42.6 14.6 48 24 48Z" />
    </svg>
  );
}
