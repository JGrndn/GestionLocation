"use client";

import { useState, useEffect, useMemo } from "react";
import { signOut } from "next-auth/react";
import type { Contact, ContactFormData } from "@/lib/types";
import { ContactList } from "@/components/ContactList";
import { ContactDetail } from "@/components/ContactDetail";
import { ContactModal } from "@/components/modals/ContactModal";

export default function Home() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [contactModal, setContactModal] = useState<{ open: boolean; contact?: Contact }>({ open: false });
  const [loading, setLoading] = useState(true);

  async function fetchContacts() {
    const res = await fetch("/api/contacts");
    const data = await res.json();
    setContacts(data);
    setLoading(false);
  }

  useEffect(() => { fetchContacts(); }, []);

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    if (!q) return contacts;
    return contacts.filter((c) =>
      `${c.prenom} ${c.nom} ${c.email ?? ""} ${c.telephone ?? ""}`.toLowerCase().includes(q)
    );
  }, [contacts, search]);

  const selected = contacts.find((c) => c.id === selectedId) ?? null;

  async function handleSaveContact(data: ContactFormData) {
    const isEdit = !!contactModal.contact;
    const url = isEdit ? `/api/contacts/${contactModal.contact!.id}` : "/api/contacts";
    const res = await fetch(url, {
      method: isEdit ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const saved = await res.json();
    setContactModal({ open: false });
    await fetchContacts();
    if (!isEdit) setSelectedId(saved.id);
  }

  async function handleDeleteContact(id: string) {
    if (!confirm("Supprimer ce contact et toutes ses locations ?")) return;
    await fetch(`/api/contacts/${id}`, { method: "DELETE" });
    if (selectedId === id) setSelectedId(null);
    await fetchContacts();
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
          {/* Panneau gauche */}
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
              <ContactList
                contacts={filtered}
                selectedId={selectedId}
                onSelect={setSelectedId}
              />
            )}
          </div>

          {/* Panneau droit */}
          <div id="detail-area">
            {selected ? (
              <ContactDetail
                contact={selected}
                onEdit={() => setContactModal({ open: true, contact: selected })}
                onDelete={() => handleDeleteContact(selected.id)}
                onRefresh={fetchContacts}
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
