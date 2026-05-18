/**
 * SwapOSClient - JavaScript SDK client wrapper for the Swap Commerce API.
 * Consolidates returns, exchanges, logistics, and DDP cross-border calculations.
 */
class SwapOSClient {
  /**
   * Initialize the SwapOS Client.
   * @param {Object} config
   * @param {string} config.apiKey - Swap Commerce API authentication token.
   * @param {string} [config.baseUrl] - Swap Commerce API Base URL.
   */
  constructor({ apiKey, baseUrl = 'https://api.swap-commerce.com/v1' }) {
    if (!apiKey) {
      throw new Error('Swap Commerce API Key is required.');
    }
    this.apiKey = apiKey;
    this.baseUrl = baseUrl;
  }

  /**
   * Helper method to dispatch HTTP requests to the Swap API.
   * @private
   */
  async _request(endpoint, options = {}) {
    const url = `${this.baseUrl}${endpoint}`;
    const headers = {
      'Authorization': `Bearer ${this.apiKey}`,
      'Content-Type': 'application/json',
      ...options.headers,
    };

    try {
      // Note: In real production, this would use fetch or an HTTP library like axios.
      // This implementation represents a robust node-compliant template representation.
      const response = await fetch(url, {
        ...options,
        headers,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          `Swap API Error: [${response.status}] ${errorData.message || response.statusText}`
        );
      }

      return await response.json();
    } catch (error) {
      console.error(`Swap Client Request Failed on ${endpoint}:`, error.message);
      throw error;
    }
  }

  /**
   * Initiate a return or instant exchange session.
   * @param {Object} returnDetails
   * @param {string} returnDetails.orderId - Source order identifier.
   * @param {Object} returnDetails.customer - Customer metadata (email, country).
   * @param {Array<Object>} returnDetails.items - Array of items being returned/exchanged.
   * @param {Object} [returnDetails.shipping] - Custom shipping preferences.
   * @returns {Promise<Object>} The approved return session details with labels.
   */
  async createReturnSession(returnDetails) {
    return this._request('/returns/sessions', {
      method: 'POST',
      body: JSON.stringify(returnDetails),
    });
  }

  /**
   * Retrieve dynamic exchange recommendations based on returns reason and inventory.
   * Helps retain revenue during the return process.
   * @param {string} orderId - Original order ID.
   * @param {Array<string>} returnSkus - SKUs being returned.
   * @returns {Promise<Object>} Recommended exchange items and inventory status.
   */
  async getExchangeRecommendations(orderId, returnSkus) {
    return this._request('/returns/exchanges/recommend', {
      method: 'POST',
      body: JSON.stringify({
        order_id: orderId,
        return_skus: returnSkus,
      }),
    });
  }

  /**
   * Calculate exact landed costs (duties, taxes, VAT) for international cross-border clearance.
   * Supports Delivered Duty Paid (DDP) shipments.
   * @param {Object} costParams
   * @param {string} costParams.originCountry - ISO-2 origin country code.
   * @param {string} costParams.destinationCountry - ISO-2 destination country code.
   * @param {Array<Object>} costParams.items - Array of items with declared value and HS codes.
   * @param {number} costParams.shippingCost - Shipping freight cost.
   * @returns {Promise<Object>} Detailed breakdown of total landed cost.
   */
  async calculateLandedCost(costParams) {
    return this._request('/cross-border/landed-cost', {
      method: 'POST',
      body: JSON.stringify(costParams),
    });
  }

  /**
   * Query tracking details for a return shipping label or parcel.
   * @param {string} trackingNumber - Shipment carrier tracking number.
   * @returns {Promise<Object>} Real-time shipping milestones and tracking status.
   */
  async getReturnTracking(trackingNumber) {
    return this._request(`/shipping/track/${trackingNumber}`, {
      method: 'GET',
    });
  }
}

module.exports = SwapOSClient;
