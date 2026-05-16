"use client";

import Link from "next/link";
import { useState } from "react";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [agreed, setAgreed] = useState(false);

  function validateEmail() {
    const ok = EMAIL_RE.test(email);
    setEmailError(ok || email === "" ? "" : "Enter a valid email address");
    return ok;
  }

  return (
    <main className="auth">
      <div className="auth-box">
        <nav className="auth-tabs">
          <Link href="/login" className="auth-tab">Sign in</Link>
          <Link href="/register" className="auth-tab active">Create account</Link>
        </nav>

        <div className="field">
          <div className="field-head">
            <span className="label">Full name</span>
          </div>
          <label className="input">
            <User />
            <input type="text" placeholder="Marija Kovačić" />
          </label>
        </div>

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
          </div>
          <label className="input">
            <Lock />
            <input type={showPwd ? "text" : "password"} placeholder="Min. 8 characters" />
            <button type="button" className="icon-btn" onClick={() => setShowPwd(!showPwd)}>
              {showPwd ? <EyeOff /> : <Eye />}
            </button>
          </label>
        </div>

        <div className="field">
          <div className="field-head">
            <span className="label">Confirm password</span>
          </div>
          <label className="input">
            <Lock />
            <input type={showConfirm ? "text" : "password"} placeholder="••••••••" />
            <button type="button" className="icon-btn" onClick={() => setShowConfirm(!showConfirm)}>
              {showConfirm ? <EyeOff /> : <Eye />}
            </button>
          </label>
        </div>

        <label className="terms">
          <input type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} />
          <span>
            I agree to the <a href="#" className="link">Terms of Service</a> and{" "}
            <a href="#" className="link">Privacy Policy</a> of the City of Split Road Health Platform.
          </span>
        </label>

        <button
          type="button"
          className="btn"
          disabled={!agreed}
          onClick={validateEmail}
        >
          Create account <Arrow />
        </button>
        {!agreed && <p className="field-error">You must accept the terms to register</p>}

        <p className="auth-alt">
          Already have an account? <Link href="/login" className="link">Sign in</Link>
        </p>

        <p className="auth-foot">Official platform of Grad Split — Road Maintenance Division</p>
      </div>
    </main>
  );
}

function User() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21c0-4.4 3.6-7 8-7s8 2.6 8 7" />
    </svg>
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
