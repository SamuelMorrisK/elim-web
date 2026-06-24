// app/join/visitor/page.js
import JoinPageContent from "@/components/JoinPageContent";
import { getChurch, getStrapiMedia } from "@/lib/strapi";

export const metadata = { title: "We're Glad You Came" };

export default async function VisitorPage() {
  const church = await getChurch();

  return (
    <JoinPageContent
       eyebrow="Stay Connected"
      heading="We're Glad You Came"
      image={getStrapiMedia(church?.visitorImage?.url)}
      introEnglish={church?.visitorIntroEnglish}
      introTelugu={church?.visitorIntroTelugu}
      formUrl={church?.visitorFormUrl}
      buttonLabel="Share Your Details"
    />
  );
}