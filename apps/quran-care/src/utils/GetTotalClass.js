import { GetCurrentDate } from "./GetCurrentDate";


const today= GetCurrentDate()
export const GetTotalClass=(startDate,selectedDays)=>{
    
    let totalClass=0
    const start = new Date(startDate);  
   const end = new Date(today);  
   let loop = new Date(start);  
   while (loop <= end) {  
    var dayName = loop.toString().split(' ')[0];  
 
    if(selectedDays.includes(dayName)){
        totalClass+=1
    }
  const newDate = loop.setDate(loop.getDate() + 1);  
    loop = new Date(newDate);  
}
return totalClass

}