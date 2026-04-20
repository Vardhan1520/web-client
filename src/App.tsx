/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';
import { Users, Building2, ChevronDown, Table as TableIcon, Database } from 'lucide-react';
import { DEPARTMENTS, EMPLOYEES } from './constants';
import { ResultRow } from './types';

export default function App() {
  // Logic: Calculate younger employees count
  const results: ResultRow[] = EMPLOYEES.map((emp) => {
    const dept = DEPARTMENTS.find((d) => d.DEPARTMENT_ID === emp.DEPARTMENT);
    
    // Younger means born AFTER them (later year/month/day)
    const youngerCount = EMPLOYEES.filter((other) => 
      other.DEPARTMENT === emp.DEPARTMENT && 
      new Date(other.DOB) > new Date(emp.DOB)
    ).length;

    return {
      EMP_ID: emp.EMP_ID,
      FIRST_NAME: emp.FIRST_NAME,
      LAST_NAME: emp.LAST_NAME,
      DEPARTMENT_NAME: dept?.DEPARTMENT_NAME || 'Unknown',
      YOUNGER_EMPLOYEES_COUNT: youngerCount,
    };
  }).sort((a, b) => b.EMP_ID - a.EMP_ID);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans p-6 md:p-12">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <header className="mb-12">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-3 mb-2"
          >
            <div className="p-2 bg-indigo-600 rounded-lg text-white">
              <Database size={24} />
            </div>
            <span className="text-sm font-bold tracking-widest text-indigo-600 uppercase">Analysis Report</span>
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-bold tracking-tight text-slate-900 leading-tight"
          >
            Employee Age Comparison <br />
            <span className="text-slate-400">By Department</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mt-4 text-slate-600 max-w-2xl text-lg leading-relaxed"
          >
            Calculating the number of younger colleagues within each respective department, 
            providing insights into departmental seniority and age distribution.
          </motion.p>
        </header>

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200"
          >
            <h3 className="flex items-center gap-2 font-semibold text-slate-800 mb-2">
              <Building2 size={18} className="text-indigo-500" />
              Departments Analyzed
            </h3>
            <p className="text-3xl font-bold text-slate-900">{DEPARTMENTS.length}</p>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200"
          >
            <h3 className="flex items-center gap-2 font-semibold text-slate-800 mb-2">
              <Users size={18} className="text-indigo-500" />
              Total Workforce
            </h3>
            <p className="text-3xl font-bold text-slate-900">{EMPLOYEES.length}</p>
          </motion.div>
        </div>

        {/* Results Table */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-200 overflow-hidden"
        >
          <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
            <h2 className="flex items-center gap-2 font-bold text-slate-800">
              <TableIcon size={20} className="text-slate-400" />
              Solution Output
            </h2>
            <div className="flex items-center gap-2 text-xs font-mono text-slate-400 bg-white px-2 py-1 rounded border border-slate-200">
              ORDER BY EMP_ID DESC
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/80">
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200">ID</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200">First Name</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200">Last Name</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200">Department</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-indigo-600 border-b border-slate-200 bg-indigo-50/30">Younger Count</th>
                </tr>
              </thead>
              <tbody>
                {results.map((row, idx) => (
                  <motion.tr 
                    key={row.EMP_ID}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 + idx * 0.05 }}
                    className="hover:bg-slate-50 transition-colors group"
                  >
                    <td className="px-6 py-4 text-slate-400 font-mono text-sm">{row.EMP_ID}</td>
                    <td className="px-6 py-4 font-semibold text-slate-900">{row.FIRST_NAME}</td>
                    <td className="px-6 py-4 text-slate-600">{row.LAST_NAME}</td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-800">
                        {row.DEPARTMENT_NAME}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-bold text-indigo-600 bg-indigo-50/10 group-hover:bg-indigo-50/20 transition-colors">
                      {row.YOUNGER_EMPLOYEES_COUNT}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.section>

        {/* Logic Explanation */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="mt-12 p-8 bg-slate-900 rounded-3xl text-slate-300"
        >
          <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <span className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-xs font-mono">SQL</span>
            Conceptual Query
          </h3>
          <pre className="font-mono text-sm overflow-x-auto bg-slate-800/50 p-6 rounded-xl border border-slate-800 text-indigo-300 leading-relaxed">
{`SELECT 
    e1.EMP_ID, 
    e1.FIRST_NAME, 
    e1.LAST_NAME, 
    d.DEPARTMENT_NAME,
    COUNT(e2.EMP_ID) AS YOUNGER_EMPLOYEES_COUNT
FROM EMPLOYEE e1
JOIN DEPARTMENT d ON e1.DEPARTMENT = d.DEPARTMENT_ID
LEFT JOIN EMPLOYEE e2 ON e1.DEPARTMENT = e2.DEPARTMENT 
                    AND e2.DOB > e1.DOB
GROUP BY e1.EMP_ID, e1.FIRST_NAME, e1.LAST_NAME, d.DEPARTMENT_NAME
ORDER BY e1.EMP_ID DESC;`}
          </pre>
          <p className="mt-4 text-sm text-slate-400 italic">
            Note: "Younger" is defined as having a Date of Birth (DOB) that is chronologically later than the reference employee.
          </p>
        </motion.div>

        <footer className="mt-12 text-center text-slate-400 text-sm pb-12">
          &copy; {new Date().getFullYear()} Seniority Analytics Solution
        </footer>
      </div>
    </div>
  );
}
