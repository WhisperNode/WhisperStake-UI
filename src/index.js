import Bugsnag from '@bugsnag/js'
import BugsnagPluginReact from '@bugsnag/plugin-react'
import React from 'react';

import ReactDOM from 'react-dom';
import {
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom";

import NetworkFinder from './components/NetworkFinder'
import reportWebVitals from './utils/reportWebVitals';

import './index.css';

const app = (
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<NetworkFinder />} />
        <Route path="/:network" element={<NetworkFinder />} />
        <Route path="/:network/vote" element={<NetworkFinder />} />
        <Route path="/:network/vote/:proposalId" element={<NetworkFinder />} />
        <Route path="/:network/grant" element={<NetworkFinder />} />
        <Route path="/:network/:validator" element={<NetworkFinder />} />
        <Route path="/:network/:validator/:section" element={<NetworkFinder />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
)

import { inject } from '@vercel/analytics';
 
inject();
