export type ApiResult<T> =
  | { ok: true; data: T }
  | { ok: false; message: string };

/**
 * Construit une valeur `Content-Disposition` sûre pour un nom de fichier.
 *
 * Les valeurs d'en-tête HTTP doivent tenir dans l'ISO-8859-1 : un caractère
 * comme « ç » fait lever `TypeError: Invalid character in header content` à
 * undici (donc un 500). On suit la RFC 6266 : un `filename=` ASCII de repli
 * (caractères hors-ASCII remplacés par `_`) plus un `filename*=UTF-8''…`
 * percent-encodé que les navigateurs modernes préfèrent.
 */
export function contentDisposition(filename: string, disposition: 'attachment' | 'inline' = 'attachment'): string {
  const ascii = filename.replace(/[^\x20-\x7e]/g, '_').replace(/["\\]/g, '_');
  const encoded = encodeURIComponent(filename);
  return `${disposition}; filename="${ascii}"; filename*=UTF-8''${encoded}`;
}

export async function handleResponse<T>(res: Response): Promise<ApiResult<T>> {
  if (res.ok) return { ok: true, data: await res.json() };
  const body = await res.json().catch(() => ({}));
  const fieldErrors = Object.values(body?.details?.fieldErrors ?? {}).flat()[0] as string | undefined;
  const formErrors = body?.details?.formErrors?.[0] as string | undefined;
  return { ok: false, message: fieldErrors ?? formErrors ?? body?.error ?? 'Erreur inconnue' };
}
