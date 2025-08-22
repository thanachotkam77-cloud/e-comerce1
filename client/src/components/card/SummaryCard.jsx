import React from 'react'

const SummaryCard = () => {
    return (
        <div className='mx-auto'>
            <div className='flex flex-warp gap-4'>
                {/* Left */}
                <div className='w-2/4'>
                    <div className='bg-gray-100 p-4 rounded-md border-amber-50 shadow-md space-y-4'>
                        <h1 className='font-bold text-lg'>ที่อยู่ในการจัดส่ง</h1>
                        <textarea className='w-full bg-white px-2 rounded-md'></textarea>

                        <button className='bg-blue-500 text-white px-4 py-4 rounded-md shadow-md hover:bg-blue-700 hover:scale-105 hover:translate-y-1 hover:duration-200'>
                            Save Address</button>
                    </div>

                </div>

                {/* Right */}
                <div className='w-2/4'>
                    <div className='bg-gray-100 p-4 rounded-md border-amber-50 shadow-md space-y-4'>
                        <h1 className='font-bold text-lg'>คำสั่งซื้อของคุณ</h1>

                        {/* Item List */}
                        <div>
                            <div className='flex justify-between items-end'>
                                <div>
                                    <p>Asus</p>
                                    <p>จำนวน : 1 x 2,900</p>
                                </div>

                                <div>
                                    <p className='text-red-500 font-bold'>20,000</p>
                                </div>
                            </div>
                        </div>

                        <div>
                            <div className='flex justify-between'>
                                <p>ค่าจัดส่ง</p>
                                <p>0.00</p>
                            </div>
                            <div className='flex justify-between'>
                                <p>ส่วนลด</p>
                                <p>0.00</p>
                            </div>
                        </div>
                        <hr className='text-gray-300 shadow-md'/>
                        <div>
                            <div className='font-bold flex justify-between'>
                                <p className=''>ยอดรวมสุทธิ</p>
                                <p className='text-red-500 text-lg'>0.00</p>
                            </div>
                        </div>

                    </div>



                </div>
            </div>
        </div>
    )
}

export default SummaryCard