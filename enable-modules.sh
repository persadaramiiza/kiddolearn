#!/bin/bash
# Enable All KiddoLearn Backend Modules
# This script uncomments all disabled modules in app.module.ts

echo "🔧 Enabling all KiddoLearn backend modules..."
echo ""

# Read the app.module.ts file
APP_MODULE="src/app.module.ts"

if [ ! -f "$APP_MODULE" ]; then
    echo "❌ Error: $APP_MODULE not found!"
    exit 1
fi

# Create backup
cp "$APP_MODULE" "$APP_MODULE.backup"
echo "✅ Backup created: $APP_MODULE.backup"

# Uncomment all module imports and add TypeOrmModule
sed -i 's|// ProfilesModule,|ProfilesModule,|g' "$APP_MODULE"
sed -i 's|// VideosModule,|VideosModule,|g' "$APP_MODULE"
sed -i 's|// QuizzesModule,|QuizzesModule,|g' "$APP_MODULE"
sed -i 's|// WatchHistoryModule,|WatchHistoryModule,|g' "$APP_MODULE"
sed -i 's|// HealthModule,|HealthModule,|g' "$APP_MODULE"

echo "✅ Modules uncommented"
echo ""
echo "📝 Next steps:"
echo "1. Ensure PostgreSQL is running: docker-compose up -d"
echo "2. Restart the development server: npm run start:dev"
echo "3. Open Swagger: http://localhost:3000/api/docs"
echo ""
echo "✨ All modules are now enabled!"
