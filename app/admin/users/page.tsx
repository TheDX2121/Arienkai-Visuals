import Link from "next/link";
import { redirect } from "next/navigation";
import { currentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

type DbUser = {
  id: string;
  name: string | null;
  email: string;
  username: string;
  role: string;
  subscription: string;
  postCount: bigint | number;
  followerCount: bigint | number;
  followingCount: bigint | number;
};

async function getUsers() {
  try {
    return await prisma.$queryRaw<DbUser[]>`
      SELECT
        u."id",
        u."name",
        u."email",
        u."username",
        u."role",
        u."subscription",
        COUNT(DISTINCT p."id") AS "postCount",
        COUNT(DISTINCT f1."id") AS "followerCount",
        COUNT(DISTINCT f2."id") AS "followingCount"
      FROM "User" u
      LEFT JOIN "Post" p ON p."authorId" = u."id"
      LEFT JOIN "Follow" f1 ON f1."followingId" = u."id"
      LEFT JOIN "Follow" f2 ON f2."followerId" = u."id"
      GROUP BY u."id", u."name", u."email", u."username", u."role", u."subscription"
      ORDER BY u."createdAt" DESC
    `;
  } catch {
    return [];
  }
}

export default async function AdminUsersPage() {
  const user = await currentUser();

  if (!user) {
    redirect("/login?next=/admin/users");
  }

  if (user.role !== "ADMIN") {
    redirect("/");
  }

  const users = await getUsers();

  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <details className="glass-panel mb-8 rounded-2xl p-4">
        <summary className="cursor-pointer text-lg font-black">
          ☰ Admin Menu
        </summary>

        <div className="mt-4 flex flex-wrap gap-3">
          <Link href="/admin" className="secondary-button">Dashboard</Link>
          <Link href="/admin/courses" className="secondary-button">Courses</Link>
          <Link href="/admin/materials" className="secondary-button">Materials</Link>
          <Link href="/admin/categories" className="secondary-button">Categories</Link>
          <Link href="/admin/footer" className="secondary-button">Footer</Link>
          <Link href="/admin/users" className="primary-button">Users</Link>
        </div>
      </details>

      <div className="mb-8">
        <div className="pill mb-4 w-fit">Users</div>

        <h1 className="text-4xl font-black">
          User management
        </h1>

        <p className="mt-3 text-white/55">
          Change role, premium plan, moderation status, and delete users.
        </p>
      </div>

      <div className="glass-panel overflow-x-auto rounded-[2rem] p-4">
        <table className="w-full min-w-[1050px] text-left text-sm">
          <thead className="text-white/45">
            <tr>
              <th className="p-3">Name</th>
              <th className="p-3">Email</th>
              <th className="p-3">Username</th>
              <th className="p-3">Plan</th>
              <th className="p-3">Role</th>
              <th className="p-3">Posts</th>
              <th className="p-3">Followers</th>
              <th className="p-3">Following</th>
              <th className="p-3">Update</th>
              <th className="p-3">Delete</th>
            </tr>
          </thead>

          <tbody>
            {users.map((item) => (
              <tr key={item.id} className="border-t border-white/10">
                <td className="p-3">{item.name || "-"}</td>
                <td className="p-3">{item.email}</td>
                <td className="p-3">
                  <Link href={`/profile/${item.username}`} className="hover:text-red-200">
                    @{item.username}
                  </Link>
                </td>
                <td className="p-3">{item.subscription}</td>
                <td className="p-3">{item.role}</td>
                <td className="p-3">{String(item.postCount)}</td>
                <td className="p-3">{String(item.followerCount)}</td>
                <td className="p-3">{String(item.followingCount)}</td>

                <td className="p-3">
                  <form action={`/api/admin/users/${item.id}/update`} method="post" className="flex gap-2">
                    <select className="rounded-xl bg-white/10 px-2 py-2" name="role" defaultValue={item.role}>
                      <option className="bg-black" value="USER">USER</option>
                      <option className="bg-black" value="ADMIN">ADMIN</option>
                    </select>

                    <select className="rounded-xl bg-white/10 px-2 py-2" name="subscription" defaultValue={item.subscription}>
                      <option className="bg-black" value="FREE">FREE</option>
                      <option className="bg-black" value="CREATOR">CREATOR</option>
                      <option className="bg-black" value="STUDIO">STUDIO</option>
                    </select>

                    <button className="primary-button" type="submit">
                      Save
                    </button>
                  </form>
                </td>

                <td className="p-3">
                  <form action={`/api/admin/users/${item.id}/delete`} method="post">
                    <button
                      className="rounded-full border border-red-500/40 bg-red-500/10 px-4 py-2 text-sm font-bold text-red-100"
                      type="submit"
                    >
                      Delete
                    </button>
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {!users.length ? (
          <p className="p-4 text-white/50">No users found.</p>
        ) : null}
      </div>
    </section>
  );
}
