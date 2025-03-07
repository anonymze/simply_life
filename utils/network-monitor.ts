import { Platform } from 'react-native';


// Interface for request data
export interface RequestData {
  url: string;
  method: string;
  headers: Record<string, string>;
  body?: any;
  timestamp: number;
}

// Interface for response data
export interface ResponseData {
  status: number;
  statusText: string;
  headers: Record<string, string>;
  body?: any;
  timestamp: number;
  duration: number;
}

// Interface for a complete network request
export interface NetworkRequest {
  id: string;
  request: RequestData;
  response?: ResponseData;
  error?: Error;
}

// Network monitor class
export class NetworkMonitor {
  private static instance: NetworkMonitor;
  private requests: NetworkRequest[] = [];
  private isMonitoring = false;
  private originalFetch: typeof fetch;
  private originalXHROpen: any;
  private originalXHRSend: any;
  private listeners: ((requests: NetworkRequest[]) => void)[] = [];

  private constructor() {
    this.originalFetch = global.fetch;
    if (typeof XMLHttpRequest !== 'undefined') {
      this.originalXHROpen = XMLHttpRequest.prototype.open;
      this.originalXHRSend = XMLHttpRequest.prototype.send;
    }
  }

  // Get singleton instance
  public static getInstance(): NetworkMonitor {
    if (!NetworkMonitor.instance) {
      NetworkMonitor.instance = new NetworkMonitor();
    }
    return NetworkMonitor.instance;
  }

  // Start monitoring network requests
  public startMonitoring(): void {
    if (this.isMonitoring) return;
    
    this.isMonitoring = true;
    this.monkeyPatchFetch();
    this.monkeyPatchXHR();
    
    console.log('Network monitoring started');
  }

  // Stop monitoring network requests
  public stopMonitoring(): void {
    if (!this.isMonitoring) return;
    
    global.fetch = this.originalFetch;
    
    if (typeof XMLHttpRequest !== 'undefined') {
      XMLHttpRequest.prototype.open = this.originalXHROpen;
      XMLHttpRequest.prototype.send = this.originalXHRSend;
    }
    
    this.isMonitoring = false;
    console.log('Network monitoring stopped');
  }

  // Get all captured requests
  public getRequests(): NetworkRequest[] {
    return [...this.requests];
  }

  // Clear all captured requests
  public clearRequests(): void {
    this.requests = [];
    this.notifyListeners();
  }

