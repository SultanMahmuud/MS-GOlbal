
import Footer from '@/components/Shared/Footer/Footer'
import Navbar from '@/components/Shared/Navber/Navber'


const CommonLayout = ({ children }) => {


  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 lg:h-[calc(100vh-70px)] h-[calc(100vh-465px)]">
        {children}
      </main>
      <Footer />
    </div>
  );
}

export default CommonLayout