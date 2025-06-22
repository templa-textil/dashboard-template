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

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { name, role } = body;

    if (session.user.role !== "ADMIN" && session.user.id !== params.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const currentUser = await prisma.user.findUnique({
      where: { id: params.id },
      select: { name: true, role: true, email: true },
    });

    const updateData: any = {};
    if (name !== undefined) updateData.name = name;
    if (role !== undefined && session.user.role === "ADMIN")
      updateData.role = role;

    const updatedUser = await prisma.user.update({
      where: { id: params.id },
      data: updateData,
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

    // Log activity for role changes
    if (role && currentUser?.role !== role) {
      await logActivity({
        type: "user",
        action: role === "ADMIN" ? "promoted" : "demoted",
        description: `${updatedUser.name || updatedUser.email} fue ${
          role === "ADMIN" ? "promovido a Admin" : "degradado a User"
        }`,
        userId: session.user.id,
        metadata: {
          targetUserId: params.id,
          oldRole: currentUser?.role,
          newRole: role,
        },
      });
    }

    return NextResponse.json(updatedUser);
  } catch (error) {
    return NextResponse.json(
      { error: "Fallo al actualizar el usuario" },
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

  // Prevent admin from deleting themselves
  if (session.user.id === params.id) {
    return NextResponse.json(
      { error: "No puedes eliminar tu propia cuenta" },
      { status: 400 }
    );
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: params.id },
      select: { name: true, email: true },
    });

    // Soft delete - set deletedAt timestamp
    await prisma.user.update({
      where: { id: params.id },
      data: {
        deletedAt: new Date(),
      },
    });

    // Log activity
    await logActivity({
      type: "user",
      action: "deleted",
      description: `Usuario ${user?.name || user?.email} fue desactivado`,
      userId: session.user.id,
      metadata: { targetUserId: params.id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Fallo al eliminar el usuario" },
      { status: 500 }
    );
  }
}
