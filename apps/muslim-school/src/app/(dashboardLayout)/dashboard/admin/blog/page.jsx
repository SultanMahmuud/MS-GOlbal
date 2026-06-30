'use client';

import dynamic from 'next/dynamic';

const AllBlog = dynamic(() => import('@/components/AdminDashboard/AdminBlog/AllBlog'), {
  ssr: false, // disable server-side rendering
});

const Page = () => {
  return (
    <div>
      <AllBlog />
    </div>
  );
};

export default Page;
