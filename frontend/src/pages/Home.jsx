import React, { useState } from 'react'
import { useParams } from 'react-router-dom';

const Home = () => {
    const {id} =useParams();
    const [files,setFiles] = useState([]);
    console.log(id);
    const getFiles = async()=>{
      const response = await fetch("http://localhost:5000",{
        method : "GET",
        body : JSON.stringify({"userId" : id})
      });
      if(response.ok){
        const data = await response.json();
        setFiles(data);
      }
    }
  return (
    <div>
      {files.length>0 && <p>Files Came</p>}
    </div>
  )
}

export default Home