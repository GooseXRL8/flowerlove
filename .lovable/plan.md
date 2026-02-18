

# Criar Tabelas no Supabase

O problema atual e que o banco de dados Supabase esta vazio (sem tabelas), mas o codigo ja referencia 4 tabelas: `users`, `profiles`, `memories` e `profile_photos`. Isso causa todos os erros de tipo `never` no build.

## Tabelas a criar

### 1. `users`
Armazena os usuarios do app (login customizado).

| Coluna | Tipo | Detalhes |
|--------|------|----------|
| id | uuid | PK, default gen_random_uuid() |
| username | text | NOT NULL, UNIQUE |
| password | text | NOT NULL |
| is_admin | boolean | default false |
| assigned_profile_id | uuid | nullable |
| created_at | timestamptz | default now() |

### 2. `profiles`
Perfis de casais com contador de tempo.

| Coluna | Tipo | Detalhes |
|--------|------|----------|
| id | uuid | PK, default gen_random_uuid() |
| name | text | NOT NULL |
| created_by | text | NOT NULL |
| start_date | date | NOT NULL |
| custom_title | text | nullable |
| assigned_user_id | text | nullable |
| image_url | text | nullable |
| created_at | timestamptz | default now() |

### 3. `memories`
Memorias/momentos salvos por perfil.

| Coluna | Tipo | Detalhes |
|--------|------|----------|
| id | uuid | PK, default gen_random_uuid() |
| profile_id | uuid | NOT NULL, FK -> profiles(id) ON DELETE CASCADE |
| title | text | NOT NULL |
| description | text | nullable |
| memory_date | date | NOT NULL |
| location | text | nullable |
| image_url | text | nullable |
| tags | text[] | default '{}' |
| is_favorite | boolean | default false |
| created_at | timestamptz | default now() |

### 4. `profile_photos`
Galeria de fotos do perfil (max 5 por usuario).

| Coluna | Tipo | Detalhes |
|--------|------|----------|
| id | uuid | PK, default gen_random_uuid() |
| user_id | uuid | NOT NULL |
| url | text | NOT NULL |
| created_at | timestamptz | default now() |

## Seguranca (RLS)

Todas as tabelas terao RLS habilitado com politicas permissivas para `anon` e `authenticated`, pois o app usa um sistema de login customizado (nao usa Supabase Auth) -- os dados sao gerenciados pelo proprio app.

## Resultado esperado

Apos criar as tabelas:
- O arquivo `types.ts` sera regenerado automaticamente com as definicoes corretas
- Todos os erros de build (tipo `never`) serao resolvidos
- O app voltara a funcionar normalmente

