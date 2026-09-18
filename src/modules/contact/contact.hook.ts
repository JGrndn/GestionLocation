'use client';
import type { ContactDTO, ContactSummary } from './contact.dto';
import type { ContactInput } from './contact.schema';
import { handleResponse, type ApiResult } from '@/lib/http';

export function useContacts() {
  async function fetchAll(): Promise<ContactSummary[]> {
    const res = await fetch('/api/contacts');
    return res.json();
  }

  async function fetchOne(id: string): Promise<ContactDTO> {
    const res = await fetch(`/api/contacts/${id}`);
    return res.json();
  }

  async function create(data: ContactInput): Promise<ApiResult<ContactDTO>> {
    const res = await fetch('/api/contacts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return handleResponse<ContactDTO>(res);
  }

  async function update(id: string, data: ContactInput): Promise<ApiResult<ContactDTO>> {
    const res = await fetch(`/api/contacts/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return handleResponse<ContactDTO>(res);
  }

  async function remove(id: string): Promise<void> {
    await fetch(`/api/contacts/${id}`, { method: 'DELETE' });
  }

  return { fetchAll, fetchOne, create, update, remove };
}