declare module "#auth-utils" {
  export interface User {
    id: string; // Authentik `sub` ID
    email: string; // Authentik user's email address
    name: string; // User's given name
    username: string; // User's username
  }

  export interface Session {
    user: User;
    id: string; // Session ID (UUID4)
  }

  export interface SecureSessionData {
    // Add your own fields
  }
}
