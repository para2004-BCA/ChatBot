-- Enable RLS
alter table public.chats enable row level security;
alter table public.messages enable row level security;

-- Policies for chats
create policy if not exists chats_select_own on public.chats
  for select using (user_id = current_setting('hasura.user', true)::json->>'x-hasura-user-id');

create policy if not exists chats_insert_self on public.chats
  for insert with check (user_id = current_setting('hasura.user', true)::json->>'x-hasura-user-id');

create policy if not exists chats_update_own on public.chats
  for update using (user_id = current_setting('hasura.user', true)::json->>'x-hasura-user-id');

create policy if not exists chats_delete_own on public.chats
  for delete using (user_id = current_setting('hasura.user', true)::json->>'x-hasura-user-id');

-- Policies for messages: Only messages in user's chats; users can update/delete their own user messages
create policy if not exists messages_select_own on public.messages
  for select using (
    exists (
      select 1 from public.chats c where c.id = messages.chat_id
      and c.user_id = current_setting('hasura.user', true)::json->>'x-hasura-user-id'
    )
  );

create policy if not exists messages_insert_in_own_chat on public.messages
  for insert with check (
    exists (
      select 1 from public.chats c where c.id = messages.chat_id
      and c.user_id = current_setting('hasura.user', true)::json->>'x-hasura-user-id'
    )
  );

create policy if not exists messages_update_own_user on public.messages
  for update using (
    user_id = current_setting('hasura.user', true)::json->>'x-hasura-user-id'
    and role = 'user'
  );

create policy if not exists messages_delete_own on public.messages
  for delete using (
    user_id = current_setting('hasura.user', true)::json->>'x-hasura-user-id'
  );

-- updated_at trigger for chats
create or replace function public.set_updated_at() returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists set_chats_updated_at on public.chats;
create trigger set_chats_updated_at
  before update on public.chats
  for each row execute function public.set_updated_at();