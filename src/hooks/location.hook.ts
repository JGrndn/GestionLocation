'use client';
import type { LocationDTO } from '@/dto/location.dto';
import type { LocationInput } from '@/lib/schema';
import { handleResponse, type ApiResult } from './contact.hook';

export function useLocations(contactId: string) {
  async function create(data: LocationInput): Promise<ApiResult<LocationDTO>> {
    const res = await fetch(`/api/contacts/${contactId}/locations`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return handleResponse<LocationDTO>(res);
  }

  async function update(locId: string, data: LocationInput): Promise<ApiResult<LocationDTO>> {
    const res = await fetch(`/api/contacts/${contactId}/locations/${locId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return handleResponse<LocationDTO>(res);
  }

  async function remove(locId: string): Promise<void> {
    await fetch(`/api/contacts/${contactId}/locations/${locId}`, { method: 'DELETE' });
  }

  async function downloadPdf(locId: string, filename: string): Promise<void> {
    const res = await fetch(`/api/contacts/${contactId}/locations/${locId}/pdf`);
    if (!res.ok) throw new Error('Erreur génération PDF');
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  }

  return { create, update, remove, downloadPdf };
}