import { ControllerRenderProps, FieldValues } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";

interface CreateAccountFormFieldProps {
  form: any;
  label: string;
  name: string;
  render: (
    field: ControllerRenderProps<FieldValues, string>,
  ) => React.ReactNode;
}

export const CreateAccountFormField = ({
  form,
  label,
  name,
  render,
}: CreateAccountFormFieldProps) => {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className="grid gap-2">
          <FormLabel>{label}</FormLabel>
          <FormControl>{render(field)}</FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
