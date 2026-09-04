begin;
select plan(2);

insert into auth.users (id, email, raw_user_meta_data) values
  ('77777777-0000-0000-0000-0000000000b1','pv1@example.com','{"role":"PROVIDER","first_name":"Pe","last_name":"One"}'),
  ('77777777-0000-0000-0000-0000000000c1','pv2@example.com','{"role":"CLIENT","first_name":"Ce","last_name":"One"}');

update public.provider_profiles
   set is_verified = true
 where user_id = '77777777-0000-0000-0000-0000000000b1';

-- The discovery surface exposes the provider's user id so a client can open a
-- messaging thread from a booking without reading the private provider row.
select has_column(
  'public'::name, 'public_provider_profiles'::name, 'user_id'::name,
  'public_provider_profiles exposes user_id');

-- The client-facing path is the security-definer search_providers RPC (the
-- security_invoker view itself stays protected by base-table RLS).
set local role authenticated;
set local request.jwt.claims = '{"sub":"77777777-0000-0000-0000-0000000000c1","role":"authenticated"}';
select is(
  (
    select provider.user_id::uuid
    from public.search_providers(null) provider
    where provider.user_id = '77777777-0000-0000-0000-0000000000b1'
  ),
  '77777777-0000-0000-0000-0000000000b1'::uuid,
  'a client can read the booked provider''s user id through the discovery RPC');
reset role;

select * from finish();
rollback;