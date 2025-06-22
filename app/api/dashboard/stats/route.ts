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
    const [productsCount, templatesCount, invoicesCount, usersCount] =
      await Promise.all([
        prisma.product.count(),
        prisma.template.count(),
        prisma.invoice.count(),
        prisma.user.count(),
      ]);

    return NextResponse.json({
      totalProducts: productsCount,
      totalTemplates: templatesCount,
      totalInvoices: invoicesCount,
      totalUsers: usersCount,
    });
  } catch (error) {
    console.error("Dashboard stats error:", error);
    return NextResponse.json(
      { error: "Failed to fetch stats" },
      { status: 500 }
    );
  }
}
