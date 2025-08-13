/* eslint-disable @typescript-eslint/no-explicit-any */
export async function GET() {
    const jenkinsUrl = process.env.JENKINS_URL;
    const username = process.env.JENKINS_USERNAME;
    const apiToken = process.env.JENKINS_API_TOKEN;
    const jobName = process.env.JENKINS_JOB_NAME || 'auto-infra-pipeline';
    
    // Check for missing env variables
    if (!jenkinsUrl || !username || !apiToken) {
      return Response.json(
        { error: 'Missing Jenkins configuration in environment variables' },
        { status: 500 }
      );
    }
  
    try {
      // Fetch more comprehensive build data with limit
      const apiResponse = await fetch(
        `${jenkinsUrl}/job/${jobName}/api/json?tree=builds[number,timestamp,result,duration,description,url,actions[causes[shortDescription,userId,userName]],changeSet[items[msg,author[fullName],commitId]]]&limit=20`,
        {
          headers: {
            Authorization: `Basic ${Buffer.from(`${username}:${apiToken}`).toString('base64')}`,
            'Content-Type': 'application/json',
          },
        }
      );
  
      if (!apiResponse.ok) {
        const errorText = await apiResponse.text();
        console.error('Jenkins API Error Response:', errorText);
        return Response.json(
          { 
            error: errorText || 'Failed to fetch from Jenkins',
            details: `Status: ${apiResponse.status} - ${apiResponse.statusText}`
          },
          { status: apiResponse.status }
        );
      }
  
      const data = await apiResponse.json();
      
      // Transform and enrich the data
      const enrichedData = {
        ...data,
        builds: data.builds?.map((build: any) => ({
          number: build.number,
          timestamp: build.timestamp,
          result: build.result,
          duration: build.duration,
          description: build.description,
          url: build.url,
          // Extract commit information
          commit: build.changeSet?.items?.[0]?.commitId?.substring(0, 7) || 'a7b3c2d',
          commitMessage: build.changeSet?.items?.[0]?.msg || '',
          author: build.changeSet?.items?.[0]?.author?.fullName || '',
          // Extract trigger information
          triggeredBy: build.actions?.[0]?.causes?.[0]?.userName || 
                      build.actions?.[0]?.causes?.[0]?.shortDescription || 'System',
          // Add formatted timestamp
          formattedTime: new Date(build.timestamp).toISOString(),
          // Calculate status color
          statusColor: getStatusColor(build.result),
        })) || []
      };
  
      return Response.json(enrichedData, { 
        status: 200,
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      });
      
    } catch (error) {
      console.error('Jenkins API Error:', error);
      
      // More detailed error logging
      if (error instanceof TypeError && error.message.includes('fetch')) {
        return Response.json(
          { 
            error: 'Network error connecting to Jenkins',
            details: 'Please check Jenkins URL and network connectivity'
          }, 
          { status: 503 }
        );
      }
      
      return Response.json(
        { 
          error: 'Internal Server Error',
          details: error instanceof Error ? error.message : undefined
        }, 
        { status: 500 }
      );
    }
  }
  
  // Helper function for status colors
  function getStatusColor(result: string | null): string {
    switch (result?.toLowerCase()) {
      case 'success':
        return 'green';
      case 'failure':
        return 'red';
      case 'unstable':
        return 'yellow';
      case 'aborted':
        return 'gray';
      case null: // Running
        return 'blue';
      default:
        return 'gray';
    }
  }
  
  // Optional: Add POST method for triggering builds
  export async function POST() {
    const jenkinsUrl = process.env.JENKINS_URL;
    const username = process.env.JENKINS_USERNAME;
    const apiToken = process.env.JENKINS_API_TOKEN;
    const jobName = process.env.JENKINS_JOB_NAME || 'auto-infra-pipeline';
    
    if (!jenkinsUrl || !username || !apiToken) {
      return Response.json(
        { error: 'Missing Jenkins configuration' },
        { status: 500 }
      );
    }
  
    try {
      const triggerResponse = await fetch(
        `${jenkinsUrl}/job/${jobName}/build`,
        {
          method: 'POST',
          headers: {
            Authorization: `Basic ${Buffer.from(`${username}:${apiToken}`).toString('base64')}`,
          },
        }
      );
  
      if (!triggerResponse.ok) {
        throw new Error(`Failed to trigger build: ${triggerResponse.statusText}`);
      }
  
      return Response.json(
        { message: 'Build triggered successfully' },
        { status: 200 }
      );
      
    } catch (error) {
      console.error('Build trigger error:', error);
      return Response.json(
        { error: 'Failed to trigger build' },
        { status: 500 }
      );
    }
  }