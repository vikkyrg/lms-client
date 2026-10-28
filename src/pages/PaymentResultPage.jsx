import React from 'react';
import { Link, useSearchParams } from 'react-router-dom';

const PaymentResultPage = () => {
  const [params] = useSearchParams();
  const status = params.get('status') || 'pending';
  const successful = status === 'success';

  return (
    <div className="max-w-xl mx-auto px-4 py-20 text-center">
      <div className={`mx-auto w-14 h-14 rounded-full flex items-center justify-center text-2xl font-bold ${successful ? 'bg-green-100 text-green-700' : 'bg-[#FFF2BF] text-[#173563]'}`}>
        {successful ? '✓' : '…'}
      </div>
      <h1 className="mt-5 text-3xl font-extrabold text-[#173563]">{successful ? 'Payment received' : 'Payment status'}</h1>
      <p className="mt-3 text-slate-600">{successful ? 'Your payment is being confirmed securely. Your course will be available after backend verification.' : 'If you completed checkout, please check My Learning shortly. Unsuccessful payments do not grant course access.'}</p>
      <div className="mt-7 flex justify-center gap-3">
        <Link to="/student/courses" className="rounded-xl bg-[#173563] px-5 py-3 font-bold text-white">My Learning</Link>
        <Link to="/courses" className="rounded-xl border border-[#173563] px-5 py-3 font-bold text-[#173563]">Browse courses</Link>
      </div>
    </div>
  );
};

export default PaymentResultPage;
