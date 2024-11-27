"use client";

import { ImageUploader } from "@/components/ImageUploader";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import {
  FormControl,
  FormErrorMessage,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/Form";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import {
  ResponsiveDialog,
  ResponsiveDialogBody,
  ResponsiveDialogContent,
  ResponsiveDialogFooter,
  ResponsiveDialogHeader,
  ResponsiveDialogTitle,
  ResponsiveDialogTrigger,
} from "@/components/ui/ResponsiveDialog";
import { Textarea } from "@/components/ui/Textarea";
import { GUILD_AUTH_COOKIE_NAME } from "@/config/constants";
import { env } from "@/lib/env";
import { fetcher } from "@/lib/fetcher";
import { getCookie } from "@/lib/getCookie";
import {
  type CreateRoleGroupForm,
  CreateRoleGroupSchema,
  type RoleGroup,
} from "@/lib/schemas/roleGroup";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle, Plus, XCircle } from "@phosphor-icons/react/dist/ssr";
import { useMutation } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { toast } from "sonner";
import { revalidateRoleGroups } from "../actions";

type Props = {
  guildId: string;
};

export const CreateRoleGroup = ({ guildId }: Props) => {
  const [open, onOpenChange] = useState(false);

  return (
    <ResponsiveDialog open={open} onOpenChange={onOpenChange}>
      <Card className="bg-card-secondary">
        <ResponsiveDialogTrigger asChild>
          <Button variant="ghost" leftIcon={<Plus weight="bold" />}>
            Create page
          </Button>
        </ResponsiveDialogTrigger>
      </Card>

      <ResponsiveDialogContent size="lg">
        <ResponsiveDialogHeader>
          <ResponsiveDialogTitle>Create page</ResponsiveDialogTitle>
        </ResponsiveDialogHeader>

        <CreateRoleGroupDialogForm
          guildId={guildId}
          onSuccess={() => onOpenChange(false)}
        />
      </ResponsiveDialogContent>
    </ResponsiveDialog>
  );
};

const CreateRoleGroupDialogForm = ({
  guildId,
  onSuccess,
}: {
  guildId: Props["guildId"];
  onSuccess: () => void;
}) => {
  const form = useForm<CreateRoleGroupForm>({
    mode: "onTouched",
    resolver: zodResolver(CreateRoleGroupSchema),
    defaultValues: {
      guildId,
      imageUrl: "",
      name: "",
      description: "",
    },
  });

  const router = useRouter();
  const { guildId: guildIdRouteParam } = useParams();

  const { mutate: onSubmit, isPending } = useMutation({
    mutationFn: async (data: CreateRoleGroupForm) => {
      const token = getCookie(GUILD_AUTH_COOKIE_NAME);

      if (!token) throw new Error("Unauthorized"); // TODO: custom errors?

      return fetcher<RoleGroup>(`${env.NEXT_PUBLIC_API}/role-group`, {
        method: "POST",
        headers: {
          "X-Auth-Token": token,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
    },
    onError: (error) => {
      // TODO: parse the error and display it in a user-friendly way
      toast("An error occurred", {
        icon: <XCircle weight="fill" className="text-icon-error" />,
      });
      console.error(error);
    },
    onSuccess: (res) => {
      revalidateRoleGroups(res.guildId);
      onSuccess();
      toast("Page successfully created", {
        description: "You're being redirected to it",
        icon: <CheckCircle weight="fill" className="text-icon-success" />,
      });
      router.push(`/${guildIdRouteParam}/${res.urlName}`);
    },
  });

  return (
    <FormProvider {...form}>
      <ResponsiveDialogBody className="pb-px">
        <div className="grid gap-4">
          <div className="grid grid-cols-[theme(space.12)_1fr] gap-2">
            <Label className="col-span-2">Image and name</Label>
            <div className="size-12 rounded-full bg-input-background">
              <ImageUploader
                onSuccess={(imageUrl) => form.setValue("imageUrl", imageUrl)}
              />
            </div>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input {...field} size="lg" />
                  </FormControl>
                  <FormErrorMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="description"
            render={({ field: { value, ...field } }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea {...field} value={value ?? ""} />
                </FormControl>
                <FormErrorMessage />
              </FormItem>
            )}
          />
        </div>
      </ResponsiveDialogBody>

      <ResponsiveDialogFooter>
        <Button
          colorScheme="success"
          onClick={form.handleSubmit((data) => onSubmit(data))}
          isLoading={isPending}
          loadingText="Creating page"
        >
          Create page
        </Button>
      </ResponsiveDialogFooter>
    </FormProvider>
  );
};
