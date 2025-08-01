// File: components/dashboard/UserForm.tsx
// CORRECTED: New form for creating and editing users

"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAppDispatch } from "@/redux/store";
import {
  createUserAsync,
  updateUserAsync,
  UserWithSchool,
} from "@/redux/userSlice";
import { School } from "@prisma/client";
import { toast } from "sonner";

const formSchema = z
  .object({
    name: z.string().min(2, { message: "Name must be at least 2 characters." }),
    email: z.string(),
    password: z.string().optional(),
    role: z.enum(["USER", "SCHOOL_ADMIN", "SUPERADMIN"]),
    assignedSchoolId: z.string().optional(),
  })
  .refine(
    (data) => {
      if (data.role === "SCHOOL_ADMIN") return !!data.assignedSchoolId;
      return true;
    },
    {
      message: "A school must be assigned for a SCHOOL_ADMIN.",
      path: ["assignedSchoolId"],
    }
  );

interface UserFormProps {
  currentUser: UserWithSchool | null;
  schools: School[];
  onFinished: () => void;
}

export default function UserForm({
  currentUser,
  schools,
  onFinished,
}: UserFormProps) {
  const dispatch = useAppDispatch();
  const isEditMode = !!currentUser;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: currentUser?.name || "",
      email: currentUser?.email || "",
      password: "",
      role: currentUser?.role === "SCHOOL_ADMIN" ? "SCHOOL_ADMIN" : "USER",
      assignedSchoolId: currentUser?.assignedSchoolId?.toString() || undefined,
    },
  });

  const selectedRole = form.watch("role");

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      if (isEditMode) {
        const updateData: any = { ...values };
        if (!values.password) delete updateData.password;
        await dispatch(
          updateUserAsync({ id: currentUser.id, ...updateData })
        ).unwrap();
        toast.success("User updated successfully!");
      } else {
        if (!values.password) {
          form.setError("password", {
            type: "manual",
            message: "Password is required for new users.",
          });
          return;
        }
        await dispatch(createUserAsync(values)).unwrap();
        toast.success("User created successfully!");
      }
      onFinished();
    } catch (error: any) {
      toast.error(`Operation failed: ${error}`);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Name</FormLabel>
              <FormControl>
                <Input placeholder="John Doe" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" placeholder="user@example.com" {...field} />
              </FormControl>
              <FormMessage />
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
                <Input
                  type="password"
                  placeholder={
                    isEditMode
                      ? "Leave blank to keep password"
                      : "Required for new user"
                  }
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="role"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Role</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="USER">USER</SelectItem>
                  <SelectItem value="SCHOOL_ADMIN">SCHOOL_ADMIN</SelectItem>
                  <SelectItem value="SUPERADMIN">SUPERADMIN</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {selectedRole === "SCHOOL_ADMIN" && (
          <FormField
            control={form.control}
            name="assignedSchoolId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Assign to School</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a school" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {schools.map((school) => (
                      <SelectItem key={school.id} value={school.id.toString()}>
                        {school.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <Button
          type="submit"
          className="w-full"
          disabled={form.formState.isSubmitting}
        >
          {form.formState.isSubmitting
            ? "Saving..."
            : isEditMode
            ? "Save Changes"
            : "Create User"}
        </Button>
      </form>
    </Form>
  );
}
