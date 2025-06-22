import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Get recent products (last 10)
    const recentProducts = await prisma.product.findMany({
      take: 5,
      orderBy: { updatedAt: "desc" },
      select: {
        id: true,
        name: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    // Get recent templates (last 5)
    const recentTemplates = await prisma.template.findMany({
      take: 5,
      orderBy: { updatedAt: "desc" },
      select: {
        id: true,
        name: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    // Get recent invoices (last 5)
    const recentInvoices = await prisma.invoice.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        totalPrice: true,
        createdAt: true,
        template: {
          select: { name: true },
        },
      },
    });

    // Get recent users (last 5)
    const recentUsers = await prisma.user.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    // Combine and format activities with proper action verbs
    const activities = [
      ...recentProducts.map((product) => {
        const isNew =
          product.createdAt.getTime() === product.updatedAt.getTime();
        return {
          id: `product-${product.id}`,
          type: "product" as const,
          action: isNew ? ("added" as const) : ("updated" as const),
          description: `El producto "${product.name}" fue ${
            isNew ? "agregado al inventario" : "actualizado"
          }`,
          timestamp: product.updatedAt.toISOString(),
        };
      }),
      ...recentTemplates.map((template) => {
        const isNew =
          template.createdAt.getTime() === template.updatedAt.getTime();
        return {
          id: `template-${template.id}`,
          type: "template" as const,
          action: isNew ? ("created" as const) : ("modified" as const),
          description: `La plantilla "${template.name}" fue ${
            isNew ? "creada" : "actualizada"
          }`,
          timestamp: template.updatedAt.toISOString(),
        };
      }),
      ...recentInvoices.map((invoice) => ({
        id: `invoice-${invoice.id}`,
        type: "invoice" as const,
        action: "generated" as const,
        description: `La factura para"${
          invoice.template.name
        }" ($${invoice.totalPrice.toFixed(2)}) fue generada`,
        timestamp: invoice.createdAt.toISOString(),
      })),
      ...recentUsers.map((user) => {
        const isPromoted =
          user.createdAt.getTime() !== user.updatedAt.getTime() &&
          user.role === "ADMIN";
        return {
          id: `user-${user.id}`,
          type: "user" as const,
          action: isPromoted ? ("promoted" as const) : ("joined" as const),
          description: isPromoted
            ? `${user.name || user.email} fue promovido a Admin`
            : `${user.name || user.email} ingreso al sistema`,
          timestamp: isPromoted
            ? user.updatedAt.toISOString()
            : user.createdAt.toISOString(),
          user: user.name || user.email,
        };
      }),
    ];

    // Sort by timestamp and take the most recent 10
    const sortedActivities = activities
      .sort(
        (a, b) =>
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      )
      .slice(0, 10);

    return NextResponse.json(sortedActivities);
  } catch (error) {
    console.error("Recent activity error:", error);
    return NextResponse.json(
      { error: "Failed to fetch recent activity" },
      { status: 500 }
    );
  }
}
