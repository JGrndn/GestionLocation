'use client';
import { useState, useEffect, useMemo } from 'react';
import type { ContactDTO, ContactFormDTO } from '@/dto/contact.dto';

export function useContacts() {
  const [contacts, setContacts] = useState<ContactDTO[]>([]);
  const [loading, setLoading] = useState(true);

  async function refresh() {
    const res = await fetch('/api/contacts');
    setContacts(await res.json());
    setLoading(false);
  }

  useEffect(() => { refresh(); }, []);

  async function create(data: ContactFormDTO) {
    const res = await fetch('/api/contacts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json() as Promise<ContactDTO>;
  }

  async function update(id: string, data: ContactFormDTO) {
    const res = await fetch(`/api/contacts/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json() as Promise<ContactDTO>;
  }

  async function remove(id: string) {
    await fetch(`/api/contacts/${id}`, { method: 'DELETE' });
  }

  return { contacts, loading, refresh, create, update, remove };
}