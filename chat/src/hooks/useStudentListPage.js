
import { useState, useEffect } from 'react';
import { featchAllYear } from '../services/studentServices';

const useStudentListPage = () =>  {
   const [years, setYears] = useState([]); // 2014-2015 , ....
   const [selectedYear, setSelectedYear] = useState(''); // mã năm học để lọc 
   
   const fetchYears = async () => {
           try {
               let response = await featchAllYear();
               console.log('response', response);
               if (response && response.data) {
                   setYears(response.data.data);
                   setSelectedYear(response.data.data[0].MaNamHoc); // set year đầu tiên là mặc định
               }
           } catch (error) {
               console.error('Error fetching years:', error);
           }
       };
    return { years, selectedYear, setSelectedYear, fetchYears };
};


export default useStudentListPage;