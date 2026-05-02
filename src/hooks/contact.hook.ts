'use client';
import type { ContactDTO } from '@/dto/contact.dto';
import type { ContactInput } from '@/lib/schema';

export function useContacts() {
  async function fetchAll(): Promise<ContactDTO[]> {
    const res = await fetch('/api/contacts');
    return res.json();
  }

  async function fetchOne(id: string): Promise<ContactDTO> {
    const res = await fetch(`/api/contacts/${id}`);
    return res.json();
  }

  async function create(data: ContactInput): Promise<ContactDTO> {
    const res = await fetch('/api/contacts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json();
  }

  async function update(id: string, data: ContactInput): Promise<ContactDTO> {
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