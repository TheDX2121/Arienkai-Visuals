import { prisma } from "@/lib/prisma";
import { currentUser } from "@/lib/auth";
import { HomeHeroSlider } from "@/components/home-hero-slider";


async function getSlides(){

try{

const slides = await prisma.$queryRaw<any[]>`

SELECT
"id",
"title",
"description",
"imageUrl",
"href",
"buttonLabel",
"tag",
"meta",
"type"

FROM "HomeSlide"

WHERE "isActive" = true

ORDER BY "sortOrder" ASC

LIMIT 10

`;

return slides;

}catch{

return [];

}

}



export default async function HomePage(){

const user = await currentUser();

const slides = await getSlides();


return (

<main>

<HomeHeroSlider

slides={slides}

isLoggedIn={Boolean(user)}

/>

</main>

);

}
