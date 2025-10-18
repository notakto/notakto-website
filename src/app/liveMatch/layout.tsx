import type { ReactNode } from "react";

export const metadata = {
  title: "Live Match | Notakto",
  description:
    "Play Notakto live — the unique X-only tic-tac-toe game! Challenge opponents in real time and see who lasts longest.",
};

export default function LiveMatchLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
