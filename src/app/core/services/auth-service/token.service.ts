import { Injectable } from '@angular/core';
import {jwtDecode} from 'jwt-decode';

@Injectable({ providedIn: 'root' })
export class TokenService {

  private readonly TOKEN_KEY = 'token';

  /** Guardar token en localStorage */
  setToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  /** Obtener token desde localStorage */
  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  /** Eliminar token (logout) */
  removeToken(): void {
    localStorage.removeItem(this.TOKEN_KEY);
  }

  /** Decodificar token */
  private decodeToken(): any | null {
    const token = this.getToken();
    if (!token) return null;
    try {
      return  jwtDecode(token);
    } catch (e) {
      console.error('Error decoding token', e);
      return null;
    }
  }

  /** Obtener roles desde el token */
  getRoles(): string[] {
    const decoded = this.decodeToken();
    return decoded?.roles || [];
  }

  /** Validar si hay token */
  isLogged(): boolean {
    return !!this.getToken();
  }

  /** Validar expiración del JWT */
  isTokenExpired(): boolean {
    const decoded = this.decodeToken();
    if (!decoded || !decoded.exp) return true;

    const now = Math.floor(Date.now() / 1000);
    return decoded.exp < now;
  }
}
