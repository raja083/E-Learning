import React from 'react'
import { Card,CardTitle,CardHeader, CardContent } from '@/components/ui/card'
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { useGetPurchasedCoursesQuery, useGetRevenueQuery } from '@/features/api/purchaseApi';

const Dashboard = () => {

  const {data, isSuccess, isError, isLoading} = useGetRevenueQuery();
  
  if(isLoading) return <h1>Loading...</h1>
  if(isError) return <h1>Failed to get purchased course</h1>

  const totalRevenue = data.totalSales;

  const totalSales = data.salesCount;
  return (
    <div className='grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'>
      <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
        <CardHeader>
          <CardTitle>Total Sales</CardTitle>
        </CardHeader>
        <CardContent>
          <p className='text-3xl font-bold text-blue-600'>{totalSales}</p>
        </CardContent>
      </Card>

         <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
        <CardHeader>
          <CardTitle>Total Revenue</CardTitle>
        </CardHeader>
        <CardContent>
          <p className='text-3xl font-bold text-blue-600'>{totalRevenue}</p>
        </CardContent>
      </Card>
      
    </div>
  )
}

export default Dashboard;
