import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";


export default async function RootLayout(
  props: Readonly<{
    children: React.ReactNode;
    params: Promise<{ locale: string }>;
  }>
) {

  const params = await props.params;

  const {
    locale
  } = params;

  const {
    children
  } = props;

  

  return (
    <>
      <Header />
      <div>{children}</div>
      <Footer />
    </>
  );
}
