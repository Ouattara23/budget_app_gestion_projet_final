import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  outputFileTracingIncludes: {
    "/api/amia": ["./docs/Amia_Prompt_Systeme.md", "./docs/BudgetApp_Presentation_Commerciale.md"],
  },
};

export default nextConfig;
