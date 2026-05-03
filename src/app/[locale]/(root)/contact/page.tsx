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
  await props.params;

  return (
    <main className="max-w-full overflow-hidden">
      <ContactForm />
      <ContactCols />
    </main>
  );
};

export default ContactPage;
