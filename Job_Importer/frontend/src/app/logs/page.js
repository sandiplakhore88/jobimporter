"use client";
import { useEffect, useState } from "react";
import { Tabs, Tab } from "react-bootstrap";
import { useRouter, usePathname } from "next/navigation";
import LogTable from "../../components/LogTable";

export default function LogsPage() {
  const router = useRouter();
  const pathname = usePathname();

  // Set active tab based on current route
  const activeTab = pathname.includes("logs") ? "logs" : "jobs";

  return (
    <main className="container py-4">
      <Tabs
        className="mb-4 border-bottom-0"
        fill
        justify
        activeKey={activeTab}
        onSelect={(key) => {
          if (key === "jobs") router.push("/jobs");
          else if (key === "logs") router.push("/logs");
        }}
      >
        <Tab
          eventKey="jobs"
          title="All Jobs"
          tabClassName="border-0 bg-white text-primary fw-semibold"
        />
        <Tab
          eventKey="logs"
          title="All Logs"
          tabClassName="border-0 bg-white text-primary fw-semibold"
        />
      </Tabs>

      {/* Log Table */}
      <LogTable />
    </main>
  );
}
