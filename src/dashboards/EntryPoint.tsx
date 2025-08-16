
"use client"
import React, { useState } from "react";
import NavbarMain from "./NavbarMain";
import Overview from "./Overview";
import DockerContainersMonitor from "./DockerMonitor";
import JenkinsDashboard from "./JenkinsMonitor";
import Monitoring from "./Monitoring";

const EntruyPoint: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>("overview");

  const renderActiveComponent = () => {
    switch (activeTab) {
      case "overview":
        return <Overview />;
      case "jenkins":
        return <JenkinsDashboard />;
      case "docker":
        return <DockerContainersMonitor />;
      case "monitoring":
        return <Monitoring />;
      default:
        return <Overview />;
    }
  };

  return (
    <div>
      <NavbarMain activeTab={activeTab} setActiveTab={setActiveTab} />
      {renderActiveComponent()}
    </div>
  );
}
export default EntruyPoint;