import { LayerVersion, Code } from "aws-cdk-lib/aws-lambda";
import { StackContext, Api, EventBus } from "sst/constructs";

export function API({ stack }: StackContext) {
  const layerChromium = new LayerVersion(stack, "chromiumLayers", {
    code: Code.fromAsset("layers/chromium"),
  });
  const bus = new EventBus(stack, "bus", {
    defaults: {
      retries: 10,
    },
  });

  const api = new Api(stack, "api", {
    defaults: {
      function: {
        bind: [bus],
      },
    },
    routes: {
      "GET /": "packages/functions/src/lambda.handler",
      "GET /scrape": {
        function: {
          handler: "packages/functions/src/scrape.scrape",
          runtime: "nodejs18.x",
          timeout: 60,
          layers: [layerChromium],
          allowPublicSubnet: true,
          nodejs: {
            esbuild: {
              external: ["@sparticuz/chromium"],
            },
          },
        },
      },
    },
  });

  bus.subscribe("todo.created", {
    handler: "packages/functions/src/events/todo-created.handler",
  });

  stack.addOutputs({
    ApiEndpoint: api.url,
  });
}
