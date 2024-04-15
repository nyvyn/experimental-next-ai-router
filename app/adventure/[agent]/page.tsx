import styles from "./page.module.css";

export default function AdventureRouter({params}: { params: { agent: string } }) {
    return (
        <div className={styles.description}>
            Agent: {params.agent}
        </div>
    );
}