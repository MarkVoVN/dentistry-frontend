import { zodResolver } from '@hookform/resolvers/zod'
import React from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form"
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

const configSchema = z.object({
  stringField: z.string().min(2, {
    message: "Thương hiệu phải có ít nhất 2 ký tự",
  }),
})


export default function ConfigForm({defaultValue, label, placeholder, submitFunction}: {
  label: string,
  placeholder: string,
  defaultValue?: string,
  submitFunction: any
}) {
    // 1. Define form.
    const form = useForm<z.infer<typeof configSchema>>({
      resolver: zodResolver(configSchema),
      defaultValues: {
        stringField: defaultValue || "",
      }
    })
  
    // 2. Define a submit handler.
    function onSubmit(values: z.infer<typeof configSchema>) {
      // Do something with the form values.
      // ✅ This will be type-safe and validated.
      // submitFunction(values.brand, values.productLine)
      submitFunction(values.stringField)
    }

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="stringField"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{label}</FormLabel>
                <FormControl>
                  <Input placeholder={placeholder} {...field} />
                </FormControl>
                {/* <FormDescription>
                  This is your public display name.
                </FormDescription> */}
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="text-shade-1-100% dark:text-shade-2-100% dark:bg-shade-1-100%">Thêm</Button>
        </form>
      </Form>
    </div>
  )
}
