export type PlanId = "free" | "pro" | "enterprise";

export type Subscription = {
  planId: PlanId;
  status: "active" | "past_due" | "trialing";
  tenantId: string;
};

export type Usage = {
  periodEnd: string;
  periodStart: string;
  seats: number;
  tenantId: string;
};

export interface BillingProvider {
  getSubscription(tenantId: string): Promise<Subscription | null>;
  getUsage(tenantId: string): Promise<Usage>;
  listPlans(): Promise<
    Array<{
      description: string;
      id: PlanId;
      name: string;
    }>
  >;
}
