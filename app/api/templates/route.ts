import { type NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { logActivity } from "@/lib/activity-logger";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const templates = await prisma.template.findMany({
      include: {
        templateProducts: {
          include: {
            product: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(templates);
  } catch (error) {
    return NextResponse.json(
      { error: "Fallo al obtener las plantillas" },
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
    const { name, products } = body;

    const template = await prisma.template.create({
      data: {
        name,
        templateProducts: {
          create: products.map((p: any) => ({
            productId: p.productId,
            quantity: p.quantity,
          })),
        },
      },
      include: {
        templateProducts: {
          include: {
            product: true,
          },
        },
      },
    });

    // Log activity - templates are "created"
    await logActivity({
      type: "template",
      action: "created",
      description: `La plantilla "${template.name}" fue creada`,
      userId: session.user.id,
      metadata: { templateId: template.id, productCount: products.length },
    });

    return NextResponse.json(template);
  } catch (error) {
    return NextResponse.json(
      { error: "Fallo al crear la plantilla" },
      { status: 500 }
    );
  }
}
