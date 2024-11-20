import { Button } from "@/components/ui/Button";
import {
  FormControl,
  FormDescription,
  FormErrorMessage,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/Form";
import { Input } from "@/components/ui/Input";
import { zodResolver } from "@hookform/resolvers/zod";
import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = z.object({
  username: z.string().min(2).max(50),
  password: z.string().min(6).max(255),
});

type FormType = z.infer<typeof formSchema>;

const defaultValues = {
  username: "",
  password: "",
} satisfies FormType;

const FormExample = () => {
  const form = useForm<FormType>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const [submittedValues, setSubmittedValues] =
    useState<FormType>(defaultValues);
  function onSubmit(values: FormType) {
    setSubmittedValues(values);
  }

  return (
    <FormProvider {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="max-w-lg space-y-4"
      >
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormDescription>
                This is your public display name.
              </FormDescription>
              <FormErrorMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type="password" {...field} />
              </FormControl>
              <FormErrorMessage />
            </FormItem>
          )}
        />

        <Button type="submit">Submit</Button>

        {!!submittedValues && <pre>{JSON.stringify(submittedValues)}</pre>}
      </form>
    </FormProvider>
  );
};

const meta: Meta<typeof FormExample> = {
  title: "Examples/Form",
  component: FormExample,
};

export default meta;

type Story = StoryObj<typeof FormExample>;

export const Default: Story = {};
