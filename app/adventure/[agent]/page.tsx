import AIRouterChat from "@/components/AIRouterChat";
import styles from "./page.module.css";

export default async function AdventureRouter({params}: { params: { agent: string } }) {
    return (
        <div className={styles.container}>
            <div>
                {params.agent === "begin" && (
                    <>
                        <p>In the beginning...</p>
                        <hr/>
                    </>
                )}
            </div>
            <AIRouterChat/>
        </div>
    );
}