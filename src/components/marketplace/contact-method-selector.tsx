"use client";

import { ChevronDown } from "lucide-react";
import { useMemo, useState } from "react";

type ContactMethod = "whatsapp" | "telegramUsername" | "telegramNumber";

type ContactMethodSelectorProps = {
  initialWhatsappNumber?: string | null;
  initialTelegramUsername?: string | null;
  initialTelegramNumber?: string | null;
  fieldClassName: string;
};

const contactOptions: Array<{
  id: ContactMethod;
  label: string;
  name: "whatsapp_number" | "telegram_username" | "telegram_number";
  placeholder: string;
  pattern?: string;
}> = [
  {
    id: "whatsapp",
    label: "WhatsApp number",
    name: "whatsapp_number",
    placeholder: "+447520603830",
    pattern: "^\\+[1-9]\\d{7,18}$",
  },
  {
    id: "telegramUsername",
    label: "Telegram username",
    name: "telegram_username",
    placeholder: "@ConsoleMark_com",
  },
  {
    id: "telegramNumber",
    label: "Telegram number",
    name: "telegram_number",
    placeholder: "+447520603830",
    pattern: "^\\+[1-9]\\d{7,18}$",
  },
];

export function ContactMethodSelector({
  initialWhatsappNumber,
  initialTelegramUsername,
  initialTelegramNumber,
  fieldClassName,
}: ContactMethodSelectorProps) {
  const initialMethods = useMemo(() => {
    const methods: ContactMethod[] = [];

    if (initialWhatsappNumber) {
      methods.push("whatsapp");
    }

    if (initialTelegramUsername) {
      methods.push("telegramUsername");
    }

    if (initialTelegramNumber) {
      methods.push("telegramNumber");
    }

    return methods;
  }, [initialWhatsappNumber, initialTelegramUsername, initialTelegramNumber]);
  const [selectedMethods, setSelectedMethods] =
    useState<ContactMethod[]>(initialMethods);
  const selectedLabels = contactOptions
    .filter((option) => selectedMethods.includes(option.id))
    .map((option) => option.label);
  const summary =
    selectedLabels.length > 0
      ? selectedLabels.join(", ")
      : "Choose contact method";

  function toggleMethod(method: ContactMethod, checked: boolean) {
    setSelectedMethods((current) =>
      checked
        ? Array.from(new Set([...current, method]))
        : current.filter((item) => item !== method),
    );
  }

  function getInitialValue(method: ContactMethod) {
    if (method === "whatsapp") {
      return initialWhatsappNumber ?? "";
    }

    if (method === "telegramUsername") {
      return initialTelegramUsername ?? "";
    }

    return initialTelegramNumber ?? "";
  }

  return (
    <div className="grid gap-4">
      <div className="grid gap-2">
        <p className="text-base leading-none">How should we contact you?</p>
        <details className="group relative">
          <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between gap-3 rounded-full border border-black/15 bg-white px-5">
            <span className="truncate text-left">{summary}</span>
            <ChevronDown
              className="h-4 w-4 shrink-0 transition group-open:rotate-180"
              aria-hidden="true"
            />
          </summary>
          <div className="mt-2 grid gap-2 rounded-[22px] border border-black/10 bg-white p-3 shadow-xl">
            {contactOptions.map((option) => (
              <label
                key={option.id}
                className="flex min-h-11 cursor-pointer items-center gap-3 rounded-[16px] px-3 py-2 transition hover:bg-neutral-50"
              >
                <input
                  type="checkbox"
                  checked={selectedMethods.includes(option.id)}
                  onChange={(event) =>
                    toggleMethod(option.id, event.target.checked)
                  }
                  className="h-4 w-4 accent-black"
                />
                <span>{option.label}</span>
              </label>
            ))}
          </div>
        </details>
        <p className="text-xs leading-5 text-black/45">
          Select one or more contact methods, then fill in the fields shown
          below.
        </p>
      </div>

      <div className="grid gap-4">
        {contactOptions.map((option) =>
          selectedMethods.includes(option.id) ? (
            <label key={option.id} className="grid gap-2">
              <span className="text-sm text-black/55">{option.label}</span>
              <input
                name={option.name}
                pattern={option.pattern}
                defaultValue={getInitialValue(option.id)}
                className={fieldClassName}
                placeholder={option.placeholder}
              />
            </label>
          ) : (
            <input key={option.id} type="hidden" name={option.name} value="" />
          ),
        )}
      </div>
    </div>
  );
}
