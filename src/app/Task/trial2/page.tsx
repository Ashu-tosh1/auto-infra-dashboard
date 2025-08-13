"use client"

import React, { useEffect, useState } from "react";


const Page = () => {
    

    interface Build{
        number: number;
        result: string | null;
        timestamp: number;
        duration: number;
        description: string | null;
    }

    interface JenkinsResponse {
        builds: Build[];
    }

    const [Builds,setBuilds] =useState<Build[]>([])

    
    useEffect(() => {
        
        const fetchbuilds = async () => {
            try {
                const response = await fetch('/api/jenkins-builds');
                if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
               
                const data: JenkinsResponse = await response.json();
                setBuilds(data.builds);

            }
            catch {
                console.error('Failed to fetch build data');
            }
        }

        fetchbuilds();
        const interval = setInterval(fetchbuilds, 30000);
        return () => clearInterval(interval);
    },[])

    const latestBuild = Builds[0];

    return(
        <>
            <h1>
               
                <div>
                    {latestBuild?.result || 'No build found'}
                    <div>
                    {latestBuild?.description || 'No description'}
                    </div>
                    <div>
                    {latestBuild?.duration || 'No duration'}
                    </div>
                    <div>
                    {latestBuild?.timestamp || 'No timestamp'}
                    </div>
                    <div>  
                    {latestBuild?.number || 'No number'}
                    </div>

            </div>
            </h1>

        </>
            
    )

}

export default Page;