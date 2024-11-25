"use client";

import { useFormContext } from "react-hook-form";

import { ControlledImageUploader } from "@/components/ImageUploader";
import {
  FormControl,
  FormErrorMessage,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/Form";
import { Input } from "@/components/ui/Input";
import type { CreateGuildForm as CreateGuildFormType } from "@/lib/schemas/guild";

export const CreateGuildForm = () => {
  const { control } = useFormContext<CreateGuildFormType>();

  return (
    <>
      <FormField
        name="imageUrl"
        render={() => (
          <FormItem>
            <div className="mx-auto size-32 rounded-full bg-input-background">
              <ControlledImageUploader
                fieldName="imageUrl"
                className="size-32"
              />
            </div>
            <FormErrorMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel aria-required>Guild name</FormLabel>
            <FormControl>
              <Input size="lg" {...field} />
            </FormControl>

            <FormErrorMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="contact"
        render={({ field }) => (
          <FormItem>
            <FormLabel aria-required>E-mail address</FormLabel>
            <FormControl>
              <Input size="lg" {...field} />
            </FormControl>

            <FormErrorMessage />
          </FormItem>
        )}
      />
    </>
  );
};
