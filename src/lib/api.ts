// src/lib/api.ts
export async function apiFetch(input: RequestInfo, init?: RequestInit) {
  // ⛔ BLOQUEO TOTAL EN SERVER / BUILD
  if (typeof window === 'undefined') {
    throw new Error('apiFetch no puede ejecutarse en server/build')
  }

  // 🔐 Token SOLO en cliente
  const token = localStorage.getItem('panaderia_token')

  // 📦 Headers
  const headers: Record<string, string> = {}

  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  // ⚠️ No forzar Content-Type si es FormData
  if (!(init?.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json'
  }

  // 🧬 Mezclar headers externos
  if (init?.headers) {
    Object.assign(headers, init.headers)
  }

  // 🚀 Fetch (solo browser)
  const res = await fetch(input, {
    ...init,
    headers,
  })

  // ❌ Errores comunes
  if (res.status === 401) {
    throw new Error('No autenticado')
  }

  if (res.status === 403) {
    throw new Error('Sin permisos')
  }

  if (!res.ok) {
    const error = await res.json().catch(() => ({}))
    throw new Error(error.error || 'Error en la petición')
  }

  // ✅ Respuesta normalizada
  const json = await res.json()
  return json.data ?? json
}
