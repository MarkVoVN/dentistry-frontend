"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
 
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form"
import { Select, SelectContent, SelectTrigger, SelectItem, SelectValue } from "@/components/ui/select"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"

const formSchema = z.object({
  brand: z.string().min(2, {
    message: "Thương hiệu phải có ít nhất 2 ký tự",
  }),
  image: z.string().url(),
})

export default function BrandAddDialog({title= "Title", buttonTitle="Add", description, defaultBrand,
  submitFunction
}: 
{
  title?: string,
  description ?: string,
  buttonTitle?: string,
  brandList: string[],
  defaultBrand?: string,
  submitFunction: any
}) {
  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      brand: defaultBrand || "Asus",
      image: "",
    }
  })

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    // submitFunction(values.brand, values.productLine)
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">{buttonTitle}</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {
            description && (
              <DialogDescription>{description}</DialogDescription>
            )
          }
        </DialogHeader>
        <div className="gap-4 py-4">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="brand"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Thương hiệu</FormLabel>
                  <FormControl>
                    <Input placeholder="Asus" {...field} />
                  </FormControl>
                  {/* <FormDescription>
                    This is your public display name.
                  </FormDescription> */}
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="brand"
              render={({ field }) => (
                <FormItem className="text-shade-2-100%">
                  <FormLabel>Thương hiệu</FormLabel>
                  <FormControl>
                    <Select onValueChange={field.onChange} defaultValue={defaultBrand || "Asus"} >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Chọn thương hiệu"/>
                        </SelectTrigger>
                      </FormControl>
                      
                    </Select>
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
      </DialogContent>
    </Dialog>
  )
}