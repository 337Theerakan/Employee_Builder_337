<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class EmployeeController extends Controller
{

    public function index(Request $request)
{
    // รับค่าจาก query string ที่ส่งมาจากหน้าจอ (หน้าจอจะส่งค่า search, sortField, sortOrder)
    $query = $request->input('search');
    $sortField = $request->input('sortField', 'emp_no'); // คอลัมน์ที่จะจัดเรียง (ค่าเริ่มต้น emp_no)
    $sortOrder = $request->input('sortOrder', 'asc'); // ทิศทางการจัดเรียง (ค่าเริ่มต้น asc)

    $employees = DB::table("employees")
        ->where(function ($queryBuilder) use ($query) {
            if ($query) {
                $queryBuilder
                // ค้นหาจากชื่อ นามสกุล และรหัสพนักงาน ถ
                            ->where('first_name', 'like', '%' . $query . '%')
                             ->orWhere('last_name', 'like', '%' . $query . '%')
                             ->orWhere('hire_date', '=', $query)
                             ->orWhere('emp_no', $query);
            }
        })
        ->orderBy($sortField, $sortOrder) // เพิ่มการจัดเรียง
        ->paginate(10);
// ส่งข้อมูลไปที่หน้าจอพร้อมกับค่า query, sortField และ sortOrder
    return Inertia::render('Employee/Index', [
        // ส่งข้อมูลไปที่หน้าจอพร้อมกับค่า query, sortField และ sortOrder
        'employees' => $employees,
        // ส่งข้อมูลไปที่หน้าจอพร้อมกับค่า query, sortField และ sortOrder
        'query' => $query,
        'sortField' => $sortField,
        'sortOrder' => $sortOrder,
    ]);
}

    /**
     * Display a listing of the resource. ซากอารยธรรมที่ผมไม่เข้าใจ ณ ตอนนี้
     */
  /*  public function index(Request $request)
    {
        $query = $request->input('search'); // รับค่า หาได้ทั้งชื่อและนามสกุล

        $employees = DB::table('employees as e')
    ->leftJoin('titles as t', function ($join) {
        $join->on('e.emp_no', '=', 't.emp_no')
             ->where('t.to_date', '=', '9999-01-01');
    })
    ->leftJoin('dept_emp as de', 'e.emp_no', '=', 'de.emp_no')
    ->leftJoin('departments as d', 'de.dept_no', '=', 'd.dept_no')
    ->leftJoin('salaries as s', function ($join) {
        $join->on('e.emp_no', '=', 's.emp_no')
             ->where('s.to_date', '=', '9999-01-01');
    })
    ->where(function ($queryBuilder) use ($query) {
        if ($query) {
            $queryBuilder->where('e.first_name', 'like', '%' . $query . '%')
                         ->orWhere('e.last_name', 'like', '%' . $query . '%')
                         ->orWhere('e.emp_no', 'like', '%' . $query . '%');
        }
    })
    ->select(
        'e.emp_no',
        'e.first_name',
        'e.last_name',
        DB::raw('MAX(IFNULL(t.title, "N/A")) as title'),
        DB::raw('MAX(IFNULL(d.dept_name, "N/A")) as department'),
        DB::raw('MAX(IFNULL(s.salary, "N/A")) as salary'),
        'e.gender',
        'e.birth_date'
    )
    ->groupBy(
        'e.emp_no',
        'e.first_name',
        'e.last_name',
        'e.gender',
        'e.birth_date'
    )
    ->orderBy('e.emp_no')
    ->paginate(10);


        return Inertia::render('Employee/Index', [
            'employees' => $employees,
            'query' => $query,
        ]);
    }
*/
}
