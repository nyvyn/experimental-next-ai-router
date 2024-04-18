import "server-only";
import { invokeAI } from "@/components/actions/invokeAI";
import { BaseMessage } from "@langchain/core/messages";

import { createAI } from "ai/rsc";
import { ReactNode } from "react";

export type InteractiveMessage = {
    id: number,
    display: ReactNode,
}

export const AI = createAI({
    actions: {
        invokeAI,
    },
    initialAIState: {
        messages: [],
    },
    initialUIState: [],
} as {
    actions: {
        invokeAI: (workflowPath: string, message?: string) => Promise<InteractiveMessage>;
    },
    initialAIState: {
        lastNode?: string;
        messages: BaseMessage[];
    },
    initialUIState: InteractiveMessage[],
});