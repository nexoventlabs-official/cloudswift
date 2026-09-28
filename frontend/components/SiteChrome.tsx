"use client";
import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";
import CustomCursor from "@/components/CustomCursor";
import AIAssistant from "@/components/AIAssistant";

/**
 * Marketing-site chrome (navbar, custom cursor, AI assistant).
 * Hidden on /admin so the admin panel has its own clean shell.
 */
export default function SiteChrome() {
  const pathname = usePathname();
  if (pathname?.startsWith("/admin")) return null;
  return (
    <>
      <CustomCursor />
      <Navbar />
      <AIAssistant />
    </>
  );
}
