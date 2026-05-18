/**
 * Swap Commerce MCP Tools Spec
 * Outlines Model Context Protocol (MCP) schemas and execution wrappers
 * to let GenPark AI Agents dynamically orchestrate e-commerce operations.
 */

const SwapOSClient = require('./swap_client');

// Initialize the API client (using environment variables)
const apiKey = process.env.SWAP_API_KEY || 'mock_token_for_validation';
const client = new SwapOSClient({ apiKey });

/**
 * List of available tools exposed via MCP.
 */
const tools = [
  {
    name: 'swap_create_return_session',
    description: 'Initiate a self-service returns or instant exchange process on Swap-OS.',
    inputSchema: {
      type: 'object',
      properties: {
        orderId: { type: 'string', description: 'The source order ID (e.g. ord_12345)' },
        customerEmail: { type: 'string', format: 'email', description: 'Customer email' },
        customerCountry: { type: 'string', maxLength: 2, description: 'ISO 2-letter country code' },
        items: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              sku: { type: 'string', description: 'SKU of the item being returned' },
              quantity: { type: 'integer', minimum: 1 },
              reason: { 
                type: 'string', 
                enum: ['SIZE_TOO_SMALL', 'SIZE_TOO_LARGE', 'CHANGED_MIND', 'DAMAGED_ITEM', 'INCORRECT_ITEM'] 
              },
              action: { type: 'string', enum: ['REFUND', 'EXCHANGE', 'STORE_CREDIT'] },
              exchangeSku: { type: 'string', description: 'Target SKU if exchanging' }
            },
            required: ['sku', 'quantity', 'reason', 'action']
          }
        }
      },
      required: ['orderId', 'customerEmail', 'customerCountry', 'items']
    }
  },
  {
    name: 'swap_calculate_landed_cost',
    description: 'Compute precise cross-border duties, taxes, and local VAT/GST for custom clearance (DDP).',
    inputSchema: {
      type: 'object',
      properties: {
        originCountry: { type: 'string', maxLength: 2, description: 'ISO 2-letter country code of origins' },
        destinationCountry: { type: 'string', maxLength: 2, description: 'ISO 2-letter country code of destination' },
        items: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              sku: { type: 'string' },
              hsCode: { type: 'string', description: 'Harmonized System tariff code (e.g. 6101.30.00)' },
              declaredValue: { type: 'number', description: 'Declared item price' },
              quantity: { type: 'integer' }
            },
            required: ['sku', 'declaredValue', 'quantity']
          }
        },
        shippingCost: { type: 'number', description: 'International shipping freight cost' }
      },
      required: ['originCountry', 'destinationCountry', 'items', 'shippingCost']
    }
  },
  {
    name: 'swap_get_exchange_recommendations',
    description: 'Offer real-time exchange recommendations and inventory availability based on returned items.',
    inputSchema: {
      type: 'object',
      properties: {
        orderId: { type: 'string', description: 'Original order ID' },
        returnSkus: { type: 'array', items: { type: 'string' }, description: 'SKUs being returned' }
      },
      required: ['orderId', 'returnSkus']
    }
  }
];

/**
 * Handler method to execute tool calls dynamically.
 * @param {string} toolName - Name of the target tool.
 * @param {Object} args - Arguments matching the tool's schema.
 */
async function executeTool(toolName, args) {
  console.log(`Executing Swap tool: ${toolName}...`);

  switch (toolName) {
    case 'swap_create_return_session':
      return await client.createReturnSession({
        order_id: args.orderId,
        customer: {
          email: args.customerEmail,
          country_code: args.customerCountry
        },
        items: args.items.map(item => ({
          sku: item.sku,
          quantity: item.quantity,
          reason: item.reason,
          action: item.action,
          exchange_sku: item.exchangeSku
        }))
      });

    case 'swap_calculate_landed_cost':
      return await client.calculateLandedCost({
        origin_country: args.originCountry,
        destination_country: args.destinationCountry,
        items: args.items.map(item => ({
          sku: item.sku,
          hs_code: item.hsCode,
          declared_value: item.declaredValue,
          quantity: item.quantity
        })),
        shipping_cost: args.shippingCost
      });

    case 'swap_get_exchange_recommendations':
      return await client.getExchangeRecommendations(args.orderId, args.returnSkus);

    default:
      throw new Error(`Unknown MCP Tool: ${toolName}`);
  }
}

module.exports = {
  tools,
  executeTool
};
