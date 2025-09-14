import React from 'react';
export default function SeatsManager(){
  const [seats, setSeats] = React.useState<number>(5);
  return (<div data-testid="seats-manager">
    <h2 className="text-xl font-semibold">Seats</h2>
    <div className="mt-2">Seats: {seats} <button onClick={()=>setSeats(seats+1)}>+1</button> <button onClick={()=>setSeats(Math.max(1,seats-1))}>-1</button></div>
  </div>);
}