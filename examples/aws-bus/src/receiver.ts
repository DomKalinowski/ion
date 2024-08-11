import { bus } from "sst/aws/bus";
import { MyEvent } from "./index";

export const handler = bus.handler(MyEvent, async (evt, raw) => {
  console.log({ evt, raw });
});
