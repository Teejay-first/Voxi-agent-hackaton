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
    const { url } = body

    if (!url) {
      return NextResponse.json({ error: "URL is required" }, { status: 400 })
    }

    // Check for Firecrawl API key
    const apiKey = process.env.FIRECRAWL_API_KEY
    if (!apiKey) {
      return NextResponse.json({ error: "FIRECRAWL_API_KEY environment variable is not set" }, { status: 500 })
    }

    console.log("[v0] Starting Firecrawl extraction for URL:", url)

    // Call Firecrawl extract endpoint
    const firecrawlResponse = await fetch("https://api.firecrawl.dev/v1/extract", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        urls: [url],
        prompt:
          "Extract product information from this page including the product name, price, description, category, brand/company, and main image URL.",
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

    // Extract the product data from the response
    const productData = firecrawlData.data

    if (!productData) {
      return NextResponse.json({ error: "No product data found in the response" }, { status: 404 })
    }

    // Generate a URL slug if not provided
    if (!productData.product_url_slug && productData.product_name) {
      productData.product_url_slug = productData.product_name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "")
    }

    console.log("[v0] Successfully extracted product data:", productData)

    return NextResponse.json({
      success: true,
      product: productData,
    })
  } catch (error) {
    console.error("[v0] Error in scrape-product API:", error)
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
    message: "Firecrawl product scraper API is running",
    usage: 'POST to this endpoint with { "url": "https://example.com/product" }',
  })
}
