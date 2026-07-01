import BookDetails from "@/components/AllPages/LibraryPage/Librarydetails";


export default async function Page({ params }) {

  const { bookId } = await params;
  const singleBook = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/book/${bookId}`).then(res => res.json());

  return (
    <div>

     <BookDetails singleBook={singleBook} />
    </div>
  );
}
