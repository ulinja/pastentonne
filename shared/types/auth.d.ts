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

  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  export interface SecureSessionData {
    // Add your own fields
  }
}
