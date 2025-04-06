import type { SSTConfig } from "sst"
import { NextjsSite } from "sst/constructs"

export default {
  config(_input) {
    return {
      name: "mywarehouse",
      region: "us-east-1",
    }
  },
  stacks(app) {
    app.stack(function Site({ stack }) {
      // Create the NextJS site
      const site = new NextjsSite(stack, "site", {
        customDomain: {
          domainName: app.stage === "prod" ? "mywarehouse.com" : `${app.stage}.mywarehouse.com`,
          domainAlias: app.stage === "prod" ? "www.mywarehouse.com" : undefined,
        },
        environment: {
          // Pass environment variables to the site
          AWS_REGION: stack.region,
          BUCKET_NAME: `mywarehouse-${app.stage}`,
          NEXT_PUBLIC_SST_STAGE: app.stage,
          NEXT_PUBLIC_BASE_URL:
            app.stage === "prod" ? "https://mywarehouse.com" : `https://${app.stage}.mywarehouse.com`,
          NEXT_PUBLIC_API_URL:
            app.stage === "prod" ? "https://api.mywarehouse.com" : `https://api-${app.stage}.mywarehouse.com`,
        },
      })

      // Output the site URL
      stack.addOutputs({
        SiteUrl: site.url,
      })
    })
  },
} satisfies SSTConfig

