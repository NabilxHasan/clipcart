-- get_user_role is SECURITY DEFINER and was callable through the public REST API
-- (/rest/v1/rpc/get_user_role) by anyone, which let a caller look up any user's role by id.
-- The app reads the database with the service role, so browsers never need this function.
-- RLS policies that call it still deny anon/authenticated access (now with a permission error
-- instead of an empty result), which is the intended outcome.

alter function public.get_user_role(uuid) set search_path = public, pg_temp;

revoke execute on function public.get_user_role(uuid) from public;
revoke execute on function public.get_user_role(uuid) from anon;
revoke execute on function public.get_user_role(uuid) from authenticated;
grant execute on function public.get_user_role(uuid) to service_role;
