"use server";

import { InteractiveMessage } from "@/app/adventure/createAI";
import { HumanMessage } from "@langchain/core/messages";
import { MemorySaver } from "@langchain/langgraph";
import { ChatOpenAI } from "@langchain/openai";
import { createStreamableUI, getMutableAIState } from "ai/rsc";
import { GraphRunner } from "autonomais";
import { promises as fs } from "fs";

const aiRouterStateKey = "airouterState";

export async function routeAI(message: string): Promise<InteractiveMessage> {
    if (!Boolean(process.env.OPENAI_API_KEY)) {
        throw new Error("OPENAI_API_KEY environment variable is required.");
    }

    const model = new ChatOpenAI({
        apiKey: process.env.OPENAI_API_KEY,
        model: "gpt-4-turbo",
    });

    const aiState = getMutableAIState();
    const uiStream = createStreamableUI(<div>Loading...</div>);

    (async () => {
        const checkpoint = new MemorySaver();

        // Find the workflow file in this same directory
        const path = await fs.readFile(process.cwd() + "/app/adventure/workflow.yaml", "utf8");
        const runner: GraphRunner = await GraphRunner.fromWorkflow({checkpoint, model, path});

        const completion = await runner.invoke({
            messages: [
                new HumanMessage({content: message})
            ],
        });

        const lastNode = checkpoint.storage.undefined.channelValues.lastNode;
        aiState.done({lastNode, key: aiRouterStateKey});
        uiStream.done(<p>{completion}</p>);
    })().then();

    return {
        id: Date.now(),
        display: uiStream.value,
    };
}