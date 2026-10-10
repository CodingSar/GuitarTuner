import { describe, expect, expectTypeOf, it } from "vitest";
import { APP_VERSION } from "../../../../shared/config";
import { handler } from "./handler";
import type { HealthStatus } from "./handler";

describe("health check", () => {
  it("TASK-1#8 health check reports ok with the version string", () => {
    expect(handler()).toEqual({ status: "ok", version: APP_VERSION });
    expectTypeOf(handler).returns.toEqualTypeOf<HealthStatus>();
  });
});
