import "server-only";
import { routeAI } from "@/app/adventure/routeAI";

import { createAI } from "ai/rsc";
import { ReactNode } from "react";

export type InteractiveMessage = {
    id: number,
    display: ReactNode,
}

export const AI = createAI({
    actions: {
        routeAI,
    },
    initialAIState: [],
    initialUIState: [],
} as {
    actions: {
        routeAI: (message?: string) => Promise<InteractiveMessage>;
    },
    initialAIState: InteractiveMessage[],
    initialUIState: InteractiveMessage[],
});