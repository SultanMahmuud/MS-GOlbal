
export const DateConversionWithTime=(date)=>{
    
     var options = {  year: 'numeric', month: 'long', day: 'numeric' };
    var today  = new Date(`${date}`)
    
  const convertedDate=  today.toLocaleString("en-US", options)

  return convertedDate
}