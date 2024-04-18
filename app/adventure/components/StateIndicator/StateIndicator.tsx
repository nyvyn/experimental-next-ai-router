"use client";

import { AI } from "@/components/actions/createAI";
import { useAIState } from "ai/rsc";

export default function StateIndicator() {
    const [aiState] = useAIState<typeof AI>();

    let message;
    switch (aiState.lastNode) {
        case "challenge-encounter":
            message = "Challenge!";
            break;
        case "dynamic-exploration":
            message = "You see something new.";
            break;
        case "end-adventure":
            message = "And the story ends.";
            break;
        case "outcome-evaluation":
            message = "The challenge passes.";
            break;
        case "start-adventure":
            message = "The adventure begins...";
            break;
        default:
            message = aiState.lastNode || "The adventure begins...";
    }
    return (
        <p>{message}</p>
    );
}