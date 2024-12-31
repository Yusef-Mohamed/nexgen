"use client";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useRef, useState } from "react";
import emailjs from "@emailjs/browser";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "react-toastify";

const ContactForm = () => {
  const text = useTranslations("contact");
  const form = useRef<HTMLFormElement | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const inputs = useTranslations("Forms");
  const sendEmail = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!form.current) return;
    setIsLoading(true);
    emailjs
      .sendForm("service_zux03ei", "template_a3ow78q", form.current, {
        publicKey: "VMBcAEntptjUutBix",
      })
      .then(
        () => {
          toast.success(text("yourMessageHasBeenSent"));
          form.current?.reset();
        },
        (error) => {
          console.log("FAILED...", error.text);
          toast.error(text("something_went_wrong"));
        }
      )
      .finally(() => {
        setIsLoading(false);
      });
  };

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
        <form ref={form} className="mt-6 space-y-4" onSubmit={sendEmail}>
          <div className="space-y-2">
            <Label htmlFor="user_name" className="font-semibold text-text-2">
              {inputs("name")}
              <span className="text-destructive">*</span>
            </Label>
            <Input
              id="user_name"
              type="text"
              placeholder={inputs("name")}
              name="user_name"
              disabled={isLoading}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="user_email" className="font-semibold text-text-2">
              {inputs("email")}
              <span className="text-destructive">*</span>
            </Label>
            <Input
              type="email"
              id="user_email"
              placeholder={inputs("email")}
              name="user_email"
              disabled={isLoading}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="message" className="font-semibold text-text-2">
              {inputs("message")}
              <span className="text-destructive">*</span>
            </Label>
            <Textarea
              name="message"
              id="message"
              placeholder={inputs("message")}
              className="h-32"
              disabled={isLoading}
            />
          </div>
          <Button isLoading={isLoading} type="submit">
            {inputs("send")}
          </Button>
        </form>
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
