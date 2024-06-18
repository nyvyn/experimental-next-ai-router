"use server";

import { InteractiveMessage } from "@/components/actions/createAI";
import { AIMessage, BaseMessage, HumanMessage } from "@langchain/core/messages";
import { MemorySaver } from "@langchain/langgraph";
import { ChatOpenAI } from "@langchain/openai";
import { createStreamableUI, getMutableAIState } from "ai/rsc";
import { GraphRunner } from "autonomais";
import { promises as fs } from "node:fs";
import path from "node:path";

const aiRouterStateKey = "airouterState";

export async function invokeAI(workflowPath: string, content?: string): Promise<InteractiveMessage> {
    if (!Boolean(process.env.OPENAI_API_KEY)) {
        throw new Error("OPENAI_API_KEY environment variable is required.");
    }

    const model = new ChatOpenAI({
        apiKey: process.env.OPENAI_API_KEY,
        model: "gpt-4-turbo",
    });

    const uiStream = createStreamableUI(<div>Typing...</div>);
    const aiState = getMutableAIState();

    // Add the most recent message from the user to the AI message state.
    if (content) {
        aiState.update({
            lastNode: aiState.get().lastNode,
            messages: [...aiState.get().messages, {type: "human", content}]
        });
    }

    (async () => {
        const checkpoint = new MemorySaver();

        // Find the workflow file in this same directory
        const config = await fs.readFile(path.join(process.cwd(), workflowPath), "utf8");
        const runner: GraphRunner = await GraphRunner.fromWorkflow({checkpoint, config, model});

        const messages: BaseMessage[] = [];
        aiState.get().messages.forEach((message: any) => {
            if (message.type === "human") messages.push(new HumanMessage({content: message.content}));
            if (message.type === "ai") messages.push(new AIMessage({content: message.content}));
        });

        // Pass the current AI message state to the runner.
        const completion = await runner.invoke({
            messages,
        }, {
            configurable: {
                thread_id: aiRouterStateKey
            }
        });

        const state = checkpoint.storage[aiRouterStateKey];
        const keys = Object.keys(state);
        const lastKey = state[keys[keys.length - 1]];
        const result = JSON.parse(lastKey[1]);
        const lastNode = result.writes[Object.keys(result.writes)[0]].lastNode;

        // Save the updated last node and append the AI message to the list of state messages.
        aiState.done({
            lastNode,
            messages: [...aiState.get().messages, {type: "ai", content: completion}],
        });

        // Update the UI
        uiStream.done(<p>{completion}</p>);
    })().then();

    return {
        id: Date.now(),
        display: uiStream.value,
    };
}