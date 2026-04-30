"use client";

import { useState } from "react";
import { signOut } from "next-auth/react";
import { useContacts } from "@/hooks/contact.hook";
import type { ContactDTO, ContactFormDTO } from "@/dto/contact.dto";
import { ContactList } from "@/components/ContactList";
import { ContactDetail } from "@/components/ContactDetail";
import { ContactModal } from "@/components/modals/ContactModal";

export default function Home() {
  const { contacts, loading, refresh, create, update, remove } = useContacts();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [contactModal, setContactModal] = useState<{ open: boolean; contact?: ContactDTO }>({ open: false });

  const filtered = contacts.filter((c) => {
    const q = search.toLowerCase().trim();
    if (!q) return true;
    return `${c.prenom} ${c.nom} ${c.email ?? ""} ${c.telephone ?? ""}`.toLowerCase().includes(q);
  });

  const selected = contacts.find((c) => c.id === selectedId) ?? null;

  async function handleSaveContact(data: ContactFormDTO) {
    if (contactModal.contact) {
      await update(contactModal.contact.id, data);
    } else {
      const saved = await create(data);
      setSelectedId(saved.id);
    }
    setContactModal({ open: false });
    await refresh();
  }

  async function handleDeleteContact(id: string) {
    if (!confirm("Supprimer ce contact et toutes ses locations ?")) return;
    await remove(id);
    if (selectedId === id) setSelectedId(null);
    await refresh();
  }

  return (
    <>
      <div className="app">
        <div className="topbar">
          <div className="logo">Loc<span>Gérer</span></div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <button className="btn primary" onClick={() => setContactModal({ open: true })}>
              + Nouveau contact
            </button>
            <button className="logout-btn" onClick={() => signOut({ callbackUrl: "/login" })}>
              Déconnexion
            </button>
          </div>
        </div>

        <div className="grid">
          <div className="panel">
            <div className="panel-header">
              <span className="panel-title">Contacts</span>
              <span style={{ fontSize: 12, color: "var(--color-text-secondary)" }}>
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
              <ContactList contacts={filtered} selectedId={selectedId} onSelect={setSelectedId} />
            )}
          </div>

          <div id="detail-area">
            {selected ? (
              <ContactDetail
                contact={selected}
                onEdit={() => setContactModal({ open: true, contact: selected })}
                onDelete={() => handleDeleteContact(selected.id)}
                onRefresh={refresh}
              />
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