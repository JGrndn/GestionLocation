export type ApiResult<T> =
  | { ok: true; data: T }
  | { ok: false; message: string };

export async function handleResponse<T>(res: Response): Promise<ApiResult<T>> {
  if (res.ok) return { ok: true, data: await res.json() };
  const body = await res.json().catch(() => ({}));
  const fieldErrors = Object.values(body?.details?.fieldErrors ?? {}).flat()[0] as string | undefined;
  const formErrors = body?.details?.formErrors?.[0] as string | undefined;
  return { ok: false, message: fieldErrors ?? formErrors ?? body?.error ?? 'Erreur inconnue' };
}
