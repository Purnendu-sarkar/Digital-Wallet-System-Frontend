export default function Contact() {
  return (
    <div>
      <div className="flex flex-col items-center justify-center p-6">
        <h1 className="text-3xl font-bold mb-4 text-center text-gray-800 dark:text-gray-100">
          😎Welcome to Contact Page🥇
        </h1>
        <p className="text-gray-600 dark:text-gray-300 text-center mb-6">
          🤷‍♂️This is a demo page.🔒 Future work will be done here.🤦‍♂️
        </p>
      </div>
    </div>
  );
}

// /* eslint-disable @typescript-eslint/no-unused-vars */
// import { useState } from "react";
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { z } from "zod";
// import { toast } from "sonner";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Textarea } from "@/components/ui/textarea";
// import { Label } from "@/components/ui/label";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import Joyride from "react-joyride";
// import type { Step } from "react-joyride";

// const contactSchema = z.object({
//   name: z.string().min(2, "Name must be at least 2 characters"),
//   email: z.string().email("Invalid email address"),
//   subject: z.string().min(5, "Subject must be at least 5 characters"),
//   message: z.string().min(10, "Message must be at least 10 characters"),
// });

// type ContactForm = z.infer<typeof contactSchema>;

// export default function Contact() {
//   const [tourRun, setTourRun] = useState<boolean>(
//     !localStorage.getItem("contactTourCompleted")
//   );

//   const {
//     register,
//     handleSubmit,
//     formState: { errors, isSubmitting },
//     reset,
//   } = useForm<ContactForm>({
//     resolver: zodResolver(contactSchema),
//     defaultValues: {
//       name: "",
//       email: "",
//       subject: "",
//       message: "",
//     },
//   });

//   const onSubmit = async (data: ContactForm) => {
//     // Simulate API call
//     await new Promise((resolve) => setTimeout(resolve, 1000));
//     toast.success("Message Sent!", {
//       description: "Thank you for contacting us. We'll get back to you soon.",
//     });
//     reset();
//   };

//   const handleRestartTour = () => {
//     setTourRun(true);
//     localStorage.removeItem("contactTourCompleted");
//   };

//   const tourSteps: Step[] = [
//     {
//       target: ".contact-form",
//       content: "Use this form to send us your inquiries or feedback.",
//       disableBeacon: true,
//     },
//   ];

//   return (
//     <div className="min-h-screen bg-background">
//       <Joyride
//         steps={tourSteps}
//         run={tourRun}
//         continuous
//         showSkipButton
//         styles={{
//           options: {
//             primaryColor: "#3b82f6",
//             zIndex: 1000,
//           },
//         }}
//         callback={(data) => {
//           if (data.status === "finished" || data.status === "skipped") {
//             setTourRun(false);
//             localStorage.setItem("contactTourCompleted", "true");
//           }
//         }}
//       />
//       <div className="container mx-auto px-4 py-12">
//         <Card className="max-w-2xl mx-auto">
//           <CardHeader>
//             <CardTitle className="text-3xl font-bold text-center">
//               Contact Us
//             </CardTitle>
//           </CardHeader>
//           <CardContent>
//             <form
//               onSubmit={handleSubmit(onSubmit)}
//               className="space-y-6 contact-form"
//             >
//               <div className="space-y-2">
//                 <Label htmlFor="name">Name</Label>
//                 <Input
//                   id="name"
//                   {...register("name")}
//                   placeholder="Your name"
//                   className={errors.name ? "border-destructive" : ""}
//                 />
//                 {errors.name && (
//                   <p className="text-sm text-destructive">
//                     {errors.name.message}
//                   </p>
//                 )}
//               </div>

//               <div className="space-y-2">
//                 <Label htmlFor="email">Email</Label>
//                 <Input
//                   id="email"
//                   type="email"
//                   {...register("email")}
//                   placeholder="Your email"
//                   className={errors.email ? "border-destructive" : ""}
//                 />
//                 {errors.email && (
//                   <p className="text-sm text-destructive">
//                     {errors.email.message}
//                   </p>
//                 )}
//               </div>

//               <div className="space-y-2">
//                 <Label htmlFor="subject">Subject</Label>
//                 <Input
//                   id="subject"
//                   {...register("subject")}
//                   placeholder="Subject of your message"
//                   className={errors.subject ? "border-destructive" : ""}
//                 />
//                 {errors.subject && (
//                   <p className="text-sm text-destructive">
//                     {errors.subject.message}
//                   </p>
//                 )}
//               </div>

//               <div className="space-y-2">
//                 <Label htmlFor="message">Message</Label>
//                 <Textarea
//                   id="message"
//                   {...register("message")}
//                   placeholder="Your message"
//                   rows={5}
//                   className={errors.message ? "border-destructive" : ""}
//                 />
//                 {errors.message && (
//                   <p className="text-sm text-destructive">
//                     {errors.message.message}
//                   </p>
//                 )}
//               </div>

//               <div className="flex justify-between items-center">
//                 <Button
//                   type="submit"
//                   disabled={isSubmitting}
//                   className="w-full sm:w-auto"
//                 >
//                   {isSubmitting ? "Sending..." : "Send Message"}
//                 </Button>
//                 <Button
//                   variant="outline"
//                   onClick={handleRestartTour}
//                   className="hidden sm:block"
//                 >
//                   Restart Tour
//                 </Button>
//               </div>
//             </form>
//           </CardContent>
//         </Card>
//       </div>
//     </div>
//   );
// }
