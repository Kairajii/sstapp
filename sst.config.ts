import { SSTConfig } from "sst";
import { API } from "./stacks/MyStack";

export default {
  config(_input) {
    return {
      name: "sstapp",
      region: "us-east-1",
    };
  },
  stacks(app) {
    app.stack(API);
    app.stack(API2);
    app.stack(API3);
  }
} satisfies SSTConfig;
