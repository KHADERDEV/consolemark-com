import {
  availabilityOptions,
  consoleTypeOptions,
  getAvailabilityLabel,
  getConsoleTypeLabel,
  type RentConsole,
} from "@/lib/rent-consoles";

type ListingFormProps = {
  consoleItem?: RentConsole;
};

const defaultImageUrl =
  "https://res.cloudinary.com/destej60y/image/upload/v1783282724/edcac0a1-9a74-4107-821d-755169b5f27e.png";

export function ListingForm({ consoleItem }: ListingFormProps) {
  const isEditing = consoleItem !== undefined;
  const action = consoleItem
    ? `/api/admin/rent-consoles/${consoleItem.id}`
    : "/api/admin/rent-consoles";

  return (
    <form
      action={action}
      method="post"
      className="grid gap-4 rounded-[24px] border border-black/10 bg-white p-5"
    >
      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Name" name="name" defaultValue={consoleItem?.name} />
        <Field
          label="Country Code"
          name="country_code"
          defaultValue={consoleItem?.country_code ?? "US"}
          maxLength={3}
        />
        <label className="grid gap-2 text-sm">
          <span className="font-lilita">Console Type</span>
          <select
            name="console_type"
            defaultValue={consoleItem?.console_type ?? "personal"}
            className="h-11 rounded-full border border-black/15 bg-white px-4 outline-none focus:border-black"
          >
            {consoleTypeOptions.map((option) => (
              <option key={option} value={option}>
                {getConsoleTypeLabel(option)}
              </option>
            ))}
          </select>
        </label>
        <Field
          label="Creation Year"
          name="creation_year"
          type="number"
          defaultValue={consoleItem?.creation_year ?? 2026}
        />
        <label className="grid gap-2 text-sm">
          <span className="font-lilita">Availability</span>
          <select
            name="availability_status"
            defaultValue={
              consoleItem?.availability_status ?? "available_for_rent"
            }
            className="h-11 rounded-full border border-black/15 bg-white px-4 outline-none focus:border-black"
          >
            {availabilityOptions.map((option) => (
              <option key={option} value={option}>
                {getAvailabilityLabel(option)}
              </option>
            ))}
          </select>
        </label>
        <Field
          label="Live Price"
          name="live_price"
          type="number"
          step="0.01"
          defaultValue={consoleItem?.live_price ?? "40.00"}
        />
        <Field
          label="Weekly Price"
          name="weekly_price"
          type="number"
          step="0.01"
          defaultValue={consoleItem?.weekly_price ?? "40.00"}
        />
        <Field
          label="Transfer Apps Price"
          name="transfer_apps_price"
          type="number"
          step="0.01"
          defaultValue={consoleItem?.transfer_apps_price ?? "60.00"}
        />
        <Field
          label="Sort Order"
          name="sort_order"
          type="number"
          defaultValue={consoleItem?.sort_order ?? 10}
        />
      </div>

      <Field
        label="Image URL"
        name="image_url"
        type="url"
        defaultValue={consoleItem?.image_url ?? defaultImageUrl}
      />
      <Field
        label="Console URL"
        name="console_url"
        type="url"
        defaultValue={
          consoleItem?.console_url ??
          "https://play.google.com/store/apps/dev?id=8228837381578415347"
        }
      />
      <Field
        label="Owner Name"
        name="owner_name"
        defaultValue={consoleItem?.owner_name ?? "Console Mark"}
      />

      <div className="grid gap-3 sm:grid-cols-3">
        <CheckboxField
          label="Show Price Cents"
          name="show_price_cents"
          defaultChecked={consoleItem?.show_price_cents ?? true}
        />
        <CheckboxField
          label="Draft Access Available"
          name="draft_access_available"
          defaultChecked={consoleItem?.draft_access_available ?? true}
        />
        <CheckboxField
          label="Transfer Apps Available"
          name="transfer_apps_available"
          defaultChecked={consoleItem?.transfer_apps_available ?? true}
        />
        <CheckboxField
          label="Published"
          name="is_published"
          defaultChecked={consoleItem?.is_published ?? true}
        />
      </div>

      <div className="flex flex-wrap gap-3">
        <button
          type="submit"
          className="font-lilita rounded-full bg-black px-6 py-3 text-sm text-white transition hover:bg-black/85"
        >
          {isEditing ? "Save Listing" : "Create Listing"}
        </button>
      </div>
    </form>
  );
}

function Field({
  label,
  name,
  type = "text",
  defaultValue,
  step,
  maxLength,
}: {
  label: string;
  name: string;
  type?: string;
  defaultValue?: string | number | null;
  step?: string;
  maxLength?: number;
}) {
  return (
    <label className="grid gap-2 text-sm">
      <span className="font-lilita">{label}</span>
      <input
        name={name}
        type={type}
        required={type !== "number" || name !== "transfer_apps_price"}
        step={step}
        maxLength={maxLength}
        defaultValue={defaultValue ?? ""}
        className="h-11 rounded-full border border-black/15 bg-white px-4 outline-none focus:border-black"
      />
    </label>
  );
}

function CheckboxField({
  label,
  name,
  defaultChecked,
}: {
  label: string;
  name: string;
  defaultChecked: boolean;
}) {
  return (
    <label className="flex min-h-11 items-center gap-3 rounded-full border border-black/10 px-4 text-sm">
      <input
        name={name}
        type="checkbox"
        defaultChecked={defaultChecked}
        className="h-4 w-4 accent-black"
      />
      <span className="font-semibold">{label}</span>
    </label>
  );
}
