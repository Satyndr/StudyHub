import React from 'react'
import { useParams } from 'react-router'
import { useState } from 'react';
import { categories } from '../services/apis';
import { apiConnector } from '../services/apiconnector';
import { useEffect } from 'react';
import Course_Slide from '../components/core/Catalog/Course_Slide';
import { getCatalogPageData } from '../services/operations/pageAndComponentData';
import Course_Card from '../components/core/Catalog/Course_Card';
import { useDispatch } from 'react-redux';

const Catalog = () => {

  const Catalog = useParams();
  const [Desc, setDesc] = useState([]);
  const [CatalogPageData, setCatalogPageData] = useState(null);
  const [categoryID, setcategoryID] = useState(null);
  const [activeOption, setActiveOption] = useState(1);
  const dispatch = useDispatch();


  const fetchSublinks=  async ()=>{
    try {
        const result = await apiConnector("GET",categories.CATEGORIES_API);
        // console.log("result.....",result);
        // console.log("params catalog...",Catalog)
        const category_id= result.data.allCategories.filter((item)=>item.name=== Catalog.catalogName)[0]._id;
        // console.log("Category id....", category_id);
        setcategoryID(category_id);
        setDesc(result.data.allCategories.filter((item)=>item.name=== Catalog.catalogName)[0]);
        // console.log("Desc",Desc); 
    } catch (error) {
        console.log("could not fetch sublinks");
        console.log(error);
    }
}
useEffect(() => {
    fetchSublinks();
}, [Catalog])

useEffect(() => {
    const fetchCatalogPageData = async () => {
        
            const result = await getCatalogPageData(categoryID,dispatch);
            setCatalogPageData(result?.data);
            // console.log("page data",CatalogPageData?.data);
        
    }
    if (categoryID) {
        fetchCatalogPageData();
    }
}, [categoryID])


  return (
    <div className=''>
      <div className='box-content bg-richblack-800 px-4'>
      <div className='ml-11 mx-auto flex min-h-[260px]  flex-col justify-center gap-4 '>
        <p className='text-sm text-richblack-300'>Home / Catalog / <span className='text-yellow-25'>{Catalog.catalogName}</span> </p>
        <p className='text-3xl text-richblack-5'>{Catalog.catalogName}</p>
        <p className='max-w-[870px] text-richblack-200'>
          {Desc?.description}
        </p>
      </div>
      </div>

      <div className=' mx-auto box-content w-full max-w-maxContentTab px-2 py-12 lg:max-w-maxContent text-richblack-100'>
        <h2 className='text-4xl'>
        Courses to get you started
        </h2>
        <div className='my-4 flex border-b border-b-richblack-600 text-sm'>
          <button onClick={()=>{setActiveOption(1)}}  className={activeOption===1? `px-4 py-2 border-b border-b-yellow-25 text-yellow-25 cursor-pointer`:`px-4 py-2 text-richblack-50 cursor-pointer` }>Most Populer</button>
          <button onClick={()=>{setActiveOption(2)}} className={activeOption===1?'px-4 py-2 text-richblack-50 cursor-pointer':'px-4 py-2 border-b border-b-yellow-25 text-yellow-25 cursor-pointer'}>New</button>
        </div>
        <Course_Slide Courses={CatalogPageData?.selectedCourses}/>        
      </div>

      <div className=' mx-auto box-content w-full max-w-maxContentTab px-4 py-12 lg:max-w-maxContent'>
        <h2 className='section_heading mb-6 md:text-3xl text-xl'>
          Similar to {Catalog.catalogName}
        </h2>
        <Course_Slide Courses={CatalogPageData?.differentCourses}/>
      </div>
      
      <div className=' mx-auto box-content w-full max-w-maxContentTab px-2 py-12 lg:max-w-maxContent'>
        <h2 className='section_heading mb-6 md:text-3xl text-xl'>
          Frequently BoughtTogether
          </h2>
          <div className='grid grid-cols-2 gap-3 lg:gap-6 lg:grid-cols-2 pr-4'>
            {
              CatalogPageData?.mostSellingCourses?.map((item,index)=>(
                 <Course_Card key={index} course={item} Height={"h-[100px] lg:h-[400px]"} />
              ))
            }
          </div>
      </div>

    </div>
  )
}

export default Catalog