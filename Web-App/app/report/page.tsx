"use client";

import { useState } from "react";

export default function ReportPage() {
  const [fileName, setFileName] = useState("");
  const [sent, setSent] = useState(false);

  const handleSubmit = () => {
    setSent(true);
    setFileName("");
    setTimeout(() => setSent(false), 3000);
  };

  return (
    <main className="upload">
      <div className="upload-inner">
        <p className="eyebrow">Prijava oštećenja ceste</p>

        <h1 className="demo-title">
          Učitaj Svoju
          <br />
          <span className="accent">Fotografiju Ceste.</span>
        </h1>

        <label className="drop">
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setFileName(e.target.files?.[0]?.name ?? "")}
          />
          <span className="drop-icon">
            <Cloud />
          </span>
          <span className="drop-title">
            {fileName || "Povuci i ispusti fotografiju ovdje"}
          </span>
          <span className="drop-sub">
            {fileName ? "Fotografija odabrana" : "ili klikni za odabir datoteke"}
          </span>
        </label>

        <button
          type="button"
          className={fileName ? "upload-submit active" : "upload-submit"}
          disabled={!fileName}
          onClick={handleSubmit}
        >
          <Cloud /> Pošalji fotografiju
        </button>
      </div>

      {sent && (
        <div className="toast">
          <Check /> Fotografija uspješno poslana
        </div>
      )}
    </main>
  );
}

function Check() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
      <path d="M4 12l6 6L20 6" />
    </svg>
  );
}

function Cloud() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M7 18a4 4 0 0 1-.5-7.97A6 6 0 0 1 18 9a4 4 0 0 1 .5 9" />
      <path d="M12 12v7M9 15l3-3 3 3" />
    </svg>
  );
}
