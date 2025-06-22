import { type NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { logActivity } from "@/lib/activity-logger";

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const search = searchParams.get("search") || "";

  try {
    const products = await prisma.product.findMany({
      where: {
        name: {
          contains: search,
          mode: "insensitive",
        },
      },
      orderBy: {
        updatedAt: "desc",
      },
    });

    return NextResponse.json(products);
  } catch (error) {
    return NextResponse.json(
      { error: "Fallo al obtener los productos" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { name, quantity, price } = body;

    const product = await prisma.product.create({
      data: {
        name,
        quantity: Number.parseInt(quantity),
        price: Number.parseFloat(price),
      },
    });

    // Log activity with "added" instead of "created"
    await logActivity({
      type: "product",
      action: "added",
      description: `El producto "${product.name}" fue agregado al inventario`,
      userId: session.user.id,
      metadata: {
        productId: product.id,
        price: product.price,
        quantity: product.quantity,
      },
    });

    return NextResponse.json(product);
  } catch (error) {
    return NextResponse.json(
      { error: "Fallo al crear el producto" },
      { status: 500 }
    );
  }
}
