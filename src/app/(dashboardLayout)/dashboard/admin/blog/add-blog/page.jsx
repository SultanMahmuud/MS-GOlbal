'use client';
import dynamic from 'next/dynamic';

const AddBlog = dynamic(() => import('@/components/AdminDashboard/AdminBlog/AddBlog'), {
  ssr: false, // disables server-side rendering to avoid using 'self' on the server
});

const Page = () => {
  return (
    <div>
      <AddBlog />
    </div>
  );
};

export default Page;
