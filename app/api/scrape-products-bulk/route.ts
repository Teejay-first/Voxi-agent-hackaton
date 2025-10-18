import { type NextRequest, NextResponse } from "next/server"

// Define the product schema matching the database structure
const productSchema = {
  type: "object",
  properties: {
    product_name: {
      type: "string",
      description: "The name or title of the product",
    },
    product_url_slug: {
      type: "string",
      description: "A URL-friendly slug for the product (lowercase, hyphenated)",
    },
    price: {
      type: "number",
      description: "The price of the product as a number",
    },
    image_url: {
      type: "string",
      description: "The main product image URL",
    },
    company: {
      type: "string",
      description: "The company or brand name",
    },
    description: {
      type: "string",
      description: "A detailed description of the product",
    },
    category: {
      type: "string",
      description: "The product category (e.g., yoga mats, fitness equipment)",
    },
    sale_price: {
      type: "number",
      description: "The sale price if the product is on sale",
    },
    original_price: {
      type: "number",
      description: "The original price before any discount",
    },
    rating: {
      type: "number",
      description: "The product rating (e.g., 4.5 out of 5)",
    },
    review_count: {
      type: "number",
      description: "The number of reviews for this product",
    },
    in_stock: {
      type: "boolean",
      description: "Whether the product is in stock",
    },
  },
  required: ["product_name", "price"],
}

// Schema wrapper to handle array of products
const productsArraySchema = {
  type: "object",
  properties: {
    products: {
      type: "array",
      description: "Array of all products found on the page",
      items: productSchema,
    },
  },
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    let { urls } = body

    if (!urls || !Array.isArray(urls) || urls.length === 0) {
      return NextResponse.json({ error: "URLs array is required and must not be empty" }, { status: 400 })
    }

    // Check for Firecrawl API key
    const apiKey = process.env.FIRECRAWL_API_KEY
    if (!apiKey) {
      return NextResponse.json({ error: "FIRECRAWL_API_KEY environment variable is not set" }, { status: 500 })
    }

    // Expand URLs to include common product collection paths if they're base URLs
    const expandedUrls = urls.flatMap((url: string) => {
      try {
        const urlObj = new URL(url)
        // Check if it's a base URL (just domain, or domain with just /)
        const isBaseUrl = urlObj.pathname === '/' || urlObj.pathname === ''
        
        if (isBaseUrl) {
          // Ensure URL ends with /
          const baseUrl = url.endsWith('/') ? url : url + '/'
          // Add common Shopify collection paths, prioritizing /collections/all
          const collectionUrls = [
            baseUrl + 'collections/all',
            baseUrl + 'collections/products',
            baseUrl + 'products',
            baseUrl,
          ]
          return collectionUrls
        }
        return [url]
      } catch {
        return [url]
      }
    })

    console.log("[v0] Expanded URLs for scraping:", expandedUrls)

    console.log("[v0] Starting bulk Firecrawl extraction for URLs:", expandedUrls)

    // Call Firecrawl scrape endpoint for each URL to get structured data
    const scrapePromises = expandedUrls.map((url: string) =>
      fetch("https://api.firecrawl.dev/v2/scrape", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          url: url,
          formats: [
            {
              type: "json",
              prompt:
                "Extract ALL products from this page. For each product, extract: product name/title, current price (if on sale, use the sale price), product description, main image URL, category, and brand. Look for products in product listings, collections, and catalog sections. Include products marked as 'Sold Out'.",
              schema: productsArraySchema,
            },
          ],
        }),
      })
    )

    const responses = await Promise.all(scrapePromises)
    let firecrawlDataArray = []

    for (const response of responses) {
      if (response.ok) {
        const data = await response.json()
        console.log("[v0] Firecrawl response for URL:", JSON.stringify(data, null, 2))
        if (data.data && data.data.json) {
          const jsonData = data.data.json
          // Handle wrapper format { products: [...] }
          if (jsonData.products && Array.isArray(jsonData.products)) {
            firecrawlDataArray.push(...jsonData.products)
          } else if (Array.isArray(jsonData)) {
            firecrawlDataArray.push(...jsonData)
          } else if (typeof jsonData === "object") {
            firecrawlDataArray.push(jsonData)
          }
        }
      } else {
        const errorText = await response.text()
        console.error("[v0] Firecrawl API error:", errorText)
      }
    }

    // Extract the products data from the response
    let productsData = []
    if (Array.isArray(firecrawlDataArray)) {
      productsData = firecrawlDataArray
    }

    // Filter out null/undefined products and process valid ones
    const processedProducts = productsData
      .filter((product: any) => product && typeof product === "object")
      .map((product: any) => {
        // Generate a URL slug if not provided
        if (!product.product_url_slug && product.product_name) {
          product.product_url_slug = product.product_name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-|-$/g, "")
        }
        
        // Use sale_price as price if available, otherwise use price
        if (product.sale_price && !product.price) {
          product.price = product.sale_price
        }
        
        return product
      })
      // Deduplicate by product name (since we fetch multiple URLs)
      .filter((product: any, index: number, self: any[]) => {
        return index === self.findIndex((p: any) => p.product_name?.toLowerCase() === product.product_name?.toLowerCase())
      })
      .filter((product: any) => product.price && product.price > 0 && product.product_name)

    console.log("[v0] Successfully extracted products:", processedProducts.length)

    return NextResponse.json({
      success: true,
      count: processedProducts.length,
      products: processedProducts,
    })
  } catch (error) {
    console.error("[v0] Error in scrape-products-bulk API:", error)
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

// GET endpoint to check API status
export async function GET() {
  return NextResponse.json({
    status: "ok",
    message: "Firecrawl bulk product scraper API is running",
    usage: 'POST to this endpoint with { "urls": ["https://example.com/product1", "https://example.com/product2"] }',
  })
}
