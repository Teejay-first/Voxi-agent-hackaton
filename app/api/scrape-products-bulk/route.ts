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
  },
  required: ["product_name", "price"],
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { urls } = body

    if (!urls || !Array.isArray(urls) || urls.length === 0) {
      return NextResponse.json({ error: "URLs array is required and must not be empty" }, { status: 400 })
    }

    // Check for Firecrawl API key
    const apiKey = process.env.FIRECRAWL_API_KEY
    if (!apiKey) {
      return NextResponse.json({ error: "FIRECRAWL_API_KEY environment variable is not set" }, { status: 500 })
    }

    console.log("[v0] Starting bulk Firecrawl extraction for URLs:", urls)

    // Call Firecrawl extract endpoint with multiple URLs
    const firecrawlResponse = await fetch("https://api.firecrawl.dev/v1/extract", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        urls: urls,
        prompt:
          "Extract product information from each page including the product name, price, description, category, brand/company, and main image URL.",
        schema: productSchema,
      }),
    })

    if (!firecrawlResponse.ok) {
      const errorText = await firecrawlResponse.text()
      console.error("[v0] Firecrawl API error:", errorText)
      return NextResponse.json(
        { error: "Failed to scrape product data", details: errorText },
        { status: firecrawlResponse.status },
      )
    }

    const firecrawlData = await firecrawlResponse.json()
    console.log("[v0] Firecrawl response:", JSON.stringify(firecrawlData, null, 2))

    // Extract the products data from the response
    const productsData = Array.isArray(firecrawlData.data) ? firecrawlData.data : [firecrawlData.data]

    // Process each product
    const processedProducts = productsData.map((product: any) => {
      // Generate a URL slug if not provided
      if (!product.product_url_slug && product.product_name) {
        product.product_url_slug = product.product_name
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-|-$/g, "")
      }
      return product
    })

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
