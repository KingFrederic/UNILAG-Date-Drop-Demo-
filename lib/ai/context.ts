/**
 * Shared between the browser provider and the server route, so the route does
 * not have to import the client-side simulation just to get its types.
 */
export interface AssistantContext {
  runRate: number;
  realisedIncome: number;
  netWorth: number;
  topStream: { title: string; monthly: number } | null;
  weakestStream: { title: string; monthly: number } | null;
  activeAgents: number;
  ideaCount: number;
}

export interface AssistantProvider {
  /** Yields the reply in chunks so the UI can render it as it arrives. */
  stream(prompt: string, context: AssistantContext): AsyncGenerator<string>;
}
