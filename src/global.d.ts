interface Kasware {
    requestAccounts: () => Promise<void>;
    _selectedAddress: string;
    getBalance: () => Promise<{ total: number }>;
    on: (event: string, handler: (...args: any[]) => void) => void;
    removeListener: (event: string, handler: (...args: any[]) => void) => void;
  }
  
  interface Window {
    kasware?: Kasware;
  }