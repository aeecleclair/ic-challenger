"use client";

import { useSearchParams } from "next/navigation";

const Dashboard = () => {

  const searchParam = useSearchParams();
  const schoolId = searchParam.get("school_id");
  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      Schools Dashboard {schoolId && `- ${schoolId}`}
    </div>
  );
};

export default Dashboard;
