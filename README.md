# Metrópole Imóveis

Plataforma imobiliária full stack (Next.js App Router + TypeScript) para a Metrópole Imóveis, em Uberlândia - MG. Inclui área pública de divulgação de imóveis e área administrativa completa, com autenticação, RBAC, auditoria, upload para object storage S3 e uma API de integração para o agente de WhatsApp (Axel).

## Stack

Next.js (App Router) · TypeScript · TailwindCSS · shadcn/ui · Redux Toolkit + Persist · SWR · Axios · React Hook Form + Zod · Prisma ORM · PostgreSQL · Better Auth · Redis · S3-compatible storage.

## Arquitetura

Organização modular por domínio em `src/modules/*` (auth, houses, clients, favorites, audit, whatsapp), cada um com `components/`, `hooks/`, `services/`, `repository/`, `dto/`, `validators/` e `types/`. Infraestrutura compartilhada em `src/lib/*` (Prisma client, Redis, S3, Better Auth, sessão/RBAC, rate limit).

## Como rodar

1. Instale as dependências:

   ```bash
   npm install
   ```

2. Configure o `.env` (já preenchido neste repositório com as credenciais fornecidas). Veja `.env.example` para a lista de variáveis.

3. Gere o client do Prisma e aplique as migrações (já aplicadas neste ambiente):

   ```bash
   npx prisma generate
   npx prisma migrate dev
   ```

4. (Opcional) Popule categorias e imóveis de demonstração:

   ```bash
   npm run db:seed
   ```

5. Suba o servidor de desenvolvimento (porta 8901):

   ```bash
   npm run dev
   ```

   Acesse http://localhost:8901.

6. Para build de produção:

   ```bash
   npm run build
   npm run start
   ```

## Criando o primeiro administrador

Cadastre-se em `/admin/signup` (o papel padrão é `AGENT`) e promova a conta a `ADMIN` com:

```bash
npx tsx scripts/promote-admin.ts seu-email@exemplo.com
```

## Scripts úteis

- `npm run dev` — desenvolvimento (porta 8901, Turbopack)
- `npm run build` / `npm run start` — build e start de produção
- `npm run lint` — ESLint
- `npm run db:seed` — popular categorias e imóveis de demonstração
- `npm run db:migrate` — `prisma migrate dev`
- `npm run db:studio` — `prisma studio`

## Integração WhatsApp (Axel)

Rotas em `/api/whatsapp/*` autenticadas via `Authorization: Bearer <AXEL_API_KEY>` (variável de ambiente). Permitem busca de imóveis em linguagem natural, atualização de metadados do cliente, registro de interesse e consulta de histórico.
