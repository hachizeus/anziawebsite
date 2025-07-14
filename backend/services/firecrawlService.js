import FirecrawlApp from "@mendable/firecrawl-js";
import { config } from '../config/config.js';

class FirecrawlService {
    constructor() {
        this.firecrawl = new FirecrawlApp({
            apiKey: config.firecrawlApiKey
        });
    }

    async findProperties(city, maxPrice, productCategory = "Residential", productType = "Flat", limit = 6) {
        try {
            const formattedLocation = city.toLowerCase().replace(/\s+/g, '-');
            
            // URLs for product websites (using 99acres as an example)
            const urls = [
                `https://www.99acres.com/product-in-${formattedLocation}-ffid/*`
            ];

            const productTypePrompt = productType === "Flat" ? "Flats" : "Individual Houses";
            
            // Define schema directly as a JSON schema object
            const productSchema = {
                type: "object",
                properties: {
                    properties: {
                        type: "array",
                        description: "List of product details",
                        items: {
                            type: "object",
                            properties: {
                                building_name: {
                                    type: "string",
                                    description: "Name of the building/product"
                                },
                                product_type: {
                                    type: "string",
                                    description: "Type of product (commercial, residential, etc)"
                                },
                                location_address: {
                                    type: "string",
                                    description: "Complete address of the product"
                                },
                                price: {
                                    type: "string",
                                    description: "Price of the product"
                                },
                                description: {
                                    type: "string",
                                    description: "Brief description of the product"
                                },
                                amenities: {
                                    type: "array",
                                    items: { type: "string" },
                                    description: "List of key amenities"
                                },
                                area_sqft: {
                                    type: "string",
                                    description: "Area in square feet"
                                }
                            },
                            required: ["building_name", "product_type", "location_address", "price"]
                        }
                    }
                },
                required: ["properties"]
            };
            
            const extractResult = await this.firecrawl.extract(
                urls,
                {
                    prompt: `Extract ONLY ${limit} different ${productCategory} ${productTypePrompt} from ${city} that cost less than ${maxPrice} crores.
                    
                    Requirements:
                    - product Category: ${productCategory} properties only
                    - product Type: ${productTypePrompt} only
                    - Location: ${city}
                    - Maximum Price: ${maxPrice} crores
                    - Include essential product details (building name, price, location, area)
                    - Keep descriptions brief (under 100 words)
                    - IMPORTANT: Return data for EXACTLY ${limit} different properties. No more.
                    `,
                    schema: productSchema,
                    enableWebSearch: true
                }
            );

            if (!extractResult.success) {
                throw new Error(`Failed to extract product data: ${extractResult.error || 'Unknown error'}`);
            }

            console.log('Extracted properties count:', extractResult.data.properties.length);

            return extractResult.data;
        } catch (error) {
            console.error('Error finding properties:', error);
            throw error;
        }
    }

    async getLocationTrends(city, limit = 5) {
        try {
            const formattedLocation = city.toLowerCase().replace(/\s+/g, '-');
            
            // Define schema directly as a JSON schema object
            const locationSchema = {
                type: "object",
                properties: {
                    locations: {
                        type: "array",
                        description: "List of location data points",
                        items: {
                            type: "object",
                            properties: {
                                location: {
                                    type: "string"
                                },
                                price_per_sqft: {
                                    type: "number"
                                },
                                percent_increase: {
                                    type: "number"
                                },
                                rental_yield: {
                                    type: "number"
                                }
                            },
                            required: ["location", "price_per_sqft", "percent_increase", "rental_yield"]
                        }
                    }
                },
                required: ["locations"]
            };
            
            const extractResult = await this.firecrawl.extract(
                [`https://www.99acres.com/product-rates-and-price-trends-in-${formattedLocation}-prffid/*`],
                {
                    prompt: `Extract price trends data for ${limit} major localities in ${city}.
                    IMPORTANT:
                    - Return data for EXACTLY ${limit} different localities
                    - Include data points: location name, price per square foot, yearly percent increase, and rental yield
                    - Format as a list of locations with their respective data
                    `,
                    schema: locationSchema,
                    enableWebSearch: true
                }
            );

            if (!extractResult.success) {
                throw new Error(`Failed to extract location data: ${extractResult.error || 'Unknown error'}`);
            }

            console.log('Extracted locations count:', extractResult.data.locations.length);
            
            return extractResult.data;
        } catch (error) {
            console.error('Error fetching location trends:', error);
            throw error;
        }
    }
}

export default new FirecrawlService();
