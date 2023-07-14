import Layout from "@/app/components/layout/layout";
import Navigation from "@/app/components/navigation/navigation";
import MapChart from "@/app/containers/map/map";
import styles from "./index.module.scss";

console.clear();

export default function Home() {
  return (
    <Layout home={true}>
      <Navigation />
      <div className={`h-screen w-screen cursor-pointer ${styles["wrapper"]}`}>
        <MapChart />
      </div>
    </Layout>
  );
}

