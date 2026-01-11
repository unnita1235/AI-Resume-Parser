# Use Docker Hardened Node.js image for secure, production-ready base
# Node.js 22.x with extended lifecycle support
FROM docker.io/library/node:22-alpine

# Security: Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nextjs -u 1001

# Set working directory
WORKDIR /app

# Copy package files with proper ownership
COPY --chown=nextjs:nodejs package*.json ./

# Install dependencies (production only for smaller image)
RUN npm ci --only=production && npm cache clean --force

# Copy the application source code with proper ownership
COPY --chown=nextjs:nodejs . .

# Build the Next.js application
RUN npm run build

# Security: Remove unnecessary files after build
RUN rm -rf .git .github .env* *.md

# Switch to non-root user
USER nextjs

# Expose port 3000
EXPOSE 3000

# Set the environment to production
ENV NODE_ENV=production

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/api/health', (r) => { if(r.statusCode !== 200) throw new Error(); })"

# Start the application
CMD ["npm", "start"]
