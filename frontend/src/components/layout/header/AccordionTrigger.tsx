import { ChevronDown } from "lucide-react";

type AccordionTriggerProps = {
  label: string;
  isOpen: boolean;
  onToggle: () => void;
  className?: string;
  iconClassName?: string;
  size?: "lg" | "sm";
};

export function AccordionTrigger(props: AccordionTriggerProps) {
  const { label, isOpen, onToggle, className, iconClassName, size = "lg" } = props;
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-expanded={isOpen}
      className={
        className ??
        "flex w-full flex-1 items-center justify-between py-2 font-price-check text-xl leading-4 tracking-wide font-stretch-expanded transition-all select-none [&[data-state=open]>span>svg]:rotate-180"
      }
      data-state={isOpen ? "open" : "closed"}
    >
      <span className="w-full text-left">{label}</span>
      <span
        className={
          size === "lg"
            ? "hover:bg-dark-10 inline-flex size-8 items-center justify-center rounded-[7px] bg-transparent"
            : "hover:bg-dark-10 inline-flex size-6 items-center justify-center rounded-[7px] bg-transparent"
        }
      >
        <ChevronDown
          className={
            [
              iconClassName ??
                (size === "lg"
                  ? "lucide-icon lucide lucide-chevron-down size-6 rounded-md bg-pop-neutral-black p-1 text-white transition-transform duration-200"
                  : "lucide-icon lucide lucide-chevron-down size-[14px] transition-transform duration-200"),
              isOpen ? "rotate-180" : "rotate-0",
            ].join(" ")
          }
        />
      </span>
    </button>
  );
}
