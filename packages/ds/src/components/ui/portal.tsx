"use client";

import { Portal as PortalPrimitive } from "radix-ui";
import type * as React from "react";

export function Portal({
	...props
}: React.ComponentProps<typeof PortalPrimitive.Root>) {
	return <PortalPrimitive.Root data-slot="portal" {...props} />;
}
