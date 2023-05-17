import { api } from "@/utils/api";
import React, { useState, useEffect, type FC, useMemo } from "react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  type DropResult,
} from "react-beautiful-dnd";
import { Separator } from "@radix-ui/react-separator";
import { ProjectStats } from "./projectFeed";
import { type Task } from "@prisma/client";

interface TaskBoardProps {
  projectId: string;
}

type TaskItem = {
  id: string;
  content: string;
  description: string;
};

type Column = {
  items: TaskItem[];
  name: string;
};

type Columns = {
  [key: string]: Column | { items: TaskItem[]; name: string };
};

const TaskBoard: FC<TaskBoardProps> = ({ projectId }) => {
  const [dataFetched, setDataFetched] = useState(false);
  const initialColumns: Columns = useMemo(
    () => ({
      PENDING: { name: "Pending", items: [] },
      IN_PROGRESS: { name: "In Progress", items: [] },
      DONE: { name: "Done", items: [] },
    }),
    []
  );
  const [columns, setColumns] = useState(initialColumns);
  const { data, refetch } = api.tasks.getAllByProjectId.useQuery(
    { projectId },
    {
      enabled: false, // Disable automatic data fetching
    }
  );
  const { mutate } = api.tasks.updateStatusById.useMutation({
    onSuccess: () => {
      console.log("success");
    },
    onError: () => {
      console.log("error");
    },
  });

  useEffect(() => {
    if (!data) return;

    const updatedColumns: Columns = {
      ...initialColumns,
    };

    data.forEach((task: Task) => {
      const { status, id, name, description } = task;
      updatedColumns[status]?.items?.push({
        id,
        content: name,
        description,
      });
    });

    setColumns(updatedColumns);
  }, [data, initialColumns]);

  useEffect(() => {
    if (!dataFetched) {
      void refetch(); // Fetch data manually if it hasn't been fetched yet
      setDataFetched(true);
    }
  }, [dataFetched, refetch]);

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const { source, destination } = result;

    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
      // Task was dropped back into the same position, no need to update columns
      return;
    }

    setColumns((prevColumns: Columns) => {
      const updatedColumns: Columns = { ...prevColumns };
      const sourceColumn = updatedColumns[source.droppableId];
      const destColumn = updatedColumns[destination.droppableId];

      if (!sourceColumn || !destColumn) {
        return prevColumns;
      }

      if (source.droppableId === destination.droppableId) {
        // Move task within the same column
        const updatedItems = Array.from(sourceColumn.items);
        const [removed] = updatedItems.splice(source.index, 1);
        if (!removed) return prevColumns;
        updatedItems.splice(destination.index, 0, removed);

        const updatedColumn = {
          ...sourceColumn,
          items: updatedItems,
        };

        return {
          ...updatedColumns,
          [source.droppableId]: updatedColumn,
        };
      }

      // Move task to a different column
      const sourceItems = Array.from(sourceColumn.items);
      const destItems = Array.from(destColumn.items);
      const [removed] = sourceItems.splice(source.index, 1);
      if (!removed) return prevColumns;
      destItems.splice(destination.index, 0, removed);

      const updatedSourceColumn = {
        ...sourceColumn,
        items: sourceItems,
      };

      const updatedDestColumn = {
        ...destColumn,
        items: destItems,
      };

      return {
        ...updatedColumns,
        [source.droppableId]: updatedSourceColumn,
        [destination.droppableId]: updatedDestColumn,
      };
    });

    const taskId = result.draggableId;
    const newStatus = destination.droppableId.toUpperCase() as
      | "PENDING"
      | "IN_PROGRESS"
      | "DONE";

    mutate({
      id: taskId,
      status: newStatus,
    });
  };

  if (!data || data.length === 0) {
    return (
      <div className="flex justify-center">
        <div className="flex flex-col items-center rounded-xl border p-8">
          <h1 className="text-2xl font-bold">No tasks yet</h1>
          <p className="text-gray-400">Add a task to get started</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full justify-start gap-6 overflow-hidden rounded-xl border p-4">
      <DragDropContext onDragEnd={onDragEnd}>
        {Object.entries(columns).map(([columnId, column], index) => (
          <React.Fragment key={columnId}>
            <div className="min-h-12 flex w-full flex-col items-center rounded-md">
              <h2 className="mb-4 w-full">
                <ProjectStats status={columnId} />
              </h2>
              <div className="w-full">
                <Droppable droppableId={columnId}>
                  {(provided, snapshot) => (
                    <div
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      style={{
                        background: snapshot.isDraggingOver ? "#ffffff10" : "",
                      }}
                      className="w-full rounded-xl transition"
                    >
                      {column.items.map((item, index) => (
                        <Draggable
                          key={item.id}
                          draggableId={item.id}
                          index={index}
                        >
                          {(provided, snapshot) => (
                            <div
                              className="min-h-12 mb-4 select-none rounded-lg border bg-background p-4 text-foreground"
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              style={{
                                backgroundColor: snapshot.isDragging
                                  ? "#ffffff10"
                                  : "",
                                color: "white",
                                ...provided.draggableProps.style,
                              }}
                            >
                              {item.content}
                              {item.description && (
                                <div className="text-sm text-gray-400">
                                  {item.description}
                                </div>
                              )}
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </div>
            </div>
            {index === 2 ? null : (
              <Separator
                orientation="vertical"
                key={index}
                className="border"
              />
            )}
          </React.Fragment>
        ))}
      </DragDropContext>
    </div>
  );
};

export default TaskBoard;
