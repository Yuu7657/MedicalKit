// vite.config.mjs
import { defineConfig } from "file:///C:/Users/RICA/OneDrive/Escritorio/MedicalKit/frontend/node_modules/vite/dist/node/index.js";
import vue from "file:///C:/Users/RICA/OneDrive/Escritorio/MedicalKit/frontend/node_modules/@vitejs/plugin-vue/dist/index.js";
import { VitePWA } from "file:///C:/Users/RICA/OneDrive/Escritorio/MedicalKit/frontend/node_modules/vite-plugin-pwa/dist/index.js";
var vite_config_default = defineConfig({
  plugins: [
    vue(),
    VitePWA({
      registerType: "prompt",
      injectRegister: "auto",
      manifest: {
        name: "Medical Kit",
        short_name: "MedKit",
        start_url: "/",
        display: "standalone",
        background_color: "#ffffff",
        theme_color: "#0f172a",
        icons: []
      },
      workbox: {
        navigateFallback: "/",
        runtimeCaching: [
          {
            urlPattern: ({ request }) => request.destination === "image",
            handler: "CacheFirst",
            options: { cacheName: "images-cache" }
          },
          {
            urlPattern: ({ url }) => url.pathname.startsWith("/api/"),
            handler: "StaleWhileRevalidate",
            options: { cacheName: "api-cache", networkTimeoutSeconds: 3 }
          }
        ]
      }
    })
  ]
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcubWpzIl0sCiAgInNvdXJjZXNDb250ZW50IjogWyJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiQzpcXFxcVXNlcnNcXFxcUklDQVxcXFxPbmVEcml2ZVxcXFxFc2NyaXRvcmlvXFxcXE1lZGljYWxLaXRcXFxcZnJvbnRlbmRcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkM6XFxcXFVzZXJzXFxcXFJJQ0FcXFxcT25lRHJpdmVcXFxcRXNjcml0b3Jpb1xcXFxNZWRpY2FsS2l0XFxcXGZyb250ZW5kXFxcXHZpdGUuY29uZmlnLm1qc1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vQzovVXNlcnMvUklDQS9PbmVEcml2ZS9Fc2NyaXRvcmlvL01lZGljYWxLaXQvZnJvbnRlbmQvdml0ZS5jb25maWcubWpzXCI7aW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSAndml0ZSdcbmltcG9ydCB2dWUgZnJvbSAnQHZpdGVqcy9wbHVnaW4tdnVlJ1xuaW1wb3J0IHsgVml0ZVBXQSB9IGZyb20gJ3ZpdGUtcGx1Z2luLXB3YSdcblxuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKHtcbiAgcGx1Z2luczogW1xuICAgIHZ1ZSgpLFxuICAgIFZpdGVQV0Eoe1xuICAgICAgcmVnaXN0ZXJUeXBlOiAncHJvbXB0JyxcbiAgICAgIGluamVjdFJlZ2lzdGVyOiAnYXV0bycsXG4gICAgICBtYW5pZmVzdDoge1xuICAgICAgICBuYW1lOiAnTWVkaWNhbCBLaXQnLFxuICAgICAgICBzaG9ydF9uYW1lOiAnTWVkS2l0JyxcbiAgICAgICAgc3RhcnRfdXJsOiAnLycsXG4gICAgICAgIGRpc3BsYXk6ICdzdGFuZGFsb25lJyxcbiAgICAgICAgYmFja2dyb3VuZF9jb2xvcjogJyNmZmZmZmYnLFxuICAgICAgICB0aGVtZV9jb2xvcjogJyMwZjE3MmEnLFxuICAgICAgICBpY29uczogW10gXG4gICAgICB9LFxuICAgICAgd29ya2JveDoge1xuICAgICAgICBuYXZpZ2F0ZUZhbGxiYWNrOiAnLycsXG4gICAgICAgIHJ1bnRpbWVDYWNoaW5nOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgdXJsUGF0dGVybjogKHsgcmVxdWVzdCB9KSA9PiByZXF1ZXN0LmRlc3RpbmF0aW9uID09PSAnaW1hZ2UnLFxuICAgICAgICAgICAgaGFuZGxlcjogJ0NhY2hlRmlyc3QnLFxuICAgICAgICAgICAgb3B0aW9uczogeyBjYWNoZU5hbWU6ICdpbWFnZXMtY2FjaGUnIH1cbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIHVybFBhdHRlcm46ICh7IHVybCB9KSA9PiB1cmwucGF0aG5hbWUuc3RhcnRzV2l0aCgnL2FwaS8nKSxcbiAgICAgICAgICAgIGhhbmRsZXI6ICdTdGFsZVdoaWxlUmV2YWxpZGF0ZScsXG4gICAgICAgICAgICBvcHRpb25zOiB7IGNhY2hlTmFtZTogJ2FwaS1jYWNoZScsIG5ldHdvcmtUaW1lb3V0U2Vjb25kczogMyB9XG4gICAgICAgICAgfVxuICAgICAgICBdXG4gICAgICB9XG4gICAgfSlcbiAgXVxufSlcbiJdLAogICJtYXBwaW5ncyI6ICI7QUFBaVcsU0FBUyxvQkFBb0I7QUFDOVgsT0FBTyxTQUFTO0FBQ2hCLFNBQVMsZUFBZTtBQUV4QixJQUFPLHNCQUFRLGFBQWE7QUFBQSxFQUMxQixTQUFTO0FBQUEsSUFDUCxJQUFJO0FBQUEsSUFDSixRQUFRO0FBQUEsTUFDTixjQUFjO0FBQUEsTUFDZCxnQkFBZ0I7QUFBQSxNQUNoQixVQUFVO0FBQUEsUUFDUixNQUFNO0FBQUEsUUFDTixZQUFZO0FBQUEsUUFDWixXQUFXO0FBQUEsUUFDWCxTQUFTO0FBQUEsUUFDVCxrQkFBa0I7QUFBQSxRQUNsQixhQUFhO0FBQUEsUUFDYixPQUFPLENBQUM7QUFBQSxNQUNWO0FBQUEsTUFDQSxTQUFTO0FBQUEsUUFDUCxrQkFBa0I7QUFBQSxRQUNsQixnQkFBZ0I7QUFBQSxVQUNkO0FBQUEsWUFDRSxZQUFZLENBQUMsRUFBRSxRQUFRLE1BQU0sUUFBUSxnQkFBZ0I7QUFBQSxZQUNyRCxTQUFTO0FBQUEsWUFDVCxTQUFTLEVBQUUsV0FBVyxlQUFlO0FBQUEsVUFDdkM7QUFBQSxVQUNBO0FBQUEsWUFDRSxZQUFZLENBQUMsRUFBRSxJQUFJLE1BQU0sSUFBSSxTQUFTLFdBQVcsT0FBTztBQUFBLFlBQ3hELFNBQVM7QUFBQSxZQUNULFNBQVMsRUFBRSxXQUFXLGFBQWEsdUJBQXVCLEVBQUU7QUFBQSxVQUM5RDtBQUFBLFFBQ0Y7QUFBQSxNQUNGO0FBQUEsSUFDRixDQUFDO0FBQUEsRUFDSDtBQUNGLENBQUM7IiwKICAibmFtZXMiOiBbXQp9Cg==
