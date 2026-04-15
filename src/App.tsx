import React, { useState } from "react";
import Layout from "./components/Layout";
import Dashboard from "./components/Dashboard";
import Scanner from "./components/Scanner";
import Recommendations from "./components/Recommendations";
import Market from "./components/Market";
import VoiceAssistant from "./components/VoiceAssistant";

export default function App() {
  const [activeTab, setActiveTab] = useState("home");

  const renderContent = () => {
    switch (activeTab) {
      case "home":
        return <Dashboard onNavigate={setActiveTab} />;
      case "scan":
        return <Scanner />;
      case "crops":
        return <Recommendations />;
      case "market":
        return <Market />;
      case "voice":
        return <VoiceAssistant />;
      default:
        return <Dashboard onNavigate={setActiveTab} />;
    }
  };

  return (
    <Layout activeTab={activeTab} onTabChange={setActiveTab}>
      {renderContent()}
    </Layout>
  );
}
