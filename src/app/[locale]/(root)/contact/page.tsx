import { Metadata } from "next";
import { getMetadataContactPage } from "@/getMetaData";
import { unstable_setRequestLocale } from "next-intl/server";
import ContactForm from "./components/ContactForm";
import ContactCols from "./components/ContactCols";
export function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Metadata {
  return getMetadataContactPage({
    params,
  });
}

const ContactPage = ({ params }: { params: { locale: string } }) => {
  unstable_setRequestLocale(params.locale);
  return (
    <main>
      <ContactForm />
      <ContactCols />
    </main>
  );
};

export default ContactPage;
