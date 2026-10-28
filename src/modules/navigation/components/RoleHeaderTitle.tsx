"use client";

import type { Role } from "@/modules/auth/types/auth.types";
import { AppHeaderTitle } from "@/shared/sidebar/AppHeaderTitle";

import { SIDEBAR_BY_ROLE } from "../navigation.constants";

type RoleHeaderTitleProps = {
  /** The config is chosen here because its icons can't cross from server to client. */
  role: Role;
};

export function RoleHeaderTitle({ role }: RoleHeaderTitleProps) {
  return <AppHeaderTitle config={SIDEBAR_BY_ROLE[role]} />;
}
