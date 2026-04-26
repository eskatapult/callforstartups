export const dynamic = "force-dynamic";

import { getClientConfig } from "@/lib/config";
import Topbar from "@/components/Topbar";
import Hero from "@/components/Hero";
import Criteria from "@/components/Criteria";
import ApplyDivider from "@/components/ApplyDivider";
import ApplicationForm from "@/components/ApplicationForm";

export default function Page() {
  const config = getClientConfig();
  return (
    <>
      <Topbar />
      <main className="shell">
        <Hero />
        <Criteria />
        <ApplyDivider />
        <ApplicationForm config={config} />
      </main>
    </>
  );
}
