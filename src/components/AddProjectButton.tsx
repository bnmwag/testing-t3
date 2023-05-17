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
import { Calendar } from "./ui/calendar";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { LoadingSpinner } from "./loading";
import { Plus } from "lucide-react";

type AddProject = {
  name: string;
  description: string;
  userId: string;
  dueDate: Date;
};

interface IAddProjectButtonProps {
  userId: string;
}

const AddProjectButton: FC<IAddProjectButtonProps> = ({ userId }) => {
  const { register, handleSubmit } = useForm<AddProject>();
  const ctx = api.useContext();
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);

  const { mutate, isLoading: isCreating } = api.projects.create.useMutation({
    onSuccess: () => {
      setDialogOpen(false);
      void ctx.projects.getAllByUser.invalidate();
    },
    onError: () => {
      console.log("error");
    },
  });

  const onSubmit: SubmitHandler<AddProject> = (data) => {
    data.dueDate = date as Date;
    mutate(data);
  };

  return (
    <AlertDialog open={dialogOpen}>
      <AlertDialogTrigger>
        <Button
          onClick={() => setDialogOpen(true)}
          className="flex items-center gap-2 font-medium"
        >
          Add Project <Plus size={20} />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Add Project</AlertDialogTitle>
          <AlertDialogDescription></AlertDialogDescription>
        </AlertDialogHeader>
        <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col gap-2">
            <Label>Project Name</Label>
            <Input
              placeholder="Project Xylon"
              {...register("name", {
                required: true,
              })}
              type="text"
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label>Description</Label>
            <Input
              placeholder="It's a project that does some stuff. "
              {...register("description", {
                required: true,
              })}
              type="text"
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label>Due Date</Label>
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              className="w-fit rounded-md border"
            />
          </div>
          <input
            type="hidden"
            {...register("userId", {
              required: true,
            })}
            value={userId}
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

export default AddProjectButton;
