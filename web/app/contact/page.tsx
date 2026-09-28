import type { Metadata } from "next";
import ContactPage from "./ContactPage";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Book a free cloud consultation with CloudSwift — Azure Expert MSP in Bengaluru.",
};

export default function Contact() {
  return <ContactPage />;
}
