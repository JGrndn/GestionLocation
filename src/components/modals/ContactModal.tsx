"use client";

import { useState } from "react";
import type { Contact, ContactFormData } from "@/lib/types";

type Props = {
  contact?: Contact;
  onClose: () => void;
  onSave: (data: ContactFormData) => Promise<void>;
};

export function ContactModal({ contact, onClose, onSave }: Props) {
  const [form, setForm] = useState<ContactFormData>({
    prenom: contact?.prenom ?? "",
    nom: contact?.nom ?? "",
    email: contact?.email ?? "",
    telephone: contact?.telephone ?? "",
    adresse: contact?.adresse ?? "",
  });
  const [loading, setLoading] = useState(false);

  const set = (k: keyof ContactFormData) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  async function handleSubmit() {
    if (!form.prenom && !form.nom) return;
    setLoading(true);
    await onSave(form);
    setLoading(false);
  }

  return (
    <div className="modal-overlay show" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-header">
          <span className="modal-title">{contact ? "Modifier le contact" : "Nouveau contact"}</span>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        <div className="modal-body">
          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">Prénom</label>
              <input value={form.prenom} onChange={set("prenom")} placeholder="Jean" />
            </div>
            <div className="form-group">
              <label className="form-label">Nom</label>
              <input value={form.nom} onChange={set("nom")} placeholder="Dupont" />
            </div>
            <div className="form-group">
              <label className="form-label">Email</label>
              <input type="email" value={form.email} onChange={set("email")} placeholder="jean@email.com" />
            </div>
            <div className="form-group">
              <label className="form-label">Téléphone</label>
              <input value={form.telephone} onChange={set("telephone")} placeholder="+33 6 00 00 00 00" />
            </div>
            <div className="form-group full">
              <label className="form-label">Adresse</label>
              <input value={form.adresse} onChange={set("adresse")} placeholder="12 rue des Lilas, 75001 Paris" />
            </div>
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn" onClick={onClose}>Annuler</button>
          <button className="btn primary" onClick={handleSubmit} disabled={loading}>
            {loading ? "Enregistrement..." : "Enregistrer"}
          </button>
        </div>
      </div>
    </div>
  );
}
