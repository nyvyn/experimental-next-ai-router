"use client";

import { AI } from "@/app/adventure/createAI";
import { useActions, useUIState } from "ai/rsc";
import { ChangeEvent, FormEvent, useState } from "react";

import styles from "./AIRouterChat.module.css";

export default function Chat() {
    const [inputValue, setInputValue] = useState("");
    const [messages, setMessages] = useUIState<typeof AI>();
    const {routeAI} = useActions<typeof AI>();

    const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
        setInputValue(event.target.value);
    };

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!inputValue) return;

        // Add the user message to UI state
        setMessages((currentMessages) => [
            ...currentMessages,
            {
                id: Date.now(),
                display: <p>{inputValue}</p>,
            },
        ]);

        const responseMessage = await routeAI(inputValue);

        setMessages((currentMessages) => [
            ...currentMessages,
            responseMessage,
        ]);

        setInputValue("");
    };

    return (
        <div className={styles.chatpanel}>
            <div className={styles.messages}>
                {messages.map((message) => (
                    <div key={message.id} className={styles.interactivemessage}>
                        {message.display}
                    </div>
                ))}
            </div>

            <div className={styles.chatbox}>
                <form onSubmit={handleSubmit}>
                    <input
                        className={styles.chatinput}
                        value={inputValue}
                        placeholder="Say something..."
                        onChange={handleInputChange}
                    />
                </form>
            </div>
        </div>
    );
}