import StateIndicator from "@/app/adventure/components/StateIndicator";
import AIRouterChat from "@/components/ui/AIRouterChat";
import styles from "./page.module.css";

export default async function AdventureRouter() {
    return (
        <div className={styles.container}>
            <div>
                <StateIndicator/>
                <hr/>
            </div>
            <AIRouterChat workflowPath={"app/adventure/workflow.yaml"}/>
        </div>
    );
}