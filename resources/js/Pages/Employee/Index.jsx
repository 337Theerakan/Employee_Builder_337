import { router } from '@inertiajs/react';
import { useState, useEffect } from 'react';

export default function Index({ employees, query, sortField, sortOrder }) {

  // สถานะสำหรับการค้นหา
  const [search, setSearch] = useState('');

  // สถานะสำหรับฟิลด์และลำดับการจัดเรียง
  const [sort, setSort] = useState({ field: sortField || 'emp_no', order: sortOrder || 'asc' });

  // สถานะสำหรับการโหลด
  const [loading, setLoading] = useState(false);

  // ใช้ effect เพื่อกำหนดค่าการค้นหาตาม prop query
  useEffect(() => {
    setSearch(query || '');
  }, [query]);

  //async คือคีย์เวิร์ดที่ใช้ในการประกาศฟังก์ชัน การดำเนินการที่ไม่ต้องรอให้กระบวนการหนึ่งเสร็จสิ้น
  // ฟังก์ชันสำหรับจัดการการส่งฟอร์มค้นหา
  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    await router.get('/employee', { search, sortField: sort.field, sortOrder: sort.order });
    setLoading(false);
  };

  // ฟังก์ชันสำหรับจัดการการจัดเรียงตามฟิลด์
  const handleSort = async (field) => {
    const newOrder = sort.field === field && sort.order === 'asc' ? 'desc' : 'asc';
    setSort({ field, order: newOrder });
    setLoading(true);
    {/* ส่งค่าการจัดเรียงใหม่ไปยังเซิร์ฟเวอร์ และรีเซ็ตหน้าเป็นหน้าที่ 1*/ }
    await router.get('/employee', { search, sortField: field, sortOrder: newOrder });
    setLoading(false);
  };
//await เป็นคำสั่งใน JavaScript ที่ใช้ภายในฟังก์ชันที่ประกาศด้วย async
  const handlePagination = async (page) => {
    setLoading(true);
    await router.get('/employee', { search, page, sortField: sort.field, sortOrder: sort.order });
    setLoading(false);
  };

  return (

    <div className="container mx-auto p-6 bg-gray-800 text-white">
      {loading && (
        <div className="flex justify-center items-center text-xl mb-4">
          <svg className="animate-spin h-5 w-5 mr-3 text-green-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 1 0 16 0A8 8 0 0 0 4 12z"></path>
          </svg>
          Loading...
        </div>
      )}
      <h1 className="text-3xl font-semibold text-center mb-6 text-green-500">Employee List</h1>

      {/* Search Form */}
      <form onSubmit={handleSearch} className="mb-6 flex justify-center">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name..."
          className="p-2 border-2 border-gray-500 rounded-md w-1/2 bg-gray-700 text-white focus:ring-2 focus:ring-green-500"
        />
        <button type="submit" className="ml-4 p-2 bg-green-500 text-white rounded-md hover:bg-green-600 focus:ring-4 focus:ring-green-300 transition-all">
          Search
        </button>
      </form>

      {/* Employee Table */}
      <table className="min-w-full table-auto bg-gray-800 border-collapse border border-gray-500 shadow-md sm:table-fixed">
        <thead className="bg-green-500">
          <tr>
            <th className="px-4 py-2 cursor-pointer text-left font-medium" onClick={() => handleSort('emp_no')}>
              ID {sort.field === 'emp_no' && (sort.order === 'asc' ? '▲' : '▼')}
            </th>
            <th className="px-4 py-2 cursor-pointer text-left font-medium" onClick={() => handleSort('first_name')}>
              First Name {sort.field === 'first_name' && (sort.order === 'asc' ? '▲' : '▼')}
            </th>
            <th className="px-4 py-2 cursor-pointer text-left font-medium" onClick={() => handleSort('last_name')}>
              Last Name {sort.field === 'last_name' && (sort.order === 'asc' ? '▲' : '▼')}
            </th>
            <th className="px-4 py-2 cursor-pointer text-left font-medium" onClick={() => handleSort('gender')}>
              Gender {sort.field === 'gender' && (sort.order === 'asc' ? '▲' : '▼')}
            </th>
            <th className="px-4 py-2 cursor-pointer text-left font-medium" onClick={() => handleSort('birth_date')}>
              Birth Date {sort.field === 'birth_date' && (sort.order === 'asc' ? '▲' : '▼')}
            </th>
            <th className="px-4 py-2 cursor-pointer text-left font-medium" onClick={() => handleSort('hire_date')}>
              Hire Date {sort.field === 'hire_date' && (sort.order === 'asc' ? '▲' : '▼')}
            </th>
          </tr>
        </thead>
        <tbody className="space-y-1">
          {employees.data.length === 0 ? (
            <tr>
              <td colSpan="6" className="text-center py-4 text-gray-500">
                บ่มีข้อมูล
              </td>
            </tr>
          ) : (
            employees.data.map((employee) => (
              <tr key={employee.emp_no} className="border-b hover:bg-gray-700">
                <td className="px-4 py-2 text-gray-300">{employee.emp_no}</td>
                <td className="px-4 py-2 text-gray-300">{employee.first_name}</td>
                <td className="px-4 py-2 text-gray-300">{employee.last_name}</td>
                <td className="px-4 py-2 text-gray-300">{employee.gender === 'M' ? 'Male' : 'Female'}</td>
                <td className="px-4 py-2 text-gray-300">{employee.birth_date}</td>
                <td className="px-4 py-2 text-gray-300">{employee.hire_date}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* Pagination Controls  */}
      <div className="flex justify-center space-x-2 mt-6">
        {/* Previous Button */}
        {employees.prev_page_url && (
          <button onClick={() => handlePagination(employees.current_page - 1)} className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 focus:ring-2 focus:ring-green-500">
            Previous
          </button>
        )}

        {/* Page Numbers */}
        {(() => {
          const totalPages = employees.last_page;
          const currentPage = employees.current_page;
          const maxVisiblePages = 5;

          let startPage = Math.max(currentPage - Math.floor(maxVisiblePages / 2), 1);
          let endPage = Math.min(startPage + maxVisiblePages - 1, totalPages);

          if (endPage - startPage + 1 < maxVisiblePages) {
            startPage = Math.max(endPage - maxVisiblePages + 1, 1);
          }

          // สร้างปุ่มเลขหน้า โดยใช้ Array.from และ map ในการสร้าง array ของปุ่ม
          return Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i).map(
            (page) => (
              <button
                key={page}
                onClick={() => handlePagination(page)}
                className={`px-4 py-2 rounded-md ${currentPage === page ? 'bg-green-500 text-white' : 'bg-gray-700 text-white'} focus:ring-2 focus:ring-green-500`}
              >
                {page}
              </button>
            )
          );
        })()}

        {/* Next Button */}
        {employees.next_page_url && (
          <button onClick={() => handlePagination(employees.current_page + 1)} className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 focus:ring-2 focus:ring-green-500">
            Next
          </button>
        )}
      </div>
    </div>
  );
}
