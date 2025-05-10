'use client'
import React from 'react'
import {Tabs, Tab, Card, CardBody, Switch} from "@heroui/react";
import Profile from '../profile/page';
import Manageblog from '../manageblog/page';
import UpdateProfile from '../profile-upadate/page';

// Changed function name from 'page' to 'Dashboard' (uppercase first letter)
const Dashboard = () => {
  const [isVertical, setIsVertical] = React.useState(true);
  return (
    <div>
      <div className="flex flex-col px-4">
      <Switch className="mb-4" isSelected={isVertical} onValueChange={setIsVertical}>
        Vertical
      </Switch>
      <div className="flex w-full flex-col">
        <Tabs aria-label="Options" isVertical={isVertical}>
          <Tab key="Profile"  title="Profile">
            <Card className='w-screen'>
              <Profile/>
            </Card>
          </Tab>
          <Tab key="Updateprofile" title="Update">
            <Card>
              <CardBody className='w-screen'>
                <UpdateProfile/>
              </CardBody>
            </Card>
          </Tab>
          <Tab key="Your blogs" title="Your Blogs">
            <Card>
              <CardBody className='w-screen'>
                <Manageblog/>
              </CardBody>
            </Card>
          </Tab>
        </Tabs>
      </div>
    </div>
    </div>
  )
}

// Update the export name too
export default Dashboard;