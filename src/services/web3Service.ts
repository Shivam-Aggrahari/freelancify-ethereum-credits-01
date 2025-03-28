
// This is a simplified Web3 service for the prototype
// In a real application, you would handle more connection scenarios and error cases

export class Web3Service {
  private ethereum: any;
  
  constructor() {
    // Reference to the MetaMask provider
    this.ethereum = (window as any).ethereum;
  }
  
  // Check if MetaMask is installed
  isMetaMaskInstalled(): boolean {
    return typeof this.ethereum !== 'undefined';
  }
  
  // Check if already connected
  async isConnected(): Promise<boolean> {
    if (!this.isMetaMaskInstalled()) {
      return false;
    }
    
    try {
      const accounts = await this.ethereum.request({ method: 'eth_accounts' });
      return accounts.length > 0;
    } catch (error) {
      console.error("Error checking connection status:", error);
      return false;
    }
  }
  
  // Connect to MetaMask
  async connect(): Promise<string[]> {
    if (!this.isMetaMaskInstalled()) {
      throw new Error("MetaMask is not installed");
    }
    
    try {
      const accounts = await this.ethereum.request({ method: 'eth_requestAccounts' });
      return accounts;
    } catch (error) {
      console.error("Error connecting to MetaMask:", error);
      throw error;
    }
  }
  
  // Get current address
  async getAddress(): Promise<string> {
    if (!this.isMetaMaskInstalled()) {
      throw new Error("MetaMask is not installed");
    }
    
    try {
      const accounts = await this.ethereum.request({ method: 'eth_accounts' });
      if (accounts.length === 0) {
        throw new Error("No accounts found");
      }
      return accounts[0];
    } catch (error) {
      console.error("Error getting address:", error);
      throw error;
    }
  }
  
  // Get network ID
  async getNetworkId(): Promise<string> {
    if (!this.isMetaMaskInstalled()) {
      throw new Error("MetaMask is not installed");
    }
    
    try {
      const chainId = await this.ethereum.request({ method: 'eth_chainId' });
      return chainId;
    } catch (error) {
      console.error("Error getting network ID:", error);
      throw error;
    }
  }
  
  // Get ETH balance
  async getBalance(address: string): Promise<string> {
    if (!this.isMetaMaskInstalled()) {
      throw new Error("MetaMask is not installed");
    }
    
    try {
      const balance = await this.ethereum.request({
        method: 'eth_getBalance',
        params: [address, 'latest']
      });
      
      // Convert from wei to ETH (1 ETH = 10^18 wei)
      const ethBalance = parseInt(balance, 16) / Math.pow(10, 18);
      return ethBalance.toFixed(4);
    } catch (error) {
      console.error("Error getting balance:", error);
      throw error;
    }
  }
}
