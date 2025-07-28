"use server";

export default async function UserPage({
  params,
}: {
  params: { username: string };
}) {
  return <div>Hello, {params.username}</div>;
}
