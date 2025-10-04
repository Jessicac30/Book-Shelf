# 🚀 Guia de Deploy - BookShelf

Este guia mostra como fazer o deploy do projeto na Vercel (recomendado) ou em outras plataformas.

## 📋 Pré-requisitos

- ✅ Conta no GitHub (para hospedar o código)
- ✅ Conta na Vercel (gratuita - https://vercel.com)
- ✅ Projeto commitado no Git

---

## 🎯 Opção 1: Deploy na Vercel (Recomendado)

### Passo 1: Preparar o Repositório

```bash
# Se ainda não tem repositório remoto
git remote add origin https://github.com/seu-usuario/bookshelf.git

# Fazer commit das mudanças
git add .
git commit -m "Preparar para deploy"
git push -u origin main
```

### Passo 2: Conectar com a Vercel

1. Acesse: https://vercel.com
2. Clique em **"Add New Project"**
3. Importe seu repositório do GitHub
4. A Vercel detecta automaticamente que é Next.js

### Passo 3: Configurar Variáveis de Ambiente

Na página de configuração do projeto na Vercel, adicione:

**Environment Variables:**
```
DATABASE_URL=file:./dev.db
NEXT_PUBLIC_BASE_URL=https://seu-projeto.vercel.app
```

**Opcional (para aumentar rate limit da Google Books API):**
```
GOOGLE_BOOKS_API_KEY=sua_chave_aqui
```

### Passo 4: Deploy

- Clique em **"Deploy"**
- Aguarde 2-3 minutos
- ✅ Pronto! Sua aplicação está no ar!

**URL gerada:** `https://seu-projeto.vercel.app`

---

## ⚠️ IMPORTANTE: Limitações do SQLite na Vercel

O SQLite funciona no deploy da Vercel, **MAS** tem limitações:

### ❌ Problema:
- Vercel usa **file system efêmero** (dados são perdidos após ~12h de inatividade)
- Não é recomendado para produção com dados persistentes

### ✅ Soluções:

#### Opção A: Usar Vercel Postgres (Recomendado para Produção)

1. No painel da Vercel, vá em **"Storage" > "Create Database"**
2. Escolha **"Postgres"**
3. Copie a `DATABASE_URL` fornecida
4. Atualize o `schema.prisma`:

```prisma
datasource db {
  provider = "postgresql"  // Mudou de sqlite para postgresql
  url      = env("DATABASE_URL")
}
```

5. Rode localmente:
```bash
npm run db:generate
npm run db:migrate
```

6. Faça commit e push:
```bash
git add .
git commit -m "Migrar para PostgreSQL"
git push
```

#### Opção B: Usar Turso (SQLite na nuvem - GRATUITO)

1. Acesse: https://turso.tech
2. Crie um banco de dados
3. Copie a `DATABASE_URL` (formato: `libsql://...`)
4. Configure no Vercel:
```
DATABASE_URL=libsql://seu-banco.turso.io
TURSO_AUTH_TOKEN=seu_token
```

5. Atualize o `schema.prisma`:
```prisma
datasource db {
  provider = "sqlite"
  url      = env("DATABASE_URL")
}
```

#### Opção C: Para Testes (SQLite local - dados temporários)

Se é só para testar/demonstração, pode deixar SQLite mesmo. Os dados serão resetados periodicamente.

---

## 🎯 Opção 2: Deploy Manual

### Netlify

```bash
# Instalar Netlify CLI
npm install -g netlify-cli

# Login
netlify login

# Deploy
netlify deploy --prod
```

### Railway

1. Acesse: https://railway.app
2. Conecte seu repositório GitHub
3. Configure as variáveis de ambiente
4. Deploy automático!

---

## 🔧 Configurações Pós-Deploy

### Domínio Customizado

Na Vercel:
1. Vá em **Settings > Domains**
2. Adicione seu domínio (ex: `meulivros.com`)
3. Configure DNS conforme instruções

### Analytics (Opcional)

```bash
npm install @vercel/analytics
```

Em `app/layout.tsx`:
```typescript
import { Analytics } from '@vercel/analytics/react'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
```

---

## 🐛 Troubleshooting

### Erro: "Prisma Client não gerado"
```bash
# Adicione ao package.json (já foi adicionado):
"postinstall": "prisma generate"
```

### Erro: "DATABASE_URL not found"
- Verifique se a variável está configurada na Vercel
- Vai em Settings > Environment Variables

### Build falha
```bash
# Teste localmente primeiro:
npm run build

# Se funcionar local mas falhar na Vercel:
# 1. Limpe o cache da Vercel
# 2. Tente fazer redeploy
```

### Dados sendo perdidos
- SQLite na Vercel é efêmero
- Use Postgres ou Turso (ver Opção A/B acima)

---

## 📊 Monitoramento

### Ver Logs

Na Vercel:
1. Vá em **"Deployments"**
2. Clique no deploy
3. Clique em **"View Function Logs"**

### Erro 500?
```bash
# Ver logs em tempo real:
vercel logs seu-projeto --follow
```

---

## ✅ Checklist Pré-Deploy

- [ ] Todas as dependências instaladas
- [ ] Build passa localmente (`npm run build`)
- [ ] Variáveis de ambiente configuradas
- [ ] `.gitignore` inclui `.env` e `*.db`
- [ ] Migrations do Prisma criadas
- [ ] README.md atualizado com URL de produção

---

## 🎉 Após o Deploy

1. Teste todas as funcionalidades principais
2. Adicione livros de teste
3. Teste em mobile
4. Compartilhe com os colegas!

**URL do projeto:** `https://seu-projeto.vercel.app`

---

## 📚 Recursos Úteis

- [Documentação Vercel](https://vercel.com/docs)
- [Prisma + Vercel](https://www.prisma.io/docs/guides/deployment/deployment-guides/deploying-to-vercel)
- [Next.js Deploy](https://nextjs.org/docs/deployment)
- [Turso (SQLite Cloud)](https://docs.turso.tech/)

---

**Dúvidas?** Consulte os logs da Vercel ou o README.md do projeto.
