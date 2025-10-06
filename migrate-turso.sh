#!/bin/bash

# Script para aplicar migrações no banco Turso
# Uso: ./migrate-turso.sh

echo "🔄 Aplicando migrações no Turso..."

# Verifica se as variáveis estão definidas
if [ -z "$TURSO_DATABASE_URL" ] || [ -z "$TURSO_AUTH_TOKEN" ]; then
  echo "❌ Erro: TURSO_DATABASE_URL e TURSO_AUTH_TOKEN devem estar definidos"
  echo "Configure-os no arquivo .env ou .env.local"
  exit 1
fi

# Gera o Prisma Client
echo "📦 Gerando Prisma Client..."
npx prisma generate

# Aplica as migrações
echo "🚀 Aplicando migrações..."
npx prisma migrate deploy

echo "✅ Migrações aplicadas com sucesso!"
