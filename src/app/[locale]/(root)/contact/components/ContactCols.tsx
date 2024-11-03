import { useTranslations } from "next-intl";
import { FaTelegramPlane, FaWhatsapp } from "react-icons/fa";
import { MdOutlineMail } from "react-icons/md";

const ContactCols = () => {
  const text = useTranslations("contact");
  return (
    <section className="container grid md:grid-cols-2 lg:grid-cols-3 secPadding gap-6 sm:gap-12">
      <div>
        <div className="flex items-center justify-center w-12 h-12 text-2xl rounded-full sm:w-14 sm:h-14 sm:text-3xl text-primary">
          <MdOutlineMail />
        </div>
        <h3 className="h2-5 mt-3 sm:mt-6">{text("email")}</h3>
        <p className="my-2 sm:my-4">{text("emailDescription")}</p>
        <a
          className="underline text-primary"
          href="mailto:nexgensupprot@gmail.com"
        >
          {text("supportEmail")}
        </a>
      </div>
      <div>
        <div className="flex items-center justify-center w-12 h-12 text-2xl rounded-full sm:w-14 sm:h-14 sm:text-3xl text-primary">
          <FaTelegramPlane />
        </div>
        <h3 className="h2-5 mt-3 sm:mt-6">{text("telegram")}</h3>
        <p className="my-2 sm:my-4">{text("telegramDescription")}</p>
        <a className="underline text-primary" href="https://t.me/nexgensupport">
          {text("supportTelegram")}
        </a>
      </div>
      <div>
        <div className="flex items-center justify-center w-12 h-12 text-2xl rounded-full sm:w-14 sm:h-14 sm:text-3xl text-[#20B038]">
          <FaWhatsapp />
        </div>
        <h3 className="h2-5 mt-3 sm:mt-6">{text("whatsapp")}</h3>
        <p className="my-2 sm:my-4">{text("whatsappDescription")}</p>
        <a
          className="underline text-primary"
          href="https://wa.me/+972593442082"
        >
          {text("supportWhatsapp")}
        </a>
      </div>
    </section>
  );
};

export default ContactCols;
