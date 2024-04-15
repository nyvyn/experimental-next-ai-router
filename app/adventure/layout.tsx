import { ReactNode } from "react";
import styles from "./layout.module.css";

export default function RootLayout({
    children,
}: Readonly<{
    children: ReactNode;
}>) {
    return (
        <main className={styles.main}>
            <div className={styles.description}>
                <h1>Welcome to Adventure!</h1>
                {children}
            </div>
        </main>
    );
}