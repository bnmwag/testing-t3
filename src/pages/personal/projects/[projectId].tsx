import { type GetStaticProps, type NextPage } from "next";
import Head from "next/head";
import { generateSSGHelper } from "@/server/helpers/ssgHelper";
import Header from "@/components/Header";
import { api } from "@/utils/api";
import { useSession } from "next-auth/react";
import Link from "next/link";
import TaskBoard from "@/components/TaskBoard";
import { Suspense } from "react";
import AddTaskButton from "@/components/AddTaskButton";
import { LoadingPage } from "@/components/loading";

const SingleProjectPage: NextPage<{ id: string }> = ({ id }) => {
  const { data: sessionData } = useSession();
  const { data } = api.projects.getById.useQuery({
    id,
  });

  if (!data) return <LoadingPage />;

  return (
    <>
      <Head>
        <title>{`${data.name}`}</title>
      </Head>
      <div className="flex flex-col">
        {sessionData ? (
          <>
            <Header
              title={data.name}
              subtitle={data.description || "no subtitle provided"}
            />
            <div className="mb-4 flex justify-end">
              <AddTaskButton projectId={id} />
            </div>
            <TaskBoard projectId={id} />
          </>
        ) : (
          <div>
            <Link href="/signin">
              <span>Sign in</span>
            </Link>
          </div>
        )}
      </div>
    </>
  );
};

export const getStaticProps: GetStaticProps = async (context) => {
  const ssg = generateSSGHelper();

  const id = context.params?.projectId as string;

  if (!id) throw new Error("No id provided");

  await ssg.projects.getById.prefetch({ id });

  return {
    props: {
      trpcState: ssg.dehydrate(),
      id,
    },
  };
};

export const getStaticPaths = () => {
  return {
    paths: [],
    fallback: "blocking",
  };
};

export default SingleProjectPage;
