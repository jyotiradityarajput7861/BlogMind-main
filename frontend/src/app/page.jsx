'use client'

import React from 'react';
import {Tabs, Tab, Card, CardBody, Switch} from "@nextui-org/react";
import Bloglist from './(main)/listblog/page';
import Features from './Features/page';
import Listcomp from './(main)/competition/page';

import Links from './(main)/links/page';
import { Navbar } from '@/components/Nav';



const Home = () => {
  const [isVertical, setIsVertical] = React.useState(false);
  return (
    <>
    <Navbar />
    
    <div className="flex flex-col px-4">
      <div className="flex w-full flex-col">
        <Tabs aria-label="Options" className='justify-center py-4 ' >
          <Tab   title="Home" >
            <Card >
              <CardBody>
                <Features/>
                <Links/>
                     </CardBody>
            </Card>  
          </Tab>
          <Tab key="New" title="latest">
            <Card>
              <CardBody>
                <Bloglist/>           
              </CardBody>
            </Card>  
          </Tab>
          <Tab key="competition" title="Challenges">
            <Card>
              <CardBody>
                <Listcomp/>
              </CardBody>
            </Card>  
          </Tab>
        </Tabs>
      </div>
    </div>
  


    
    </>
  )
}

export default Home;