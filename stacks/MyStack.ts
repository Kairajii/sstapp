import { LayerVersion, Code } from "aws-cdk-lib/aws-lambda";
import { StackContext, Api, EventBus } from "sst/constructs";


export function API({ stack }: StackContext) {
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
      "GET /todo": "packages/functions/src/todo.list",
      "POST /todo": "packages/functions/src/todo.create",
    },
  });

  bus.subscribe("todo.created", {
    handler: "packages/functions/src/events/todo-created.handler",
  });

  stack.addOutputs({
    ApiEndpoint: api.url,
  });
}


// for testing the mongoDb connection and fetching the  api

export function API2({ stack }: StackContext) {
  // Create a HTTP API
  const api = new Api(stack, "Api", {
    defaults: {
      function: {
        environment: {
          MONGODB_URI: process.env.MONGODB_URI as string,
        },
      },
    },
    routes: {
      "GET /": "packages/functions/src/lambda.handler",
    },
  });

  // Show the endpoint in the output
  stack.addOutputs({
    ApiEndpoint: api.url,
  });
}


// puppeteer

export function API3({ stack }: StackContext) {
  const layerChromium = new LayerVersion(stack, "chromiumLayers", {
    code: Code.fromAsset("layers/chromium"),
  });
  const bus = new EventBus(stack, "bus1", {
    defaults: {
      retries: 10,
    },
  });

  const api = new Api(stack, "Api1", {
    defaults: {
      function: {
        bind: [bus],
      },
    },
    // Create a HTTP API
    routes: {
      "GET /": {
        function: {
          handler: "packages/functions/src/lambda.handler",
          runtime: "nodejs18.x",
          timeout: 30,
          layers: [layerChromium],
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

  // Show the endpoint in the output
  stack.addOutputs({
    ApiEndpoint: api.url,
  });
}
