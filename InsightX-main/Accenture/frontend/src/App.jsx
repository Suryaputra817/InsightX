import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';
import Investigations from './pages/Investigations';
import InvestigationDetail from './pages/InvestigationDetail';
import EvidenceExplorer from './pages/EvidenceExplorer';
import Recommendations from './pages/Recommendations';
import ActionCenter from './pages/ActionCenter';
import StageDetail from './pages/StageDetail';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Landing Page is full-width, no sidebar layout */}
        <Route path="/" element={<Landing />} />

        {/* Workspace Routes wrapped in Layout */}
        <Route 
          path="/dashboard" 
          element={
            <Layout>
              <Dashboard />
            </Layout>
          } 
        />
        <Route 
          path="/investigations" 
          element={
            <Layout>
              <Investigations />
            </Layout>
          } 
        />
        <Route 
          path="/investigations/:id" 
          element={
            <Layout>
              <InvestigationDetail />
            </Layout>
          } 
        />
        <Route 
          path="/investigations/:id/evidence" 
          element={
            <Layout>
              <EvidenceExplorer />
            </Layout>
          } 
        />
        <Route 
          path="/recommendations" 
          element={
            <Layout>
              <Recommendations />
            </Layout>
          } 
        />
        <Route 
          path="/actions" 
          element={
            <Layout>
              <ActionCenter />
            </Layout>
          } 
        />
        <Route 
          path="/stage/:id" 
          element={
            <Layout>
              <StageDetail />
            </Layout>
          } 
        />
      </Routes>
    </BrowserRouter>
  );
}
