"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import { Trash } from "lucide-react"
import { toast } from "sonner"
import { getApiBaseUrl } from "@/lib/brand-config"

import { MdExpandMore } from "react-icons/md"


export default function FAQPage() {
  const [faq, setFaq] = useState([])
  const [filteredFaq, setFilteredFaq] = useState([])

  const [openItem, setOpenItem] = useState(null)
  const [loading, setLoading] = useState(true)

  const fetchFAQs = async () => {
    try {
      setLoading(true)
      const res = await axios.get(`${getApiBaseUrl()}/faq`)
      const reversed = Array.isArray(res?.data?.data)
        ? [...res.data.data].reverse()
        : []
      
      setFaq(reversed)
      setFilteredFaq(reversed)
    } catch (err) {
      console.error("Failed to load FAQs:", err)
      toast.error("Failed to load FAQs")
      setFaq([])
      setFilteredFaq([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchFAQs()
  }, [])

  const handleToggle = (id) => {
    setOpenItem(openItem === id ? null : id)
  }


  const handleFAQDelete = async (id) => {
    try {
      const res = await axios.delete(`${getApiBaseUrl()}/faq/${id}`)
      if (res.status >= 200 && res.status < 300) {
        toast.success("FAQ has been deleted")
        fetchFAQs()
      }
    } catch (error) {
      console.error("Failed to delete FAQ:", error)
      toast.error("Error! Something went wrong.")
    }
  }

  return (
    <div className="p-4 max-w-6xl mx-auto">
      {loading && <p>Loading...</p>}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
 {/* if data have show data other wise show no data */} 
 {filteredFaq.length > 0 ? (
   filteredFaq.map((item) => (
     <div key={item._id} className="rounded-md shadow border bg-white overflow-hidden">
       <div
         onClick={() => handleToggle(item._id)}
         className="flex justify-between items-center cursor-pointer p-4 hover:bg-gray-50"
       >
         <div className="flex items-center gap-2">
           <button
             onClick={(e) => {
               e.stopPropagation()
               handleFAQDelete(item._id)
             }}
             className="text-red-500 hover:text-red-600"
           >
             <Trash className="w-4 h-4" />
           </button>
           <p className="font-semibold text-sm text-gray-800">{item.question}</p>
         </div>
         <MdExpandMore
           className={`text-xl text-gray-500 transition-transform duration-200 ${
             openItem === item._id ? "rotate-180" : ""
           }`}
         />
       </div>
       {openItem === item._id && (
         <div className="p-4 border-t text-sm text-gray-700 leading-relaxed">
           {item.answer}
         </div>
       )}
     </div>
   ))
 ) : (
   <p className="text-gray-500 text-center font-medium text-lg">No FAQs available</p>
 )}
      </div>
    </div>
  )
}
