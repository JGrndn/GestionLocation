"use client";

import { useState, useEffect } from "react";
import type { Location, LocationFormData } from "@/lib/types";
import { calcLocation } from "@/lib/types";

type Props = {
  location?: Location;
  contactName: string;
  onClose: () => void;
  onSave: (data: LocationFormData) => Promise<void>;
};

const empty: LocationFormData = {
  dateArrivee: "",
  depart: "",
  adultes: "1",
  enfants: "0",
  animaux: "0",
  prixBase: "",
  taxeParNuit: "",
  frais: "",
  acompte: "",
  caution: "",
};

export function LocationModal({ location, contactName, onClose, onSave }: Props) {
  const [form, setForm] = useState<LocationFormData>(
    location
      ? {
          dateArrivee: location.dateArrivee.slice(0, 10),
          depart: location.depart.slice(0, 10),
          adultes: String(location.adultes),
          enfants: String(location.enfants),
          animaux: String(location.animaux),
          prixBase: String(location.prixBase),
          taxeParNuit: String(location.taxeParNuit),
          frais: String(location.frais),
          acompte: String(location.acompte),
          caution: String(location.caution),
        }
      : empty
  );
  const [loading, setLoading] = useState(false);

  const set = (k: keyof LocationFormData) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  // Calculs dérivés
  const computed = (() => {
    if (!form.dateArrivee || !form.depart) return null;
    return calcLocation({
      dateArrivee: form.dateArrivee,
      depart: form.depart,
      adultes: parseInt(form.adultes) || 0,
      prixBase: parseFloat(form.prixBase) || 0,
      taxeParNuit: parseFloat(form.taxeParNuit) || 0,
      frais: parseFloat(form.frais) || 0,
      acompte: parseFloat(form.acompte) || 0,
    });
  })();

  async function handleSubmit() {
    if (!form.dateArrivee || !form.depart) return;
    setLoading(true);
    await onSave(form);
    setLoading(false);
  }

  return (
    <div className="modal-overlay show" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-header">
          <span className="modal-title">
            {location ? "Modifier" : "Nouvelle"} location — {contactName}
          </span>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        <div className="modal-body">
          <div className="form-grid">
            <div className="section-label">Séjour</div>
            <div className="form-group">
              <label className="form-label">Date d'arrivée</label>
              <input type="date" value={form.dateArrivee} onChange={set("dateArrivee")} />
            </div>
            <div className="form-group">
              <label className="form-label">Date de départ</label>
              <input type="date" value={form.depart} onChange={set("depart")} />
            </div>
            <div className="form-group">
              <label className="form-label">Nuitées (calculé)</label>
              <input readOnly value={computed?.n ?? 0} />
            </div>
            <div className="form-group">
              <label className="form-label">Adultes</label>
              <input type="number" min="0" value={form.adultes} onChange={set("adultes")} />
            </div>
            <div className="form-group">
              <label className="form-label">Enfants</label>
              <input type="number" min="0" value={form.enfants} onChange={set("enfants")} />
            </div>
            <div className="form-group">
              <label className="form-label">Animaux</label>
              <input type="number" min="0" value={form.animaux} onChange={set("animaux")} />
            </div>

            <hr className="sep" />
            <div className="section-label">Tarification</div>

            <div className="form-group">
              <label className="form-label">Prix séjour HF (€)</label>
              <input type="number" min="0" step="0.01" value={form.prixBase} onChange={set("prixBase")} placeholder="0.00" />
            </div>
            <div className="form-group">
              <label className="form-label">Taxe / adulte / nuit (€)</label>
              <input type="number" min="0" step="0.01" value={form.taxeParNuit} onChange={set("taxeParNuit")} placeholder="0.00" />
            </div>
            <div className="form-group">
              <label className="form-label">Taxe séjour totale (€, calculé)</label>
              <input readOnly value={computed ? computed.taxeTotale.toFixed(2) : "0.00"} />
            </div>
            <div className="form-group">
              <label className="form-label">Frais (€)</label>
              <input type="number" min="0" step="0.01" value={form.frais} onChange={set("frais")} placeholder="0.00" />
            </div>
            <div className="form-group">
              <label className="form-label">Acompte (€)</label>
              <input type="number" min="0" step="0.01" value={form.acompte} onChange={set("acompte")} placeholder="0.00" />
            </div>
            <div className="form-group">
              <label className="form-label">Caution (€)</label>
              <input type="number" min="0" step="0.01" value={form.caution} onChange={set("caution")} placeholder="0.00" />
            </div>

            <hr className="sep" />
            <div className="section-label">Récapitulatif</div>

            <div className="form-group">
              <label className="form-label">Prix total (€)</label>
              <input readOnly value={computed ? computed.prixTotal.toFixed(2) : "0.00"} className="text-green" />
            </div>
            <div className="form-group">
              <label className="form-label">Solde à payer (€)</label>
              <input readOnly value={computed ? computed.solde.toFixed(2) : "0.00"} className="text-green" />
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
