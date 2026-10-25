import { cn } from "@/lib/utils";

const variants = {
  green: "bg-green-100 text-green-700",
  red: "bg-red-100 text-red-700",
  yellow: "bg-amber-100 text-amber-700",
  blue: "bg-amber-50 text-amber-800",
  gray: "bg-gray-100 text-gray-700",
  indigo: "bg-amber-100 text-amber-700",
};

export function Badge({
  children,
  variant = "gray",
}: {
  children: React.ReactNode;
  variant?: keyof typeof variants;
}) {
  return (
    <span className={cn("inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium", variants[variant])}>
      {children}
    </span>
  );
}
