import { AI } from "@/app/adventure/createAI";
import Link from "next/link";
import { ReactNode } from "react";
import styles from "./layout.module.css";

export default function RootLayout({
    children,
}: Readonly<{
    children: ReactNode;
}>) {
    return (
        <AI>
            <main className={styles.main}>
                <div className={styles.description}>
                    <h1>Welcome to Adventure!</h1>
                </div>

                <div className={styles.center}>
                    {children}
                </div>

                <div className={styles.grid}>
                    <p>Made by <Link href="https://www.ronlancaster.com">Ron Lancaster</Link></p>
                </div>
            </main>
        </AI>
    );
}