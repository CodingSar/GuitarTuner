import { APP_VERSION } from "../../../../shared/config";

export interface HealthStatus {
  status: "ok";
  version: string;
}

// No datastore to probe: the app answers when this code runs.
export function handler(): HealthStatus {
  return { status: "ok", version: APP_VERSION };
}
