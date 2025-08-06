declare module "#auth-utils" {
  export interface User {
    id: string;
    email: string;
    name: string;
    username: string;
  }

  export interface Session {
    user: User;
    id: string; // Session ID (UUID4)
  }

  export interface SecureSessionData {
    // Add your own fields
  }
}
