// app/join/member/page.js
import JoinPageContent from "@/components/JoinPageContent";
import { getChurch, getStrapiMedia } from "@/lib/strapi";

export const metadata = { title: "Become a Member" };

export default async function MemberPage() {
  const church = await getChurch();

  return (
    <JoinPageContent
      heading="Become a Part of Our Church Family"
      image={getStrapiMedia(church?.memberImage?.url)}
      introEnglish={church?.memberIntroEnglish}
      introTelugu={church?.memberIntroTelugu}
      formUrl={church?.memberFormUrl}
      buttonLabel="Become a Member"
    />
  );
}