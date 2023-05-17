"use client";

import { useState, type FC } from "react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { type SubmitHandler, useForm } from "react-hook-form";
import { api } from "@/utils/api";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { LoadingSpinner } from "./loading";
import { Plus } from "lucide-react";

type AddTask = {
  name: string;
  description: string;
  projectId: string;
};

interface IAddTaskButtonProps {
  projectId: string;
}

const AddTaskButton: FC<IAddTaskButtonProps> = ({ projectId }) => {
  const { register, handleSubmit } = useForm<AddTask>();
  const ctx = api.useContext();
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);

  const { mutate, isLoading: isCreating } = api.tasks.create.useMutation({
    onSuccess: () => {
      setDialogOpen(false);
      void ctx.tasks.getAllByProjectId.invalidate();
    },
    onError: () => {
      console.log("error");
    },
  });

  const onSubmit: SubmitHandler<AddTask> = (data) => {
    mutate(data);
  };

  return (
    <AlertDialog open={dialogOpen}>
      <AlertDialogTrigger>
        <Button
          onClick={() => setDialogOpen(true)}
          className="flex items-center gap-2 font-medium"
        >
          Add Task <Plus size={20} />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Add Project</AlertDialogTitle>
          <AlertDialogDescription></AlertDialogDescription>
        </AlertDialogHeader>
        <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col gap-2">
            <Label>Task Name</Label>
            <Input
              placeholder="This is a task"
              {...register("name", {
                required: true,
              })}
              type="text"
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label>Description</Label>
            <Input
              placeholder="Do some stuff here and there and everywhere"
              {...register("description", {
                required: true,
              })}
              type="text"
            />
          </div>
          <input
            type="hidden"
            {...register("projectId", {
              required: true,
            })}
            value={projectId}
          />
          <div className="flex justify-end gap-2">
            {!isCreating && (
              <>
                <Button
                  variant="ghost"
                  onClick={() => {
                    setDialogOpen(false);
                  }}
                >
                  Cancel
                </Button>
                <Button type="submit">Submit</Button>
              </>
            )}
            {isCreating && <LoadingSpinner />}
          </div>
        </form>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default AddTaskButton;
