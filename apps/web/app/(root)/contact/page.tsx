import ContactInfo from "./contact-info";
import ContactForm from "./contact-form";
import { getCompanyProfile } from "@/actions/company-profile-action";

const ContactPage = async () => {
  let companyInfo = null;

  try {
    const data = await getCompanyProfile();
    if (data) {
      companyInfo = {
        ...data,
        createdAt: data.createdAt?.toString() || "",
        updatedAt: data.updatedAt?.toString() || "",
      };
    }
  } catch (error) {
    console.error("Error fetching company profile:", error);
    companyInfo = null;
  }

  return (
    <div className="bg-linear-to-b from-gray-50 to-white pt-24">
      <section className="mx-auto max-w-7xl px-4 py-16 md:py-24 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-5 gap-8">
          {/* Contact Form */}
          <div className="lg:col-span-3">
            <div className="bg-white border-slate-200 rounded-2xl p-4 md:p-6  border">
              <h3 className="text-xl font-bold text-gray-900 mb-8">
                Send us a Message
              </h3>
              <ContactForm />
            </div>
          </div>
          {/* Contact Info Sidebar */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-gray-900 rounded-2xl p-6 text-white shadow-xl">
              <ContactInfo companyInfo={companyInfo} />
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      {companyInfo?.googleMap && (
        <section className="w-full">
          <iframe
            src={
              companyInfo.googleMap.includes("src=")
                ? companyInfo.googleMap.match(/src="([^"]+)"/)?.[1]
                : companyInfo.googleMap
            }
            loading="lazy"
            className="w-full h-[500px] border-t border-gray-200"
          ></iframe>
        </section>
      )}
    </div>
  );
};

export default ContactPage;
