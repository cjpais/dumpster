import React from "react";

const Page = async ({ params }: { params: Promise<{ slug: string }> }) => {
  const slug = (await params).slug;

  return <div>{slug}</div>;
};

export default Page;

// // Optionally, implement generateStaticParams if using static generation
// export async function generateStaticParams() {
//     // Get all valid slugs from your database
//     const slugs = await getAllSlugsFromDB()

//     return slugs.map((slug) => ({
//       slug: slug,
//     }))
//   }
