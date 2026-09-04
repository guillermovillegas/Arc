-- Messaging v1: clients need the provider's user id to open a conversation,
-- but the public discovery view never exposed it. Add it to the view (safe:
-- it is already a user-facing identifier used by messaging and bookings) and
-- keep the publication rule identical. search_providers returns the view's
-- rowtype, so it must be recreated after the column change.

drop function if exists public.search_providers(
  text, public.service_category, double precision, double precision,
  double precision, integer, integer
);

drop view public.public_provider_profiles;

create view public.public_provider_profiles
with (security_invoker = true)
as
select
  provider.id,
  provider.slug,
  provider.user_id,
  provider.business_name,
  provider.bio,
  provider.service_radius,
  provider.latitude,
  provider.longitude,
  provider.is_verified,
  provider.average_rating,
  provider.total_reviews,
  profile.first_name,
  profile.last_name,
  profile.avatar_url
from public.provider_profiles as provider
join public.profiles as profile on profile.id = provider.user_id
where profile.is_active = true
  and provider.is_verified = true;

create or replace function public.search_providers(
  p_text text default null,
  p_category public.service_category default null,
  p_lat double precision default null,
  p_lng double precision default null,
  p_radius_km double precision default null,
  p_limit integer default 20,
  p_offset integer default 0
) returns setof public.public_provider_profiles
language sql stable security definer set search_path = '' as $$
  select v.*
  from public.public_provider_profiles v
  where (
      p_category is null
      or exists (
        select 1 from public.services s
        where s.provider_profile_id = v.id and s.is_active and s.category = p_category
      )
    )
    and (
      p_text is null
      or v.business_name ilike '%' || p_text || '%'
      or (coalesce(v.first_name,'') || ' ' || coalesce(v.last_name,'')) ilike '%' || p_text || '%'
      or v.bio ilike '%' || p_text || '%'
    )
    and (
      p_lat is null or p_lng is null or p_radius_km is null
      or (
        v.latitude is not null and v.longitude is not null
        and extensions.st_dwithin(
              extensions.st_makepoint(v.longitude, v.latitude)::extensions.geography,
              extensions.st_makepoint(p_lng, p_lat)::extensions.geography,
              p_radius_km * 1000)
      )
    )
  order by
    case
      when p_lat is not null and p_lng is not null and v.latitude is not null
      then extensions.st_distance(
             extensions.st_makepoint(v.longitude, v.latitude)::extensions.geography,
             extensions.st_makepoint(p_lng, p_lat)::extensions.geography)
      else null
    end asc nulls last,
    v.average_rating desc
  limit least(greatest(p_limit, 0), 100) offset greatest(p_offset, 0);
$$;
grant execute on function public.search_providers(text, public.service_category, double precision, double precision, double precision, integer, integer) to anon, authenticated;