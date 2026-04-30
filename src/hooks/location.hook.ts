'use client';
import type { LocationFormDTO } from '@/dto/location.dto';

export function useLocations(contactId: string) {
  async function create(data: LocationFormDTO) {
    await fetch(`/api/contacts/${contactId}/locations`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
  }

  async function update(locId: string, data: LocationFormDTO) {
    await fetch(`/api/contacts/${contactId}/locations/${locId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
  }

  async function remove(locId: string) {
    await fetch(`/api/contacts/${contactId}/locations/${locId}`, { method: 'DELETE' });
  }

  async function downloadPdf(locId: string, filename: string) {
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