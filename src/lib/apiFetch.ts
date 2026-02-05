// src/lib/apiFetch.ts
export async function apiFetch(
  input: RequestInfo,
  init: RequestInit = {}
): Promise<Response> {
  const response = await fetch(input, {
    ...init,
    credentials: 'include', // 🔥 cookies
  })

  // ✅ todo bien
  if (response.status !== 401) {
    return response
  }

  // 🔄 intentar refresh
  const refresh = await fetch('/api/auth/refresh', {
    method: 'POST',
    credentials: 'include',
  })

  // ❌ sesión muerta
  if (!refresh.ok) {
    if (typeof window !== 'undefined') {
      window.location.href = '/login'
    }
    throw new Error('Sesión expirada')
  }

  // 🔁 repetir request original
  return fetch(input, {
    ...init,
    credentials: 'include',
  })
}
