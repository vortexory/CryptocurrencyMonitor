"use client";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useMutation } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { Session } from "@/utils/interfaces";
import axios from "axios";
import { useToast } from "./ui/use-toast";

const AddEditGoalDialog = ({
  setWalletsValueGoal,
  walletsValueGoal,
}: {
  setWalletsValueGoal: Dispatch<SetStateAction<number>>;
  walletsValueGoal: number;
}) => {
  const { toast } = useToast();
  const { data } = useSession();

  const session = data as Session | null;

  const [goal, setGoal] = useState<number>(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { mutateAsync, isPending } = useMutation({
    mutationFn: (accountInfo: { userId: string; newGoal: number }) => {
      return axios.patch("/api/wallet/set-goal", accountInfo);
    },
    onSuccess: (res: any) => {
      setWalletsValueGoal(res.data.walletsValueGoal);
      toast({
        title: walletsValueGoal === 0 ? "Goal set" : "Goal edited",
        description:
          walletsValueGoal === 0
            ? "Your goal has been added successfully"
            : "Your goal has been edited successfully",
      });
    },
    onError: () => {
      toast({
        variant: "destructive",
        title: "Something went wrong",
        description: "There was a problem with your request.",
      });
    },
  });

  const handleGoal = async () => {
    try {
      if (session?.user?.id) {
        const accountInfo = {
          userId: session.user.id,
          newGoal: goal,
        };

        await mutateAsync(accountInfo);
      }
    } catch (error) {
      console.error("Error setting or editing coin", error);
    } finally {
      setIsModalOpen(false);
    }
  };

  useEffect(() => {
    if (session?.user?.id) {
      setGoal(session.user.walletsValueGoal);
    }
  }, [session]);

  return (
    <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
      <Button onClick={() => setIsModalOpen(true)} className="w-full md:w-fit">
        {walletsValueGoal === 0 ? "Set Goal" : "Edit Goal"}
      </Button>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {walletsValueGoal === 0
              ? "Set a goal for your portfolios"
              : "Edit the goal for your portfolios"}
          </DialogTitle>
        </DialogHeader>
        <div className="my-2 flex flex-col gap-6">
          <Input
            placeholder="Your goal"
            value={goal}
            onChange={(e) => setGoal(+e.target.value)}
            type="number"
          />

          <Button type="button" onClick={handleGoal} disabled={isPending}>
            {walletsValueGoal === 0 ? "Set" : "Edit"}
          </Button>
        </div>

        <DialogFooter className="sm:justify-end">
          <Button
            type="button"
            variant="secondary"
            onClick={() => setIsModalOpen(false)}
          >
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddEditGoalDialog;
