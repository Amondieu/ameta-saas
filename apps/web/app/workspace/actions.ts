"use server";

import { redirect } from "next/navigation";

import { createApiClient } from "../../lib/api";

function slugifyTenantName(name: string) {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function getFormString(formData: FormData, key: string) {
  const value = formData.get(key);

  return typeof value === "string" ? value.trim() : "";
}

export async function bootstrapTenantAction(formData: FormData) {
  const name = getFormString(formData, "name");

  if (!name) {
    return;
  }

  const api = await createApiClient();

  await api.tenantBootstrap.mutate({
    name,
    slug: slugifyTenantName(name)
  });

  redirect("/workspace");
}

export async function setCurrentTenantAction(formData: FormData) {
  const tenantId = getFormString(formData, "tenantId");

  if (!tenantId) {
    return;
  }

  const api = await createApiClient();

  await api.tenantSetCurrent.mutate({
    tenantId
  });

  redirect("/workspace");
}
