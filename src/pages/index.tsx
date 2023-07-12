import Layout from "@/app/components/layout/layout";
import Navigation from "@/app/components/navigation/navigation";

export default function Home() {
  return (
    <Layout home={true}>
      <Navigation />
    </Layout>
  );
}
