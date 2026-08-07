/// <reference path="../../.sst/platform/config.d.ts" />

import { vpc } from "./vpc"

export const cluster = new sst.aws.Cluster("Cluster", { vpc })
