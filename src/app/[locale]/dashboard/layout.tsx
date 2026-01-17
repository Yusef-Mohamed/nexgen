
import DashboardLayoutClient from "./DashboardLayoutClient";

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

  

  return <DashboardLayoutClient>{children}</DashboardLayoutClient>;
}
