"use server";

export default async function UserPage(props: {
  params: Promise<{ username: string }>;
}) {
  const params = await props.params;
  return <div>Hello, {params.username}</div>;
}
