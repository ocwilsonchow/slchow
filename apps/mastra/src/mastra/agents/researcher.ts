import { Agent } from "@mastra/core/agent"
import { createDurableAgent } from "@mastra/core/agent/durable"

const agent = new Agent({
  id: "researcher",
  name: "Researcher",
  instructions: "You research topics thoroughly.",
  model: "vercel/deepseek/deepseek-v4-pro",
})

export const durableResearcher = createDurableAgent({ agent })
