"use client";

import React, { ReactNode } from "react";
import { clsx } from "clsx";

export interface GlassPanelProps {
  title?: string;
  icon?: ReactNode;
  badge?: ReactNode;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
  headerClassName?: string;
}

export default function GlassPanel({
  title,
  icon,
  badge,
  action,
  children,
  className,
  headerClassName,
}: GlassPanelProps) {
  return (
    <section
      className={clsx(
        "glass-panel p-5 rounded-2xl border border-white/10 flex flex-col justify-between overflow-hidden relative",
        className
      )}
    >
      {/* Optional Top Panel Header */}
      {title && (
        <div
          className={clsx(
            "flex items-center justify-between pb-3.5 mb-4 border-b border-white/10",
            headerClassName
          )}
        >
          <div className="flex items-center space-x-2.5">
            {icon && (
              <div className="p-1.5 rounded-lg bg-white/5 border border-white/10 text-[#5EE0FF]">
                {icon}
              </div>
            )}
            <h3 className="font-display font-semibold text-sm md:text-base text-white tracking-tight">
              {title}
            </h3>
            {badge && <div>{badge}</div>}
          </div>
          {action && <div>{action}</div>}
        </div>
      )}

      {/* Main Panel Content Body */}
      <div className="flex-1 w-full">{children}</div>
    </section>
  );
}
