import type { ReactNode } from "react";

export default function AdminAuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <div className="main-container">
        <div className="">{children}</div>
      </div>
    </div>
  );
}
