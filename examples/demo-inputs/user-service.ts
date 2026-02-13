import { prisma } from "@/lib/prisma";
import type { User, Post, Prisma } from "@prisma/client";

interface DashboardUser extends User {
  posts: Post[];
  recentActivity: string;
}

export async function getDashboardUsers(
  teamId: string
): Promise<DashboardUser[]> {
  const users = await prisma.user.findMany({
    where: { teamId },
  });

  const dashboardUsers: DashboardUser[] = [];

  for (const user of users) {
    const posts = await prisma.post.findMany({
      where: { authorId: user.id },
      orderBy: { createdAt: "desc" },
      take: 5,
    });

    const lastLogin = await prisma.session.findFirst({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
    });

    dashboardUsers.push({
      ...user,
      posts,
      recentActivity: lastLogin
        ? `Last seen ${lastLogin.createdAt.toISOString()}`
        : "Never logged in",
    });
  }

  return dashboardUsers;
}

export async function searchUsers(query: string) {
  const users = await prisma.user.findMany({
    where: {
      OR: [
        { name: { contains: query, mode: "insensitive" } },
        { email: { contains: query, mode: "insensitive" } },
      ],
    },
  });

  return users;
}

export async function updateUserProfile(
  userId: string,
  data: { name?: string; bio?: string; avatarUrl?: string }
) {
  if (data.name) {
    await prisma.user.update({
      where: { id: userId },
      data: { name: data.name },
    });
  }

  if (data.bio) {
    await prisma.profile.update({
      where: { userId },
      data: { bio: data.bio },
    });
  }

  if (data.avatarUrl) {
    await prisma.profile.update({
      where: { userId },
      data: { avatarUrl: data.avatarUrl },
    });
  }

  return prisma.user.findUnique({
    where: { id: userId },
    include: { profile: true },
  });
}

export async function processWebhookPayload(payload: any) {
  const event = payload.type;

  if (event === "user.created") {
    await prisma.user.create({
      data: {
        externalId: payload.data.id,
        email: payload.data.email,
        name: payload.data.name,
      },
    });
  } else if (event === "user.updated") {
    await prisma.user.update({
      where: { externalId: payload.data.id },
      data: {
        email: payload.data.email,
        name: payload.data.name,
      },
    });
  } else if (event === "user.deleted") {
    await prisma.user.delete({
      where: { externalId: payload.data.id },
    });
  }
}
