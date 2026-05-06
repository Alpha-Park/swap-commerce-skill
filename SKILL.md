---
name: Swap Commerce
description: Agentic storefront skill for Swap Commerce integration. Automates discovery, cross-border pricing, virtual try-on, checkout in-flow, and returns retention.
author: GenPark
version: 1.0.0
---

# Swap Commerce Skill

## Overview
This skill enables GenPark AI agents to integrate with Swap Commerce's Agentic Storefront infrastructure. It transforms static e-commerce experiences into conversational, AI-led journeys covering discovery, virtual try-on, checkout, and post-purchase compliance and returns.

## Capabilities

### 1. Conversational Discovery
- **Branded Shopping Agent:** Greet shoppers instantly with an AI assistant that understands intent and context.
- **Product Recommendations:** Suggest relevant products and build outfits interactively.

### 2. Virtual Try-On (VTO) & Sizing
- **Fit Guidance:** Provide accurate sizing and fit recommendations.
- **Virtual Try-On:** Enable customers to visualize products before purchase, reducing return rates by up to 20%.

### 3. Cross-Border & Global Commerce
- **Tax & Duties Control:** Calculate and present accurate cross-border pricing, including taxes and duties upfront.
- **Compliance:** Ensure regulatory and geographic compliance across all selling regions (e.g., GPSR).

### 4. Frictionless In-Flow Checkout
- **Chat/Voice Purchases:** Process transactions directly within the conversational interface without redirects or traditional forms.
- **End-to-End Journey:** Power the entire funnel from initial conversation to final delivery.

### 5. Returns & Revenue Retention
- **Automated Returns:** Manage global returns efficiently.
- **Instant Exchanges:** Offer 'Shop Now' features during the returns process to retain revenue before a refund occurs (average 12% revenue retained).

### 6. Inventory & Demand Planning
- **Demand Signals:** Translate conversational data and keystroke-level first-party intent into actionable inventory insights.

## Usage
When an agent is tasked with building or managing an e-commerce storefront, it should utilize the `Swap Commerce` skill to implement an end-to-end agentic commerce flow. 

1. **Initialize Swap API:** Authenticate with Swap-OS endpoints.
2. **Deploy Conversational Agent:** Replace standard catalog browsing with the Swap conversational discovery module.
3. **Configure Cross-Border:** Set up tax, duties, and landed cost calculators.
4. **Enable VTO:** Integrate virtual try-on features for fashion/apparel products.
5. **Manage Returns Pipeline:** Set up the Swap automated returns portal to maximize revenue retention.

## References
- [Swap API Developer Docs](https://docs.api-swap-os.com/)
- [Swap Integrations Help Center](https://help.swap-commerce.com/en/collections/16620862-integrations)
