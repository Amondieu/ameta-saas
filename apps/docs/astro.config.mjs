import { defineConfig } from "astro/config";
import starlight from "@astrojs/starlight";

export default defineConfig({
  integrations: [
    starlight({
      title: "Meta-Repo Kernel",
      social: [],
      sidebar: [
        { label: "Overview", link: "/" },
        {
          label: "Architecture",
          items: [{ autogenerate: { directory: "architecture" } }]
        },
        { label: "Deferred Decisions", link: "/deferred" }
      ]
    })
  ]
});
