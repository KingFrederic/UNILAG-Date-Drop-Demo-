"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { spring } from "@/lib/motion";

export function PageHeader({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action?: React.ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={spring.soft}
      className="mb-6 flex flex-wrap items-end justify-between gap-4 px-1"
    >
      <div>
        <h1 className="display-title text-[clamp(1.75rem,3.4vw,2.5rem)]">
          {title}
        </h1>
        <p className="mt-2 max-w-2xl text-[14px] leading-relaxed text-[var(--fg-muted)]">
          {description}
        </p>
      </div>
      {action}
    </motion.div>
  );
}
