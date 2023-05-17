import { cn } from "@/lib/utils";
import { api } from "@/utils/api";
import { type Project } from "@prisma/client";
import { Separator } from "@radix-ui/react-separator";
import { cva } from "class-variance-authority";
import Link from "next/link";
import { type FC } from "react";
import { format } from "date-fns";

interface ProjectFeedProps {
  userId: string;
  compact?: boolean;
}

const ProjectFeed: FC<ProjectFeedProps> = ({ userId, compact = false }) => {
  const { data } = api.projects.getAllByUser.useQuery({
    userId,
  });

  return (
    <div className="overflow-hidden rounded-xl border">
      {data?.map((project, index) => (
        <>
          <ProjectInFeed
            key={`pr__${crypto.randomUUID()}__${project.name}`}
            project={project}
            compact={compact}
          />
          {index === data.length - 1 ? null : (
            <Separator orientation="horizontal" className="border-b" />
          )}
        </>
      ))}
    </div>
  );
};

export default ProjectFeed;

export interface ProjectInFeedProps {
  project: Project;
  compact?: boolean;
}

export const ProjectInFeed: FC<ProjectInFeedProps> = ({ project, compact }) => {
  return (
    <Link href={`/personal/projects/${project.id}`}>
      <div className="flex flex-col gap-8 p-4 transition hover:bg-foreground/10">
        <ProjectStats status={project.status} />
        <div className="flex flex-col gap-1">
          <h3 className="text-xl font-semibold">{project.name}</h3>
          <p className="text-foreground/60">{project.description}</p>
        </div>
        {compact ? null : (
          <div className="flex flex-row items-end justify-between">
            <div className="flex flex-col  gap-2">
              <span className="text-foreground/50">
                Created:{" "}
                <span className="text-foreground">
                  {format(project.createdAt, "MMMM do, yyyy")}
                </span>
              </span>
              <span className="text-foreground/50">
                Due till:{" "}
                <span className="text-foreground">
                  {" "}
                  {format(project.dueDate || new Date(), "MMMM do, yyyy")}
                </span>
              </span>
            </div>
            <div className="flex flex-row justify-start gap-4">
              <span>Tasks: {project.tasks.length}</span>
              {/* <Separator orientation="vertical" className="border" /> */}
              {/* <span>Tasks: {project.tasks.length}</span>
              <Separator orientation="vertical" className="border" />
              <span>Tasks: {project.tasks.length}</span> */}
            </div>
          </div>
        )}
      </div>
    </Link>
  );
};

const statusColors = cva("h-2 w-2 rounded-full flex-shrink-0", {
  variants: {
    variant: {
      PENDING: "bg-yellow-500",
      IN_PROGRESS: "bg-blue-500",
      DONE: "bg-green-500",
    },
  },
  defaultVariants: {
    variant: "PENDING",
  },
});

export interface ProjectStatsProps {
  status: string;
}

type status = "PENDING" | "IN_PROGRESS" | "DONE";

export const ProjectStats: FC<ProjectStatsProps> = ({ status = "PENDING" }) => {
  return (
    <div className="flex items-center gap-2">
      <div className={cn(statusColors({ variant: status as status }))} />
      <span className="text-foreground/60">{status}</span>
    </div>
  );
};
