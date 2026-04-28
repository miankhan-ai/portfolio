import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertMessageSchema, type InsertMessage } from "@shared/routes";
import { useContact } from "@/hooks/use-contact";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Loader2, Send, MessageSquare } from "lucide-react";

export function ContactForm() {
  const { mutate, isPending } = useContact();

  const form = useForm<InsertMessage>({
    resolver: zodResolver(insertMessageSchema),
    defaultValues: {
      name: "",
      email: "",
      company: "",
      message: "",
    },
  });

  const onSubmit = (data: InsertMessage) => {
    mutate(data, {
      onSuccess: () => {
        form.reset();
      },
    });
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-2.5 rounded-lg bg-[#7B2FBE] text-white">
          <MessageSquare className="w-5 h-5" />
        </div>
        <h3 className="text-xl font-bold text-slate-900">Send us a message</h3>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="space-y-1.5">
                <FormLabel className="text-sm font-semibold text-slate-700">Full Name</FormLabel>
                <FormControl>
                  <Input
                    placeholder="John Doe"
                    {...field}
                    className="bg-white border-slate-200 focus:border-[#7B2FBE] focus:ring-[#7B2FBE]/20 h-12 rounded-xl transition-all"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="space-y-1.5">
                <FormLabel className="text-sm font-semibold text-slate-700">Email Address</FormLabel>
                <FormControl>
                  <Input
                    placeholder="john@company.com"
                    type="email"
                    {...field}
                    className="bg-white border-slate-200 focus:border-[#7B2FBE] focus:ring-[#7B2FBE]/20 h-12 rounded-xl transition-all"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="company"
            render={({ field }) => (
              <FormItem className="space-y-1.5">
                <FormLabel className="text-sm font-semibold text-slate-700">Company</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Your Company"
                    {...field}
                    className="bg-white border-slate-200 focus:border-[#7B2FBE] focus:ring-[#7B2FBE]/20 h-12 rounded-xl transition-all"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="message"
            render={({ field }) => (
              <FormItem className="space-y-1.5">
                <FormLabel className="text-sm font-semibold text-slate-700">Message</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Tell us about your project..."
                    className="bg-white border-slate-200 focus:border-[#7B2FBE] focus:ring-[#7B2FBE]/20 min-h-[160px] rounded-xl transition-all resize-none"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            disabled={isPending}
            className="w-full py-6 text-base font-bold bg-[#7B2FBE] hover:bg-[#6a28a4] text-white rounded-xl shadow-lg shadow-[#7B2FBE]/20 transition-all group"
          >
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Sending...
              </>
            ) : (
              <div className="flex items-center justify-center gap-2">
                Send Message
                <Send className="w-5 h-5 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
              </div>
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
}
