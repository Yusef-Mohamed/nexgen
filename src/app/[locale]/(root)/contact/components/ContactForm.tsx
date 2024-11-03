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
      .sendForm("service_fshk8zk", "template_oiad10m", form.current, {
        publicKey: "reEgbrdQEZu5u5bH9",
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
    <section className="grid lg:grid-cols-2 gap-20 container secPadding">
      <div>
        <h1 className="h1-5 mb-2 md:mb-4">{text("contactFormTitle")}</h1>
        <p
          className="h5 text-text-2 font-normal"
          style={{
            fontWeight: 400,
          }}
        >
          {text("contactFormDescription")}
        </p>
        <form ref={form} className="space-y-4 mt-6" onSubmit={sendEmail}>
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
      <div className="relative max-lg:hidden rounded-3xl overflow-hidden    ">
        <div className="bg-[#011F4333] absolute w-full h-full" />
        <Image
          src="/images/contact.jpeg"
          alt="Contact"
          width={1000}
          height={1000}
          className="w-full h-full object-cover"
        />
      </div>
    </section>
  );
};

export default ContactForm;
