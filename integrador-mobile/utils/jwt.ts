/**
 * Utilitários para validação de JWT (JSON Web Token)
 */

/**
 * Decodifica um JWT sem validar assinatura
 */
export function decodeJwt(token: string): any {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) {
      return null;
    }

    // Decodifica a parte do payload (base64)
    const payload = parts[1];
    const decoded = atob(payload);
    return JSON.parse(decoded);
  } catch (error) {
    console.error('❌ Erro ao decodificar JWT:', error);
    return null;
  }
}

/**
 * Verifica se um JWT é válido (não expirado)
 */
export function isValidJwt(token: string | null): boolean {
  if (!token) {
    return false;
  }

  try {
    const payload = decodeJwt(token);
    
    if (!payload) {
      return false;
    }

    // Verifica se o token está expirado
    if (payload.exp) {
      const now = Date.now();
      const expiration = payload.exp * 1000; // exp está em segundos
      
      if (now >= expiration) {
        console.warn('⚠️ Token JWT expirado');
        return false;
      }
    }

    return true;
  } catch (error) {
    console.error('❌ Erro ao validar JWT:', error);
    return false;
  }
}

/**
 * Extrai informações do usuário do JWT
 */
export function getUserFromJwt(token: string): any {
  const payload = decodeJwt(token);
  return payload ? {
    sub: payload.sub,
    username: payload.username,
    role: payload.role,
    exp: payload.exp,
  } : null;
}
