import { getCompanyProfile } from "@/actions/company-profile-action";
import { NavbarClient } from "./navbar-client";

export async function Navbar() {
  const company = await getCompanyProfile();

  return <NavbarClient company={company} />;
}
