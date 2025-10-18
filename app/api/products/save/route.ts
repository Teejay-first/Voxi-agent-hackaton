import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

interface ProductData {
  product_name: string
  price: number
  image_url?: string
  description?: string
  category?: string
  company?: string
  product_url_slug?: string
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { products } = body

    if (!products || !Array.isArray(products) || products.length === 0) {
      return NextResponse.json(
        { error: "Products array is required and must not be empty" },
        { status: 400 }
      )
    }

    const supabase = await createClient()

    // Process and save each product
    const savedProducts = []
    const errors = []

    for (const product of products) {
      try {
        // Validate required fields
        if (!product.product_name || product.price === undefined) {
          errors.push({
            product: product.product_name || "Unknown",
            error: "Missing required fields (product_name, price)",
          })
          continue
        }

        // Generate URL slug if not provided
        const product_url_slug =
          product.product_url_slug ||
          product.product_name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-|-$/g, "")

        const { data, error } = await supabase
          .from("products")
          .insert({
            product_name: product.product_name,
            price: product.price,
            image_url: product.image_url || null,
            description: product.description || null,
            category: product.category || null,
            company: product.company || null,
            product_url_slug: product_url_slug,
          })
          .select()

        if (error) {
          errors.push({
            product: product.product_name,
            error: error.message,
          })
        } else if (data && data.length > 0) {
          savedProducts.push(data[0])
        }
      } catch (itemError) {
        errors.push({
          product: product.product_name || "Unknown",
          error: itemError instanceof Error ? itemError.message : "Unknown error",
        })
      }
    }

    console.log(`[Voxi] Successfully saved ${savedProducts.length} products to Supabase`)
    if (errors.length > 0) {
      console.warn(`[Voxi] Errors saving ${errors.length} products:`, errors)
    }

    return NextResponse.json({
      success: true,
      savedCount: savedProducts.length,
      totalProcessed: products.length,
      savedProducts,
      errors: errors.length > 0 ? errors : undefined,
    })
  } catch (error) {
    console.error("[Voxi] Error in products save API:", error)
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json({
    status: "ok",
    message: "Products save API is running",
    usage: 'POST with { "products": [...] }',
  })
}
