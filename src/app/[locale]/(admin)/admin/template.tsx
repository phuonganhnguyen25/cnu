"use client";

import { ModalProvider } from "@/components/Modal";
import { NotificationProvider } from "@/components/Notification";

export default function Template(props: any) {
  return (
    <NotificationProvider>
      <ModalProvider>{props.children}</ModalProvider>
    </NotificationProvider>
  );
}
