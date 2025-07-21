"use client";

import { useEffect, useRef, useState } from "react";
import api from "../../lib/api";
import JobCard from "../../components/JobCard";
import { Tabs, Tab } from "react-bootstrap";
import { useRouter, usePathname } from "next/navigation";
import Cookies from "js-cookie";

export default function JobsPage() {
  const token = Cookies.get("token");
  const router = useRouter();
  const pathname = usePathname();

  const limit = 10;
  const containerRef = useRef(null);
  const [jobsMap, setJobsMap] = useState({});
  const [loadedPages, setLoadedPages] = useState(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const activeTab = pathname.includes("logs") ? "logs" : "jobs";

  useEffect(() => {
    if (!token) {
      router.push("/");
    } else {
      setIsAuthenticated(true);
      fetchJobs(currentPage);
    }
  }, []);

  const fetchJobs = async (pageToLoad) => {
    if (
      isLoading ||
      loadedPages.has(pageToLoad) ||
      (totalPages && pageToLoad > totalPages) ||
      pageToLoad < 1
    )
      return;

    setIsLoading(true);
    try {
      const res = await api.get("/job/getAllJobs", {
        params: { page: pageToLoad, limit },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.data.success) {
        const newPageData = res.data.data;
        setJobsMap((prev) => ({
          ...prev,
          [pageToLoad]: newPageData,
        }));
        setLoadedPages((prev) => new Set(prev).add(pageToLoad));
        setTotalPages(res.data.pagination.totalPages);
      }
    } catch (err) {
      console.error(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleScroll = () => {
    const el = containerRef.current;
    if (!el) return;

    const { scrollTop, scrollHeight, clientHeight } = el;

    const atBottom = scrollTop + clientHeight >= scrollHeight - 50;
    const atTop = scrollTop <= 50;

    if (atBottom && currentPage < totalPages) {
      const nextPage = currentPage + 1;
      fetchJobs(nextPage);
      setCurrentPage(nextPage);
    }

    if (atTop && currentPage > 1) {
      const prevPage = currentPage - 1;
      fetchJobs(prevPage);
      setCurrentPage(prevPage);
    }
  };

  if (!isAuthenticated) return null;

  const combinedJobs = Object.keys(jobsMap)
    .sort((a, b) => a - b)
    .flatMap((page) => jobsMap[page]);

  return (
    <main
      className="container py-4"
      ref={containerRef}
      onScroll={handleScroll}
      style={{ height: "90vh", overflowY: "auto" }}
    >
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

      {combinedJobs.length === 0 && !isLoading ? (
        <p>No jobs found.</p>
      ) : (
        combinedJobs.map((job) => (
          <JobCard key={job.jobUuid + job.jobId} job={job} />
        ))
      )}

      {isLoading && <p className="text-center text-muted">Loading...</p>}
      <p className="text-center text-muted">
        Loaded Pages: {[...loadedPages].sort((a, b) => a - b).join(", ")}
      </p>
    </main>
  );
}
