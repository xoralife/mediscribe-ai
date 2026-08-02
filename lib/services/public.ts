import { http } from "@/lib/http";
import type { ContactMessage, ContactMessageCreate, PublicDoctor } from "@/lib/types";

/* Public landing-page directory of approved doctors — no auth required. */
export async function publicDoctors(): Promise<PublicDoctor[]> {
  const { data } = await http.get<PublicDoctor[]>("/public/doctors");
  return data;
}

/* Send a contact message to a doctor from the landing-page form — no auth required. */
export async function sendContactMessage(payload: ContactMessageCreate): Promise<ContactMessage> {
  const { data } = await http.post<ContactMessage>("/public/contact", payload);
  return data;
}
