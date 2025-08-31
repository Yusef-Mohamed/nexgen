"use client";
import { useTranslations } from "next-intl";
import Image from "next/image";
import * as z from "zod";
import { createClientAxiosInstance } from "@/app/lib/utils";
import CustomForm from "@/components/Forms/CustomForm";
import { toast } from "react-toastify";

const ContactForm = () => {
  const text = useTranslations("contact");
  const inputs = useTranslations("Forms");

  const formSchema = z.object({
    name: z.string({ message: inputs("thisFieldIsRequired") }),
    email: z.string().email({ message: inputs("invalidEmail") }),
    message: z.string({ message: inputs("thisFieldIsRequired") }),
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      const axiosInstance = createClientAxiosInstance();
      await axiosInstance.post("/contactUs", data);
      toast.success(text("yourMessageHasBeenSent"));
    } catch (error) {
      console.log("FAILED...", error);
      toast.error(text("something_went_wrong"));
    }
  };

  const fields = [
    {
      type: "text",
      label: inputs("name"),
      placeholder: inputs("name"),
      name: "name" as const,
      required: true,
    },
    {
      type: "email",
      label: inputs("email"),
      placeholder: inputs("email"),
      name: "email" as const,
      required: true,
    },
    {
      type: "textarea",
      label: inputs("message"),
      placeholder: inputs("message"),
      name: "message" as const,
      required: true,
    },
  ];

  return (
    <section className="container grid gap-20 lg:grid-cols-2 secPadding">
      <div>
        <h1 className="mb-2 h1-5 md:mb-4">{text("contactFormTitle")}</h1>
        <p
          className="font-normal h5 text-text-2"
          style={{
            fontWeight: 400,
          }}
        >
          {text("contactFormDescription")}
        </p>
        <div className="mt-6">
          <CustomForm
            schema={formSchema}
            fields={fields}
            submitLabel={inputs("send")}
            onSubmit={onSubmit}
          />
        </div>
      </div>
      <div className="relative overflow-hidden max-lg:hidden rounded-3xl ">
        <div className="bg-[#011F4333] absolute w-full h-full" />
        <Image
          src="/images/contact.jpeg"
          alt="Contact"
          width={1000}
          height={1000}
          className="object-cover w-full h-full"
        />
      </div>
    </section>
  );
};

export default ContactForm;
