import { config } from '../config/config.js';
import ModelClient, { isUnexpected } from "@azure-rest/ai-inference";
import { AzureKeyCredential } from "@azure/core-auth";

class AIService {
  constructor() {
    this.azureApiKey = config.azureApiKey;
  }

  async generateText(prompt) {
    return this.generateTextWithAzure(prompt);
  }

  async generateTextWithAzure(prompt) {
    try {
      console.log(`Starting Azure AI generation at ${new Date().toISOString()}`);
      const startTime = Date.now();
      
      const client = ModelClient(
        "https://models.inference.ai.azure.com",
        new AzureKeyCredential(this.azureApiKey)
      );

      const response = await client.path("/chat/completions").post({
        body: {
          messages: [
            { 
              role: "system", 
              content: "You are an AI real estate expert assistant that provides concise, accurate analysis of product data."
            },
            { 
              role: "user", 
              content: prompt 
            }
          ],
          model: "gpt-4o",
          temperature: 0.7,
          max_tokens: 800,
          top_p: 1
        }
      });

      const endTime = Date.now();
      console.log(`Azure AI generation completed in ${(endTime - startTime) / 1000} seconds`);

      if (isUnexpected(response)) {
        throw new Error(response.body.error.message || "Azure API error");
      }
      
      return response.body.choices[0].message.content;
    } catch (error) {
      console.error("Error generating text with Azure:", error);
      return `Error: ${error.message}`;
    }
  }

  // Helper method to filter and clean product data before analysis
  _prepareproductData(properties, maxProperties = 3) {
    // Limit the number of properties
    const limitedProperties = properties.slice(0, maxProperties);
    
    // Clean and simplify each product
    return limitedProperties.map(product => ({
      building_name: product.building_name,
      product_type: product.product_type,
      location_address: product.location_address,
      price: product.price,
      area_sqft: product.area_sqft,
      // Extract just a few key amenities
      amenities: Array.isArray(product.amenities) 
        ? product.amenities.slice(0, 5) 
        : [],
      // Truncate description to save tokens
      description: product.description 
        ? product.description.substring(0, 150) + (product.description.length > 150 ? '...' : '')
        : ''
    }));
  }

  // Helper method to filter and clean location data
  _prepareLocationData(locations, maxLocations = 5) {
    // Limit the number of locations
    return locations.slice(0, maxLocations);
  }

  async analyzeProperties(
    properties,
    city,
    maxPrice,
    productCategory,
    productType
  ) {
    // Prepare limited and cleaned product data
    const preparedProperties = this._prepareproductData(properties);

    const prompt = `As a real estate expert, analyze these properties:

        Properties Found in ${city}:
        ${JSON.stringify(preparedProperties, null, 2)}

        INSTRUCTIONS:
        1. Focus ONLY on these properties that match:
           - product Category: ${productCategory}
           - product Type: ${productType}
           - Maximum Price: ${maxPrice} crores
        2. Provide a brief analysis with these sections:
           - product Overview (basic facts about each)
           - Best Value Analysis (which offers the best value)
           - Quick Recommendations

        Keep your response concise and focused on these properties only.
        `;

    return this.generateText(prompt);
  }

  async analyzeLocationTrends(locations, city) {
    // Prepare limited location data
    const preparedLocations = this._prepareLocationData(locations);

    const prompt = `As a real estate expert, analyze these location price trends for ${city}:

        ${JSON.stringify(preparedLocations, null, 2)}

        Please provide:
        1. A brief summary of price trends for each location
        2. Which areas are showing the highest appreciation
        3. Which areas offer the best rental yield
        4. Quick investment recommendations based on this data

        Keep your response concise (maximum 300 words).
        `;

    return this.generateText(prompt);
  }
}

export default new AIService();
