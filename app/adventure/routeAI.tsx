"use server";

import { InteractiveMessage } from "@/app/adventure/createAI";
import { BaseMessage, HumanMessage } from "@langchain/core/messages";
import { MemorySaver } from "@langchain/langgraph";
import { ChatOpenAI } from "@langchain/openai";
import { createStreamableUI, getMutableAIState } from "ai/rsc";
import { GraphRunner } from "autonomais";
import { promises as fs } from "fs";
import { redirect } from "next/navigation";

const aiRouterStateKey = "airouterState";

export async function routeAI(prompt?: string): Promise<InteractiveMessage> {
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

        const messages: BaseMessage[] = [];
        if (prompt) messages.push(
            new HumanMessage({content: prompt})
        );

        const completion = await runner.invoke({
            messages,
        }, {
            configurable: {
                threadId: aiRouterStateKey
            }
        });

        const lastNode = checkpoint.storage[aiRouterStateKey].channelValues.lastNode;

        aiState.done({lastNode, key: aiRouterStateKey});
        uiStream.done(<p>{completion}</p>);

        redirect("/app/adventure/" + lastNode);
    })().then();

    return {
        id: Date.now(),
        display: uiStream.value,
    };
}