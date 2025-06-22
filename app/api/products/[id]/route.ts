import { type NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { logActivity } from "@/lib/activity-logger";

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { name, quantity, price } = body;

    const product = await prisma.product.update({
      where: { id: params.id },
      data: {
        name,
        quantity: Number.parseInt(quantity),
        price: Number.parseFloat(price),
      },
    });

    // Log activity
    await logActivity({
      type: "product",
      action: "updated",
      description: `El producto "${product.name}" fue actualizado`,
      userId: session.user.id,
      metadata: { productId: product.id },
    });

    return NextResponse.json(product);
  } catch (error) {
    return NextResponse.json(
      { error: "Fallo al actualizar el producto" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const product = await prisma.product.findUnique({
      where: { id: params.id },
      select: { name: true },
    });

    await prisma.product.delete({
      where: { id: params.id },
    });

    // Log activity
    await logActivity({
      type: "product",
      action: "deleted",
      description: `El producto "${product?.name}" fue eliminado`,
      userId: session.user.id,
      metadata: { productId: params.id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Fallo al eliminar el producto" },
      { status: 500 }
    );
  }
}
