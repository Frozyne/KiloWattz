import React from 'react'

const Greeting = () => {
  return (
    <div className="flex justify-start mt-15 p-3 border rounded-lg bg-accent m-5">
        <div className="flex flex-col">
            <small className="text-sm text-primary">GOOD AFTERNOON, PRAISE</small>
            <strong className="text-3xl tracking-widest">Your energy at a glance.</strong>
            <p className="text-sm text-primary">Select your profile in the upper-right corner to view resident and meter details</p>
        </div>
    </div>
  )
}

export default Greeting