  // Add a listener for request updates
  public addListener(listener: (requests: NetworkRequest[]) => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  // Notify all listeners of updates
  private notifyListeners(): void {
    const requests = this.getRequests();
    this.listeners.forEach(listener => listener(requests));
  }

  // Monkey patch the fetch API
  private monkeyPatchFetch(): void {
    global.fetch = async (input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
      const url = typeof input === 'string' ? input : input instanceof URL ? input.toString() : input.url;
      const method = init?.method || (typeof input === 'string' || input instanceof URL ? 'GET' : input.method);
      
      // Generate a unique ID for this request
      const id = `fetch-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      
      // Capture request data
      const requestData: RequestData = {
        url,
        method: method || 'GET',
        headers: init?.headers ? this.headersToObject(init.headers) : {},
        body: init?.body,
        timestamp: Date.now(),
      };
      
      // Create network request object
      const networkRequest: NetworkRequest = {
        id,
        request: requestData,
      };
      
      // Add to requests array
      this.requests.push(networkRequest);
      this.notifyListeners();
      
      // Log request
      console.log(`[NetworkMonitor] Request: ${method} ${url}`);
      console.log('[NetworkMonitor] Request Headers:', requestData.headers);
      if (requestData.body) {
        console.log('[NetworkMonitor] Request Body:', requestData.body);
      }
      
      try {
        // Make the actual request
        const startTime = Date.now();
        const response = await this.originalFetch(input, init);
        const endTime = Date.now();
        
        // Clone the response to read its body
        const clonedResponse = response.clone();
        let responseBody;
        
        try {
          // Try to parse response as JSON
          responseBody = await clonedResponse.json();
        } catch (e) {
          try {
            // If not JSON, try to get as text
            responseBody = await clonedResponse.text();
          } catch (e) {
            // If that fails too, just use a placeholder
            responseBody = '[Response body could not be read]';
          }
        }
        
        // Capture response data
        const responseData: ResponseData = {
          status: response.status,
          statusText: response.statusText,
          headers: this.headersToObject(response.headers),
          body: responseBody,
          timestamp: endTime,
          duration: endTime - startTime,
        };
        
        // Update network request with response
        const index = this.requests.findIndex(req => req.id === id);
        if (index !== -1) {
          this.requests[index].response = responseData;
          this.notifyListeners();
        }
        
        // Log response
        console.log(`[NetworkMonitor] Response: ${response.status} ${response.statusText} for ${url}`);
        console.log('[NetworkMonitor] Response Headers:', responseData.headers);
        console.log('[NetworkMonitor] Response Time:', responseData.duration, 'ms');
        
        return response;
      } catch (error) {
        // Capture error
        const index = this.requests.findIndex(req => req.id === id);
        if (index !== -1) {
          this.requests[index].error = error as Error;
          this.notifyListeners();
        }
        
        // Log error
        console.error(`[NetworkMonitor] Error for ${url}:`, error);
        
        throw error;
      }
    };
  }

  // Monkey patch XMLHttpRequest
  private monkeyPatchXHR(): void {
    if (typeof XMLHttpRequest === 'undefined') return;
    
    // Add custom properties to XMLHttpRequest type
    type CustomXHR = XMLHttpRequest & {
      _id?: string;
      _method?: string;
      _url?: string;
      _requestHeaders?: Record<string, string>;
      _startTime?: number;
    };
    
    // Override open method
    XMLHttpRequest.prototype.open = function(this: CustomXHR, method: string, url: string) {
      this._id = `xhr-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      this._method = method;
      this._url = url;
      this._requestHeaders = {};
      
      return NetworkMonitor.instance.originalXHROpen.call(this, method, url);
    };
    
    // Override setRequestHeader method
    const originalSetRequestHeader = XMLHttpRequest.prototype.setRequestHeader;
    XMLHttpRequest.prototype.setRequestHeader = function(this: CustomXHR, name: string, value: string) {
      if (this._requestHeaders) {
        this._requestHeaders[name] = value;
      }
      return originalSetRequestHeader.call(this, name, value);
    };
    
    // Override send method
    XMLHttpRequest.prototype.send = function(this: CustomXHR, body?: Document | XMLHttpRequestBodyInit | null) {
      if (!this._url || !this._method || !this._id) {
        return NetworkMonitor.instance.originalXHRSend.call(this, body);
      }
      
      this._startTime = Date.now();
      
      // Capture request data
      const requestData: RequestData = {
        url: this._url,
        method: this._method,
        headers: this._requestHeaders || {},
        body: body || undefined,
        timestamp: this._startTime,
      };
      
      // Create network request object
      const networkRequest: NetworkRequest = {
        id: this._id,
        request: requestData,
      };
      
      // Add to requests array
      NetworkMonitor.instance.requests.push(networkRequest);
      NetworkMonitor.instance.notifyListeners();
      
      // Log request
      console.log(`[NetworkMonitor] XHR Request: ${this._method} ${this._url}`);
      console.log('[NetworkMonitor] XHR Request Headers:', requestData.headers);
      if (requestData.body) {
        console.log('[NetworkMonitor] XHR Request Body:', requestData.body);
      }
      
      // Add load event listener to capture response
      this.addEventListener('load', function(this: CustomXHR) {
        if (!this._id || !this._startTime) return;
        
        const endTime = Date.now();
        
        // Parse response headers
        const responseHeaders: Record<string, string> = {};
        const headerString = this.getAllResponseHeaders();
        const headerPairs = headerString.split('\r\n');
        
        for (let i = 0; i < headerPairs.length; i++) {
          const headerPair = headerPairs[i];
          const index = headerPair.indexOf(': ');
          if (index > 0) {
            const key = headerPair.substring(0, index);
            const value = headerPair.substring(index + 2);
            responseHeaders[key.toLowerCase()] = value;
          }
        }
        
        // Try to parse response as JSON
        let responseBody;
        try {
          responseBody = JSON.parse(this.responseText);
        } catch (e) {
          // If not JSON, use response text
          responseBody = this.responseText;
        }
        
        // Capture response data
        const responseData: ResponseData = {
          status: this.status,
          statusText: this.statusText,
          headers: responseHeaders,
          body: responseBody,
          timestamp: endTime,
          duration: endTime - this._startTime,
        };
        
        // Update network request with response
        const index = NetworkMonitor.instance.requests.findIndex(req => req.id === this._id);
        if (index !== -1) {
          NetworkMonitor.instance.requests[index].response = responseData;
          NetworkMonitor.instance.notifyListeners();
        }
        
        // Log response
        console.log(`[NetworkMonitor] XHR Response: ${this.status} ${this.statusText} for ${this._url}`);
        console.log('[NetworkMonitor] XHR Response Headers:', responseHeaders);
        console.log('[NetworkMonitor] XHR Response Time:', responseData.duration, 'ms');
      });
      
      // Add error event listener
      this.addEventListener('error', function(this: CustomXHR) {
        if (!this._id) return;
        
        const error = new Error(`Network request failed for ${this._url}`);
        
        // Update network request with error
        const index = NetworkMonitor.instance.requests.findIndex(req => req.id === this._id);
        if (index !== -1) {
          NetworkMonitor.instance.requests[index].error = error;
          NetworkMonitor.instance.notifyListeners();
        }
        
        // Log error
        console.error(`[NetworkMonitor] XHR Error for ${this._url}:`, error);
      });
      
      return NetworkMonitor.instance.originalXHRSend.call(this, body);
    };
  }

  // Convert Headers object to plain object
  private headersToObject(headers: Headers | Record<string, string> | string[][] | Record<string, string>[]): Record<string, string> {
    if (headers instanceof Headers) {
      const result: Record<string, string> = {};
      headers.forEach((value: string, key: string) => {
        result[key] = value;
      });
      return result;
    } else if (Array.isArray(headers)) {
      // Handle array of header entries
      const result: Record<string, string> = {};
      for (const header of headers) {
        if (Array.isArray(header) && header.length === 2) {
          result[header[0]] = header[1];
        }
      }
      return result;
    } else if (typeof headers === 'object') {
      return { ...headers };
    }
    return {};
  }
}

// Export singleton instance
export const networkMonitor = NetworkMonitor.getInstance(); 