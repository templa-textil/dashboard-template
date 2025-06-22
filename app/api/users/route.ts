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
    // If admin, return all users; if regular user, return only their own data
    if (session.user.role === "ADMIN") {
      const users = await prisma.user.findMany({
        // where: {
        //   deletedAt: null, // Only active users
        // },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          image: true,
          createdAt: true,
          updatedAt: true,
          // deletedAt: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      });
      return NextResponse.json(users);
    } else {
      const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          image: true,
          createdAt: true,
          updatedAt: true,
        },
      });
      return NextResponse.json([user]);
    }
  } catch (error) {
    return NextResponse.json(
      { error: "Fallo al obtener los usuarios" },
      { status: 500 }
    );
  }
}
