#!/usr/bin/env node
import { build } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import fs from 'fs';

const config = {
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(process.cwd(), 'client/src'),
      '@assets': path.resolve(process.cwd(), 'attached_assets'),
    },
  },
  root: './client',
  build: {
    outDir: '../dist',
    emptyOutDir: true,
  },
  define: {
    'process.env.NODE_ENV': '"production"',
  },
};

await build(config);

// Copy _redirects file for SPA routing
if (fs.existsSync('_redirects')) {
  fs.copyFileSync('_redirects', 'dist/_redirects');
}

// Copy favicon files
if (fs.existsSync('public/favicon.svg')) {
  fs.copyFileSync('public/favicon.svg', 'dist/favicon.svg');
}
if (fs.existsSync('public/favicon.ico')) {
  fs.copyFileSync('public/favicon.ico', 'dist/favicon.ico');
}

console.log('Static build completed for CloudFlare Pages');