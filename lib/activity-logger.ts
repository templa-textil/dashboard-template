type ActivityType = "product" | "template" | "invoice" | "user";
type ActivityAction =
  | "added"
  | "updated"
  | "deleted"
  | "created"
  | "modified"
  | "generated"
  | "joined"
  | "promoted"
  | "demoted";

interface ActivityLog {
  type: ActivityType;
  action: ActivityAction;
  description: string;
  userId?: string;
  metadata?: Record<string, any>;
}

export async function logActivity(activity: ActivityLog) {
  try {
    // For now, we'll rely on the existing data timestamps
    // In a production app, you might want a dedicated ActivityLog table
    console.log("Activity logged:", activity);

    // You could extend this to store in a dedicated table:
    // await prisma.activityLog.create({
    //   data: {
    //     type: activity.type,
    //     action: activity.action,
    //     description: activity.description,
    //     userId: activity.userId,
    //     metadata: activity.metadata,
    //   }
    // })
  } catch (error) {
    console.error("Failed to log activity:", error);
  }
}

const activityActionTranslations: Record<ActivityAction, string> = {
  added: "se agregó",
  updated: "se actualizó",
  deleted: "se eliminó",
  created: "se creó",
  modified: "se modificó",
  generated: "se generó",
  joined: "se unió",
  promoted: "fue promovido",
  demoted: "fue degradado",
};

export const translateActionToSpanish = (action: ActivityAction): string => {
  return activityActionTranslations[action];
};
