'use client';

import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import ToolPageHeader from '@/components/ToolPageHeader';
import Footer from '@/components/Footer';

export default function AgeCalculatorTool() {
  const [dob, setDob] = useState('');
  const [maxDate, setMaxDate] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMaxDate(new Date().toISOString().split('T')[0]);
  }, []);

  const [result, setResult] = useState<{
    years: number;
    months: number;
    days: number;
    totalDays: number;
    totalMonths: number;
    nextBday: number;
  } | null>(null);

  const calculateAge = () => {
    if (!dob) {
      setError('Please select your date of birth.');
      setResult(null);
      return;
    }

    const dobDate = new Date(dob);
    const today = new Date();

    if (dobDate > today) {
      setError('Date of birth cannot be in the future.');
      setResult(null);
      return;
    }

    setError('');

    // Years, months, days calculation
    let years = today.getFullYear() - dobDate.getFullYear();
    let months = today.getMonth() - dobDate.getMonth();
    let days = today.getDate() - dobDate.getDate();

    if (days < 0) {
      months--;
      const lastMonth = new Date(today.getFullYear(), today.getMonth(), 0);
      days += lastMonth.getDate();
    }
    if (months < 0) {
      years--;
      months += 12;
    }

    // Total days & months lived
    const msPerDay = 1000 * 60 * 60 * 24;
    // Calculate total days accounting for timezones to avoid offset issues
    const utcToday = Date.UTC(today.getFullYear(), today.getMonth(), today.getDate());
    const utcDob = Date.UTC(dobDate.getFullYear(), dobDate.getMonth(), dobDate.getDate());
    const totalDays = Math.floor((utcToday - utcDob) / msPerDay);
    const totalMonths = years * 12 + months;

    // Days until next birthday
    const nextBirthday = new Date(today.getFullYear(), dobDate.getMonth(), dobDate.getDate());
    if (nextBirthday < today) {
      nextBirthday.setFullYear(today.getFullYear() + 1);
    }
    const daysToNextBday = Math.ceil((nextBirthday.getTime() - today.getTime()) / msPerDay);

    setResult({
      years,
      months,
      days,
      totalDays,
      totalMonths,
      nextBday: daysToNextBday
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans flex flex-col">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 w-full">
        <ToolPageHeader toolName="Age Calculator" theme="light" />
      </div>
      
      <main className="flex-1 max-w-lg w-full mx-auto p-4 sm:p-6 lg:p-8 mt-8">
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-8 md:p-10">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-blue-900 mb-2">🎂 Age Calculator</h1>
            <p className="text-slate-500">Calculate your exact age in years, months, and days instantly</p>
          </div>

          <div className="mb-6">
            <label htmlFor="dob" className="block text-sm font-semibold text-slate-700 mb-2">
              Date of Birth
            </label>
            <input 
              type="date" 
              id="dob" 
              value={dob}
              onChange={(e) => setDob(e.target.value)}
              max={maxDate}
              className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl font-medium outline-none focus:border-blue-600 transition-colors bg-white text-slate-900"
            />
            {error && (
              <p className="text-red-600 text-sm mt-2 font-medium">{error}</p>
            )}
          </div>

          <button 
            onClick={calculateAge}
            className="w-full bg-blue-600 text-white py-4 px-6 rounded-xl font-bold hover:bg-blue-700 transition-colors shadow-sm"
          >
            Calculate Age
          </button>

          {result && (
            <div className="mt-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6 text-center mb-4">
                <div className="text-3xl sm:text-4xl font-extrabold text-blue-900 mb-1">
                  {result.years}y {result.months}m {result.days}d
                </div>
                <div className="text-sm font-medium text-slate-500">Your current age</div>
              </div>
              
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-slate-50 border border-slate-100 rounded-xl p-3 text-center">
                  <div className="text-xl font-bold text-blue-600">{result.totalDays.toLocaleString()}</div>
                  <div className="text-xs font-medium text-slate-500 mt-1">Total Days</div>
                </div>
                <div className="bg-slate-50 border border-slate-100 rounded-xl p-3 text-center">
                  <div className="text-xl font-bold text-blue-600">{result.totalMonths.toLocaleString()}</div>
                  <div className="text-xs font-medium text-slate-500 mt-1">Total Months</div>
                </div>
                <div className="bg-slate-50 border border-slate-100 rounded-xl p-3 text-center">
                  <div className="text-xl font-bold text-blue-600">{result.nextBday}</div>
                  <div className="text-xs font-medium text-slate-500 mt-1">Days to Next Bday</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
