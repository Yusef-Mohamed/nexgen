import { Metadata } from "next";
import { getMetadataContactPage } from "@/getMetaData";

import ContactForm from "./components/ContactForm";
import ContactCols from "./components/ContactCols";
export async function generateMetadata(
  props: {
    params: Promise<{ locale: string }>;
  }
): Promise<Metadata> {
  const params = await props.params;
  return getMetadataContactPage({
    params,
  });
}

const ContactPage = async (props: { params: Promise<{ locale: string }> }) => {
  const params = await props.params;
  
  return (
    <main>
      <ContactForm />
      <ContactCols />
    </main>
  );
};

export default ContactPage;
