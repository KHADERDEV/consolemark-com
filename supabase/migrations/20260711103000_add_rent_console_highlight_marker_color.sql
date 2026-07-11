alter table public.rent_consoles
  add column if not exists highlight_marker_color text;

alter table public.rent_consoles
  drop constraint if exists rent_consoles_highlight_marker_color_format;

alter table public.rent_consoles
  add constraint rent_consoles_highlight_marker_color_format
  check (
    highlight_marker_color is null
    or highlight_marker_color ~ '^#[0-9A-Fa-f]{6}$'
  );
