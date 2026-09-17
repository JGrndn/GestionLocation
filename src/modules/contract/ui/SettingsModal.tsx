"use client";

import { useState, useRef, useEffect } from "react";

type Props = {
  onClose: () => void;
};

export function SettingsModal({ onClose }: Props) {
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    let objectUrl: string | null = null;
    fetch("/api/settings/signature")
      .then(async (res) => {
        if (!res.ok) return;
        const blob = await res.blob();
        objectUrl = URL.createObjectURL(blob);
        setPreview(objectUrl);
      })
      .catch(() => {});
    return () => {
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, []);

  async function handleUpload() {
    const file = fileRef.current?.files?.[0];
    if (!file) {
      setError("Sélectionnez une image PNG.");
      return;
    }
    setLoading(true);
    setError(null);
    setMessage(null);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/settings/signature", { method: "POST", body: fd });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        setError(body?.error ?? "Erreur lors de l'enregistrement");
        return;
      }
      setPreview(URL.createObjectURL(file));
      setMessage("Signature enregistrée.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="modal-overlay show" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-header">
          <span className="modal-title">Réglages — signature du propriétaire</span>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        <div className="modal-body">
          {error && <div className="form-error">{error}</div>}
          {message && <div style={{ color: "#1D9E75", marginBottom: 8 }}>{message}</div>}
          <p style={{ fontSize: 13, marginBottom: 12, color: "var(--text-muted)" }}>
            Image PNG de votre signature. Elle est apposée automatiquement sur les contrats
            lorsque vous uploadez un exemplaire signé par le locataire.
          </p>
          {preview && (
            <div style={{ marginBottom: 12 }}>
              <div className="form-label">Signature actuelle</div>
              <img
                src={preview}
                alt="Signature du propriétaire"
                style={{
                  maxWidth: 240,
                  maxHeight: 110,
                  background: "#fff",
                  border: "1px solid #ddd",
                  borderRadius: 4,
                  padding: 4,
                }}
              />
            </div>
          )}
          <div className="form-group full">
            <label className="form-label">Nouvelle signature (PNG)</label>
            <input ref={fileRef} type="file" accept="image/png" />
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn" onClick={onClose}>Fermer</button>
          <button className="btn primary" onClick={handleUpload} disabled={loading}>
            {loading ? "Enregistrement..." : "Enregistrer"}
          </button>
        </div>
      </div>
    </div>
  );
}
