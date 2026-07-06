import Link from "next/link";
import { redirect } from "next/navigation";
import { currentUser } from "@/lib/auth";

export default async function AdminPage() {

const user = await currentUser();

if(!user){
 redirect("/login?next=/admin");
}

if(user.role !== "ADMIN"){
 redirect("/");
}

return (

<section className="mx-auto max-w-7xl px-4 py-12">

<h1 className="text-4xl font-black">
Arienkai Admin Panel
</h1>

<div className="mt-8 grid gap-4 md:grid-cols-3">

<Link href="/admin/home" className="glass-panel p-6 rounded-2xl">
<h2 className="text-2xl font-black">
Home
</h2>
</Link>


<Link href="/admin/courses" className="glass-panel p-6 rounded-2xl">
<h2 className="text-2xl font-black">
Courses
</h2>
</Link>


<Link href="/admin/materials" className="glass-panel p-6 rounded-2xl">
<h2 className="text-2xl font-black">
Materials
</h2>
</Link>


<Link href="/admin/navbar" className="glass-panel p-6 rounded-2xl">
<h2 className="text-2xl font-black">
Navbar
</h2>
</Link>


<Link href="/admin/footer" className="glass-panel p-6 rounded-2xl">
<h2 className="text-2xl font-black">
Footer
</h2>
</Link>


</div>

</section>

);

   }
