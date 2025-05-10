'use client'
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from "@heroui/react";

export default function App() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUserList = async () => {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/user/getall`);
      const data = res.data;
      console.log(data);
      setUsers(data.sort((a, b) => b.coins - a.coins));
    }
    fetchUserList();
  }, []);

  


  return (
    <Table aria-label="Example static collection table">
      <TableHeader key="header">
        <TableColumn>Rank</TableColumn>
        <TableColumn>NAME</TableColumn>
        <TableColumn>ROLE</TableColumn>
        <TableColumn>Coins</TableColumn>
      </TableHeader>
      <TableBody>
        {users.map((user) => (

          <TableRow key={user.id}>
            <TableCell>#{users.indexOf(user) + 1}</TableCell>
            <TableCell>{user.name}</TableCell>
            <TableCell>{user.role}</TableCell>
            <TableCell> <div className='flex flex-row gap-2 items-center '>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" className="w-10">
                <circle cx={100} cy={100} r={95} fill="maroon" stroke="darkgoldenrod" strokeWidth={5} />
                <circle cx={100} cy={100} r={70} fill="lightgoldenrodyellow" />
                <path d="M100 30 L110 80 L170 85 L120 120 L130 170 L100 140 L70 170 L80 120 L30 85 L90 80 Z" fill="black" stroke="darkgoldenrod" strokeWidth={2} />
                <circle cx={100} cy={100} r={98} fill="none" stroke="yellow" strokeWidth={3} opacity="0.5" />
              </svg> {user.coins}
        </div> 
    </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}