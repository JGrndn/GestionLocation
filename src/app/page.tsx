"use client";

import { useState, useEffect, useMemo } from "react";
import { signOut } from "next-auth/react";
import { useContacts } from "@/hooks/contact.hook";
import type { ContactDTO } from "@/dto/contact.dto";
import { ContactList } from "@/components/ContactList";
import { ContactDetail } from "@/components/ContactDetail";
import { ContactModal } from "@/components/modals/ContactModal";
import { ContactInput } from "@/lib/schema";

export default function Home() {
  const { fetchAll, fetchOne, create, update, remove } = useContacts();
  const [contacts, setContacts] = useState<ContactDTO[]>([]);
  const [selected, setSelected] = useState<ContactDTO | null>(null);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [contactModal, setContactModal] = useState<{ open: boolean; contact?: ContactDTO }>({ open: false });
  // "list" | "detail" — mobile only
  const [mobileView, setMobileView] = useState<"list" | "detail">("list");

  useEffect(() => {
    fetchAll().then((data) => {
      setContacts(data);
      setLoading(false);
    });
  }, []);

  async function handleSelect(id: string) {
    const data = await fetchOne(id);
    setSelected(data);
    setMobileView("detail");
  }

  function handleBack() {
    setMobileView("list");
    setSelected(null);
  }

  async function refreshSelected() {
    if (!selected) return;
    const data = await fetchOne(selected.id);
    setSelected(data);
  }

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    if (!q) return contacts;
    return contacts.filter((c) =>
      `${c.prenom} ${c.nom} ${c.email ?? ""} ${c.telephone ?? ""}`.toLowerCase().includes(q)
    );
  }, [contacts, search]);

  async function handleSaveContact(data: ContactInput) {
    const isEdit = !!contactModal.contact;
    setContactModal({ open: false });

    if (isEdit) {
      const updated = await update(contactModal.contact!.id, data);
      setContacts((prev) => prev.map((c) => c.id === updated.id ? updated : c));
      setSelected((prev) => prev?.id === updated.id ? { ...prev, ...updated } : prev);
    } else {
      const saved = await create(data);
      const full = await fetchOne(saved.id);
      setContacts((prev) => [...prev, saved].sort((a, b) => a.nom.localeCompare(b.nom)));
      setSelected(full);
      setMobileView("detail");
    }
  }

  async function handleDeleteContact(id: string) {
    if (!confirm("Supprimer ce contact et toutes ses locations ?")) return;
    await remove(id);
    setContacts((prev) => prev.filter((c) => c.id !== id));
    if (selected?.id === id) {
      setSelected(null);
      setMobileView("list");
    }
  }

  return (
    <>
      <div className="app">
        <div className="topbar">
          <div className="logo">Loc<span>Gérer</span></div>
          <div className="topbar-actions">
            <button className="btn primary" onClick={() => setContactModal({ open: true })}>
              + Nouveau contact
            </button>
            <button className="logout-btn" onClick={() => signOut({ callbackUrl: "/login" })}>
              Déconnexion
            </button>
          </div>
        </div>

        <div className="grid">
          {/* Liste — cachée sur mobile quand on est en vue détail */}
          <div className={`panel${mobileView === "detail" ? " hidden-mobile" : ""}`}>
            <div className="panel-header">
              <span className="panel-title">Contacts</span>
              <span style={{ fontSize: 12, color: "var(--text-muted)" }}>
                {contacts.length} contact{contacts.length > 1 ? "s" : ""}
              </span>
            </div>
            <div className="search-wrap">
              <input
                type="search"
                placeholder="Rechercher..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            {loading ? (
              <div className="empty-state">Chargement...</div>
            ) : (
              <ContactList
                contacts={filtered}
                selectedId={selected?.id ?? null}
                onSelect={handleSelect}
              />
            )}
          </div>

          {/* Détail — caché sur mobile quand on est en vue liste */}
          <div id="detail-area" className={mobileView === "list" ? "hidden-mobile" : ""}>
            {selected ? (
              <>
                <button className="back-btn" onClick={handleBack}>
                  ← Retour
                </button>
                <ContactDetail
                  contact={selected}
                  onEdit={() => setContactModal({ open: true, contact: selected })}
                  onDelete={() => handleDeleteContact(selected.id)}
                  onRefresh={refreshSelected}
                />
              </>
            ) : (
              <div className="empty-state panel" style={{ padding: "3rem", textAlign: "center" }}>
                <p style={{ fontSize: 32, marginBottom: "0.5rem" }}>🏠</p>
                <p style={{ fontWeight: 500, marginBottom: 4 }}>Sélectionnez un contact</p>
                <p style={{ fontSize: 13 }}>pour voir ses informations et ses locations</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {contactModal.open && (
        <ContactModal
          contact={contactModal.contact}
          onClose={() => setContactModal({ open: false })}
          onSave={handleSaveContact}
        />
      )}
    </>
  );
}