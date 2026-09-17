"use client";

import { useState, useRef } from "react";
import { calcLocation, LocationModal } from "@/modules/location/ui";
import { fmtDate, money } from "@/lib/format";
import { ActionMenu } from "./ActionMenu";
import { ContactDTO } from "@/dto/contact.dto";
import type { LocationDTO, LocationInput } from "@/modules/location/ui";
import { handleResponse } from "@/lib/http";

type Props = {
  contact: ContactDTO;
  onEdit: () => void;
  onDelete: () => void;
  onRefresh: () => void;
};

function initials(p: string, n: string) {
  return (p[0] ?? "").toUpperCase() + (n[0] ?? "").toUpperCase();
}

export function ContactDetail({ contact, onEdit, onDelete, onRefresh }: Props) {
  const [locationModal, setLocationModal] = useState<{ open: boolean; location?: LocationDTO }>({ open: false });
  const [pdfLoading, setPdfLoading] = useState<string | null>(null);
  const [docLoading, setDocLoading] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const uploadTargetRef = useRef<string | null>(null);

  async function handleSaveLocation(data: LocationInput, locId?: string): Promise<string | null> {
    const url = locId
      ? `/api/contacts/${contact.id}/locations/${locId}`
      : `/api/contacts/${contact.id}/locations`;
    const res = await fetch(url, {
      method: locId ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const result = await handleResponse(res);
    if (!result.ok) return result.message;
    setLocationModal({ open: false });
    onRefresh();
    return null;
  }

  async function handleDeleteLocation(locId: string) {
    if (!confirm("Supprimer cette location ?")) return;
    await fetch(`/api/contacts/${contact.id}/locations/${locId}`, { method: "DELETE" });
    onRefresh();
  }

  async function handleDownloadPDF(loc: LocationDTO, lang: "fr" | "en" = "fr") {
    const key = loc.id + "_" + lang;
    setPdfLoading(key);
    try {
      const res = await fetch(`/api/contacts/${contact.id}/locations/${loc.id}/pdf?lang=${lang}`);
      if (!res.ok) throw new Error("Erreur génération PDF");
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      window.open(url, "_blank");
      setTimeout(() => URL.revokeObjectURL(url), 10000);
    } finally {
      setPdfLoading(null);
    }
  }

  function triggerUpload(locId: string) {
    uploadTargetRef.current = locId;
    fileInputRef.current?.click();
  }

  async function handleUploadSigned(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    const locId = uploadTargetRef.current;
    e.target.value = ""; // permet de re-sélectionner le même fichier ensuite
    if (!file || !locId) return;
    setDocLoading(locId);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch(`/api/contacts/${contact.id}/locations/${locId}/documents`, {
        method: "POST",
        body: fd,
      });
      const result = await handleResponse(res);
      if (!result.ok) {
        alert(result.message);
        return;
      }
      onRefresh();
    } finally {
      setDocLoading(null);
      uploadTargetRef.current = null;
    }
  }

  async function handleDownloadDoc(locId: string, kind: "tenant-signed" | "countersigned") {
    const res = await fetch(`/api/contacts/${contact.id}/locations/${locId}/documents/${kind}`);
    if (!res.ok) return;
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    window.open(url, "_blank");
    setTimeout(() => URL.revokeObjectURL(url), 10000);
  }

  async function handleDeleteDocs(locId: string) {
    if (!confirm("Supprimer les PDF signés de cette location ?")) return;
    await fetch(`/api/contacts/${contact.id}/locations/${locId}/documents`, { method: "DELETE" });
    onRefresh();
  }

  return (
    <div className="detail-panel">
      <input
        ref={fileInputRef}
        type="file"
        accept="application/pdf"
        style={{ display: "none" }}
        onChange={handleUploadSigned}
      />
      <div className="contact-card">
        <div className="contact-card-header">
          <div className="avatar-lg">{initials(contact.prenom, contact.nom)}</div>
          <div className="contact-meta">
            <strong style={{ fontSize: 16 }}>{contact.prenom} {contact.nom}</strong>
            <p>{contact.email ?? "—"}</p>
          </div>
          <div style={{ marginLeft: "auto", display: "flex", gap: 6 }}>
            <button className="btn sm" onClick={onEdit}>Modifier</button>
            <button className="btn sm danger" onClick={onDelete}>Supprimer</button>
          </div>
        </div>
        <div className="contact-fields">
          <div className="field-row">
            <div className="label">Téléphone</div>
            {contact.telephone ?? "—"}
          </div>
          <div className="field-row">
            <div className="label">Adresse</div>
            {contact.adresse ?? "—"}
          </div>
        </div>
      </div>

      <div className="locations-section panel">
        <div className="panel-header">
          <span className="panel-title">Locations ({contact.locations.length})</span>
          <button className="btn sm primary" onClick={() => setLocationModal({ open: true })}>
            + Ajouter
          </button>
        </div>

        {contact.locations.length === 0 ? (
          <div className="empty-state">Aucune location enregistrée.</div>
        ) : (
          contact.locations.map((loc) => {
            const { n, taxeTotale, frais, prixTotal, solde } = calcLocation(loc);
            return (
              <div className="location-card" key={loc.id}>
                <div className="location-header">
                  <div className="location-dates">
                    {fmtDate(loc.dateArrivee)} → {fmtDate(loc.depart)}
                    <span> {n} nuit{n > 1 ? "s" : ""}</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
                    <span className="badge">{money(prixTotal)}</span>
                    <ActionMenu
                      ariaLabel="Actions de la location"
                      items={[
                        { label: "Modifier", onClick: () => setLocationModal({ open: true, location: loc }) },
                        { label: "Supprimer la location", danger: true, onClick: () => handleDeleteLocation(loc.id) },
                      ]}
                    />
                  </div>
                </div>

                <div className="location-grid">
                  <div className="stat">
                    <div className="label">Adultes / Enfants / Animaux</div>
                    <div className="value">{loc.adultes} / {loc.enfants} / {loc.animaux}</div>
                  </div>
                  <div className="stat">
                    <div className="label">Prix séjour HF</div>
                    <div className="value">{money(Number(loc.prixBase))}</div>
                  </div>
                  <div className="stat">
                    <div className="label">Taxe séjour totale</div>
                    <div className="value">{money(taxeTotale)}</div>
                  </div>
                  <div className="stat">
                    <div className="label">Frais</div>
                    <div className="value">{money(frais)}</div>
                  </div>
                  <div className="stat">
                    <div className="label">Acompte</div>
                    <div className="value">{money(Number(loc.acompte))}</div>
                  </div>
                  <div className="stat">
                    <div className="label">Caution</div>
                    <div className="value">{money(Number(loc.caution))}</div>
                  </div>
                </div>

                <div style={{ display: "flex", gap: 8 }}>
                  <div className="stat" style={{ flex: 1 }}>
                    <div className="label">Prix total</div>
                    <div className="value total">{money(prixTotal)}</div>
                  </div>
                  <div className="stat" style={{ flex: 1 }}>
                    <div className="label">Solde à payer</div>
                    <div className="value total">{money(solde)}</div>
                  </div>
                </div>

                <div className="contract-block">
                  <div className="contract-label">Contrat</div>
                  {!loc.hasTenantSigned && (
                    <div className="contract-row">
                      <button
                        className="btn sm pdf"
                        onClick={() => handleDownloadPDF(loc, "fr")}
                        disabled={pdfLoading === loc.id + "_fr"}
                      >
                        {pdfLoading === loc.id + "_fr" ? "Génération..." : "📄 PDF FR"}
                      </button>
                      {loc.langue === "en" && (
                        <button
                          className="btn sm pdf"
                          onClick={() => handleDownloadPDF(loc, "en")}
                          disabled={pdfLoading === loc.id + "_en"}
                        >
                          {pdfLoading === loc.id + "_en" ? "Génération..." : "📄 PDF EN"}
                        </button>
                      )}
                    </div>
                  )}
                  <div className="contract-row">
                    {!loc.hasTenantSigned ? (
                      <button
                        className="btn sm"
                        onClick={() => triggerUpload(loc.id)}
                        disabled={docLoading === loc.id}
                      >
                        {docLoading === loc.id ? "Traitement..." : "⬆️ Uploader le contrat signé"}
                      </button>
                    ) : (
                      <>
                        {loc.hasCountersigned && (
                          <button className="btn sm pdf" onClick={() => handleDownloadDoc(loc.id, "countersigned")}>
                            📄 Contrat signé
                          </button>
                        )}
                        <button className="btn sm" onClick={() => handleDownloadDoc(loc.id, "tenant-signed")}>
                          Signé locataire
                        </button>
                        <button
                          className="btn sm danger"
                          title="Supprimer les PDF signés"
                          onClick={() => handleDeleteDocs(loc.id)}
                        >
                          🗑 Supprimer PDF
                        </button>
                      </>
                    )}
                  </div>
                  {loc.hasTenantSigned && !loc.hasCountersigned && (
                    <div className="contract-note">
                      Contre-signature manquante. Ajoutez votre signature dans « ⚙️ Réglages »,
                      puis supprimez et ré-uploadez le contrat signé.
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {locationModal.open && (
        <LocationModal
          location={locationModal.location}
          contactName={`${contact.prenom} ${contact.nom}`}
          onClose={() => setLocationModal({ open: false })}
          onSave={(data) => handleSaveLocation(data, locationModal.location?.id)}
        />
      )}
    </div>
  );
}