"use client";

import { ContactDTO } from "@/dto/contact.dto";


type Props = {
  contacts: ContactDTO[];
  selectedId: string | null;
  onSelect: (id: string) => void;
};

function initials(prenom: string, nom: string) {
  return (prenom[0] ?? "").toUpperCase() + (nom[0] ?? "").toUpperCase();
}

function highlight(str: string, q: string) {
  if (!q) return str;
  const i = str.toLowerCase().indexOf(q.toLowerCase());
  if (i < 0) return str;
  return (
    str.slice(0, i) +
    `<mark class="hl">${str.slice(i, i + q.length)}</mark>` +
    str.slice(i + q.length)
  );
}

export function ContactList({ contacts, selectedId, onSelect }: Props) {
  return (
    <div className="contact-list">
      {contacts.length === 0 ? (
        <div className="empty-state">Aucun résultat.</div>
      ) : (
        contacts.map((c) => (
          <div
            key={c.id}
            className={`contact-item${c.id === selectedId ? " active" : ""}`}
            onClick={() => onSelect(c.id)}
          >
            <div className="avatar">{initials(c.prenom, c.nom)}</div>
            <div className="contact-info">
              <div
                className="name"
                dangerouslySetInnerHTML={{
                  __html: highlight(`${c.prenom} ${c.nom}`, ""),
                }}
              />
              <div className="email">{c.email ?? "—"}</div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
