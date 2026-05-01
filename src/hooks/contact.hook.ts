'use client';
import type { ContactDTO, ContactFormDTO } from '@/dto/contact.dto';

export function useContacts() {
  async function fetchAll(): Promise<ContactDTO[]> {
    const res = await fetch('/api/contacts');
    return res.json();
  }

  async function fetchOne(id: string): Promise<ContactDTO> {
    const res = await fetch(`/api/contacts/${id}`);
    return res.json();
  }

  async function create(data: ContactFormDTO): Promise<ContactDTO> {
    const res = await fetch('/api/contacts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json();
  }

  async function update(id: string, data: ContactFormDTO): Promise<ContactDTO> {
    const res = await fetch(`/api/contacts/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json();
  }

  async function remove(id: string): Promise<void> {
    await fetch(`/api/contacts/${id}`, { method: 'DELETE' });
  }

  return { fetchAll, fetchOne, create, update, remove };
}