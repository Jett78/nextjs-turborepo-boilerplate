import { getCompanyProfile } from "@/actions/company-profile-action";
import { getNavigationItems } from "@/actions/navigation-action";
import { NavbarClient } from "./navbar-client";

export async function Navbar() {
  const [company, navItems] = await Promise.all([
    getCompanyProfile(),
    getNavigationItems(),
  ]);

  return <NavbarClient company={company} navItems={navItems} />;
}
